# frp 内网穿透：多个 Web 服务如何共用公网 80 端口

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

多个内网 Web 服务可共用公网 80 端口。纯 frp 直接按域名转发；公网服务器已有网站时，可由 Nginx 统一接收请求，将内网域名交给 frp，其余网站沿用各自的配置。

- [部署背景](#部署背景)
- [部署架构](#部署架构)
- [前置条件](#前置条件)
- [公网服务器配置](#公网服务器配置)
  - [服务端 `compose.yaml`](#服务端-composeyaml)
  - [`frps.toml`](#frpstoml)
- [内网主机配置](#内网主机配置)
  - [客户端 `compose.yaml`](#客户端-composeyaml)
  - [`frpc.toml`](#frpctoml)
- [验证转发](#验证转发)
- [使用 Nginx 共用公网端口](#使用-nginx-共用公网端口)
  - [启用 Nginx 的服务端 Compose](#启用-nginx-的服务端-compose)
  - [`nginx.conf`](#nginxconf)
- [参考资料](#参考资料)

## 部署背景

本文沿用 [Docker Compose 部署 frp 的基础配置](https://blog.mazey.net/6572.html)，将 Web 流量的入口改为基于域名的 HTTP 代理。

## 部署架构

`浏览器` → HTTP → `公网服务器:80` → `frps:8080` → `frpc` → `内网 Web 服务`

- `app.example.com` 和 `api.example.com` 指向同一台公网服务器。
- `app.example.com` 转发到 `WEB_SERVER:8000`，`api.example.com` 转发到 `API_SERVER:8080`。
- `7000` 仍用于 `frpc` 连接 `frps`。示例中的域名和 Compose 服务名均可替换为实际值。

## 前置条件

- 两台主机均已安装 Docker 与 Docker Compose。运行基础示例前，确认公网服务器的 TCP `80` 和 `7000` 可用。
- 部署时，将两个示例域名替换为实际域名。`frpc.toml` 中的 `customDomains` 须与访问时使用的域名一致。使用域名直接访问前，将 DNS 记录指向公网服务器。DNS 尚未配置时，可参照 [Nginx 扩展示例](#使用-nginx-共用公网端口)用 `curl --resolve` 验证。
- 为两端的 `AUTH_TOKEN` 设置同一个高强度随机密钥。开放公网 TCP `80` 供用户访问，并允许内网主机连接 TCP `7000`。

## 公网服务器配置

基础示例只运行 `frps`。将以下两个配置文件放在公网服务器的同一目录下，并将挂载路径中的 `/PATH` 替换为该目录的实际绝对路径，例如 `/opt/frp`。端口映射 `"80:8080"` 将来自公网的 HTTP 请求直接交给 `frps`。

### 服务端 `compose.yaml`

```yaml
services:
  frps:
    image: fatedier/frps:v0.68.0
    restart: unless-stopped
    command: ["-c", "/etc/frp/frps.toml"]
    ports:
      - "7000:7000"
      - "80:8080"
    volumes:
      - "/PATH/frps.toml:/etc/frp/frps.toml:ro"
```

### `frps.toml`

```toml
bindPort = 7000
auth.token = "AUTH_TOKEN"
vhostHTTPPort = 8080
```

在公网服务器的 Compose 目录运行 `docker compose up -d`。

## 内网主机配置

将以下两个配置文件放在内网主机的同一目录下，并将挂载路径中的 `/PATH` 替换为该目录的实际绝对路径。两个业务容器分别返回固定文本，便于确认请求到达正确的后端。换成实际业务时，确保 `frpc` 能在共享网络中通过服务名访问对应端口。

### 客户端 `compose.yaml`

```yaml
services:
  frpc:
    image: fatedier/frpc:v0.68.0
    restart: unless-stopped
    command: ["-c", "/etc/frp/frpc.toml"]
    volumes:
      - "/PATH/frpc.toml:/etc/frp/frpc.toml:ro"
    depends_on:
      - WEB_SERVER
      - API_SERVER

  WEB_SERVER:
    image: busybox:1.37
    command:
      - sh
      - -ec
      - |
        mkdir -p /www
        printf '%s\n' 'web backend' > /www/index.html
        exec httpd -f -p 8000 -h /www

  API_SERVER:
    image: busybox:1.37
    command:
      - sh
      - -ec
      - |
        mkdir -p /www
        printf '%s\n' 'api backend' > /www/index.html
        exec httpd -f -p 8080 -h /www
```

### `frpc.toml`

将 `203.0.113.10` 替换为公网服务器的实际 IP，并使用与服务端相同的鉴权密钥。

```toml
serverAddr = "203.0.113.10"
serverPort = 7000
auth.token = "AUTH_TOKEN"

[[proxies]]
name = "web-http"
type = "http"
localIP = "WEB_SERVER"
localPort = 8000
customDomains = ["app.example.com"]

[[proxies]]
name = "api-http"
type = "http"
localIP = "API_SERVER"
localPort = 8080
customDomains = ["api.example.com"]
```

在内网主机的 Compose 目录运行 `docker compose up -d`。

## 验证转发

两端启动后，在内网主机运行 `docker compose logs frpc`，确认 `web-http` 和 `api-http` 都已启动。从外网访问以下地址，并将域名替换为实际域名。

```bash
curl --fail --show-error http://app.example.com/
curl --fail --show-error http://api.example.com/
```

两个请求共用公网服务器的 `80` 端口，预期分别返回 `web backend` 和 `api backend`。

## 使用 Nginx 共用公网端口

公网服务器上已有其他网站或 Web 服务时，可由一个 Nginx 实例统一监听 `80`。此时只需调整公网侧的 HTTP 入口，两端的 TOML 文件和内网主机的 Compose 文件继续沿用基础示例。

- `www.example.com` → `Nginx:80` → `public-site:8000` (公网服务器上的现有网站)。
- `app.example.com` → `Nginx:80` → `frps:8080` → `frpc` → `WEB_SERVER:8000`。
- `api.example.com` → `Nginx:80` → `frps:8080` → `frpc` → `API_SERVER:8080`。

### 启用 Nginx 的服务端 Compose

使用容器版 Nginx 时，在原服务端 Compose 项目中用下面的 `compose.yaml` 替换基础示例的文件。Nginx 接管宿主机的 `80` 端口，`frps` 保留 `7000` 的映射供客户端连接。切换端口映射时，Compose 会重建 `frps`，业务转发可能短暂中断。

`public-site` 模拟公网服务器上原有的网站。网站端口 `8000` 和 frp 的 HTTP 入口 `8080` 均通过 Compose 网络访问。将 `/PATH` 替换为配置文件所在目录的实际绝对路径。

```yaml
services:
  frps:
    image: fatedier/frps:v0.68.0
    restart: unless-stopped
    command: ["-c", "/etc/frp/frps.toml"]
    ports:
      - "7000:7000"
    volumes:
      - "/PATH/frps.toml:/etc/frp/frps.toml:ro"

  nginx:
    image: nginx:1.30-alpine
    restart: unless-stopped
    depends_on:
      - frps
      - public-site
    ports:
      - "80:80"
    volumes:
      - "/PATH/nginx.conf:/etc/nginx/conf.d/default.conf:ro"

  public-site:
    image: busybox:1.37
    command:
      - sh
      - -ec
      - |
        mkdir -p /www
        printf '%s\n' 'public website' > /www/index.html
        exec httpd -f -p 8000 -h /www
```

### `nginx.conf`

将以下站点配置保存为 `nginx.conf`，并把 `server_name` 中的示例域名换成实际域名。`www.example.com` 对应公网侧网站，由 Nginx 直接转发。另两个域名须与 `frpc.toml` 中的 `customDomains` 一致，由 Nginx 保留 `Host` 并交给 frp 匹配。

```nginx
server {
    listen 80;
    server_name app.example.com api.example.com;

    location / {
        proxy_pass http://frps:8080;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name www.example.com;

    location / {
        proxy_pass http://public-site:8000;
        proxy_set_header Host $host;
    }
}
```

如果宿主机上的 Nginx 已监听 `80`，沿用基础示例的服务端 Compose 文件，将 `"80:8080"` 改为 `"127.0.0.1:8080:8080"`。保留现有网站的站点配置，只加入上面转发给 frp 的 `server` 块，并把该块的 `proxy_pass` 目标改为 `http://127.0.0.1:8080`。

在公网服务器的 Compose 目录运行 `docker compose up -d`。使用宿主机上的 Nginx 时，先运行 `nginx -t` 检查配置，再重新加载 Nginx。

三个域名的 DNS 记录指向公网服务器后，从外网分别发起请求。容器版示例的预期响应依次为 `public website`、`web backend` 和 `api backend`。使用宿主机上的 Nginx 时，第一个请求应返回现有网站的内容。

```bash
curl --fail --show-error http://www.example.com/
curl --fail --show-error http://app.example.com/
curl --fail --show-error http://api.example.com/
```

DNS 尚未配置时，可以用 `curl --resolve` 将三个域名临时指向同一个公网 IP 和 `80` 端口。将 `203.0.113.10` 替换为公网服务器的实际 IP。若已更换示例域名，也要同步替换命令中 `--resolve` 和 URL 里的域名。

```bash
curl --fail --show-error --noproxy '*' --resolve www.example.com:80:203.0.113.10 http://www.example.com/
curl --fail --show-error --noproxy '*' --resolve app.example.com:80:203.0.113.10 http://app.example.com/
curl --fail --show-error --noproxy '*' --resolve api.example.com:80:203.0.113.10 http://api.example.com/
```

请求仍使用 URL 中的域名作为 `Host`，因此 Nginx 和 frp 会按原有规则分流，预期响应与上面相同。

容器版 Nginx 实测时，将三条命令中的示例 IP 换成 `127.0.0.1`，三个请求都通过同一个 `127.0.0.1:80` 入口，无需配置 DNS 或修改 `hosts` 文件。`www.example.com`、`app.example.com` 和 `api.example.com` 分别返回 `public website`、`web backend` 和 `api backend`。

宿主机 Nginx 方案也在 macOS 上单独实测。三个域名共用 `127.0.0.1:80`，分别返回现有网站和两个内网服务的内容。`frps` 的 `8080` 仅发布到回环地址 `127.0.0.1:8080`。由于测试账号无法直接监听 `80`，测试时通过临时 TCP 转发将 `80` 接到宿主机 Nginx 的高位端口。

## 参考资料

- [frp 多域名转发示例](https://gofrp.org/en/docs/examples/vhost-http/)
- [Nginx 代理请求头配置](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <https://blog.mazey.net/xxxx.html>

<!-- ID: ARTICLE_ID -->

```plain
#FRP #Nginx #Docker #Compose #HTTP #Proxy #Curl
#反向代理 #域名 #端口 #容器化 #虚拟主机 #部署
```
