# 使用 Nginx 和 frp 按域名转发多个内网 Web 服务

多个内网 Web 服务可以共用一个公网 IP 和 HTTP `80` 端口。公网服务器上的 Nginx 将请求交给 frp，再由 frp 按域名转发到对应的内网服务。

本文沿用 [Docker Compose 部署 frp 的基础配置](20261121-docker-frp.md)，将 Web 流量的入口改为基于域名的 HTTP 代理。

- [部署架构](#部署架构)
- [前置条件](#前置条件)
- [公网服务器配置](#公网服务器配置)
  - [服务端 `compose.yaml`](#服务端-composeyaml)
  - [`frps.toml`](#frpstoml)
  - [`nginx.conf`](#nginxconf)
- [内网主机配置](#内网主机配置)
  - [客户端 `compose.yaml`](#客户端-composeyaml)
  - [`frpc.toml`](#frpctoml)
- [验证转发](#验证转发)
- [参考资料](#参考资料)

## 部署架构

`浏览器` → HTTP → `Nginx:80` → HTTP → `frps:8080` → `frpc` → `内网 Web 服务`

- `app.example.com` 和 `api.example.com` 指向同一台公网服务器。
- `app.example.com` 转发到 `WEB_SERVER:8000`，`api.example.com` 转发到 `API_SERVER:8080`。
- `7000` 仍用于 `frpc` 连接 `frps`。示例中的域名和 Compose 服务名均可替换为实际值。

## 前置条件

- 两台主机均已安装 Docker 与 Docker Compose。公网服务器的 TCP `80` 和 `7000` 未被占用。
- 将两个示例域名替换为实际域名，并将 DNS 记录指向公网服务器。Nginx 配置中的 `server_name` 和 frp 配置中的 `customDomains` 须同步替换。
- 为两端的 `AUTH_TOKEN` 设置同一个高强度随机密钥。开放公网 TCP `80` 供用户访问，并允许内网主机连接 TCP `7000`。

## 公网服务器配置

将以下三个配置文件放在公网服务器的同一目录下。Nginx 和 `frps` 共用默认 Compose 网络，只有 `80` 和 `7000` 发布到宿主机。

### 服务端 `compose.yaml`

```yaml
services:
  frps:
    image: fatedier/frps:v0.68.0
    restart: unless-stopped
    command: ["-c", "/etc/frp/frps.toml"]
    ports:
      - "7000:7000"
    volumes:
      - ./frps.toml:/etc/frp/frps.toml:ro

  nginx:
    image: nginx:1.30-alpine
    restart: unless-stopped
    depends_on:
      - frps
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

### `frps.toml`

```toml
bindPort = 7000
auth.token = "AUTH_TOKEN"
vhostHTTPPort = 8080
```

### `nginx.conf`

该文件作为 Nginx 官方镜像的站点配置加载。`proxy_set_header Host $host;` 将原请求域名传给 frp，供 `customDomains` 匹配。

```nginx
server {
    listen 80;
    server_name app.example.com api.example.com;

    location / {
        proxy_pass http://frps:8080;
        proxy_set_header Host $host;
    }
}
```

在公网服务器的 Compose 目录运行 `docker compose up -d`。

## 内网主机配置

在内网主机的另一目录下保存以下两个文件。两个业务容器分别返回固定文本，便于确认请求到达正确的后端。换成实际业务时，确保 `frpc` 能在共享网络中通过服务名访问对应端口。

### 客户端 `compose.yaml`

```yaml
services:
  frpc:
    image: fatedier/frpc:v0.68.0
    restart: unless-stopped
    command: ["-c", "/etc/frp/frpc.toml"]
    volumes:
      - ./frpc.toml:/etc/frp/frpc.toml:ro
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

两个请求共用公网服务器的 `80` 端口，预期分别返回 `web backend` 和 `api backend`。在公网服务器运行 `docker compose ps`，可确认 `frps` 的 HTTP 入口 `8080` 没有发布到宿主机。

## 参考资料

- [frp 多域名转发示例](https://gofrp.org/en/docs/examples/vhost-http/)
- [Nginx 代理请求头配置](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)
