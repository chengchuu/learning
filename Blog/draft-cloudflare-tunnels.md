# 使用 Docker Compose 部署 Cloudflare Tunnel

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

用 Docker Compose 启动 cloudflared 连接器，并使用隧道令牌接入 Cloudflare Tunnel。将公网域名绑定到 NAS 上的 Web 服务，即可从外网访问，也可通过 Cloudflare Access 限制访问者。

- [前置条件](#前置条件)
- [创建 Cloudflare Tunnel](#创建-cloudflare-tunnel)
- [使用 Docker Compose 部署连接器](#使用-docker-compose-部署连接器)
- [配置公网域名与源站地址](#配置公网域名与源站地址)
- [验证访问](#验证访问)
- [更新镜像](#更新镜像)

## 前置条件

- 准备 Cloudflare 账号和已接入 Cloudflare 的域名。
- 在连接器所在主机上安装 Docker 和 Docker Compose，并确保该主机可以出站连接 Cloudflare。
- 确认 NAS 上的 Web 服务已启动，且 `cloudflared` 容器能够访问服务的地址和端口。

## 创建 Cloudflare Tunnel

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，进入 **Networking** > **Tunnels**。
2. 选择 **Create Tunnel**，输入隧道名称 (例如 `example-nas-tunnel`) 并创建隧道。
3. 在连接器安装页面选择 **Docker**，从生成的命令中取出 `--token` 后的隧道令牌。

持有该令牌的人可以运行连接器并接入该隧道。请妥善保管令牌，避免将实际值写入版本库、文章或截图。令牌泄露后，按 [Cloudflare 的令牌轮换说明](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/remote-tunnel-permissions/)处理。

## 使用 Docker Compose 部署连接器

在连接器所在主机上创建项目目录，并将以下内容保存为 `docker-compose.yml`。仅在部署主机上将 `YOUR_TOKEN_HERE` 替换为实际令牌，并限制配置文件的读取权限。

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    restart: always
    command: tunnel --no-autoupdate run --token YOUR_TOKEN_HERE
```

在 Compose 文件所在目录运行以下命令。若本地没有所需镜像，Compose 会先拉取镜像，再在后台启动容器。

```bash
docker compose up -d
```

## 配置公网域名与源站地址

公开应用路由会为 NAS 服务提供公网入口。如果只允许指定用户访问，请先创建 [Cloudflare Access 应用及访问策略](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)，再添加路由。

1. 回到 **Networking** > **Tunnels**，打开已创建的隧道。
2. 在 **Routes** 下选择 **Add route**，再选择 **Published application**。
3. 在 **Hostname** 中选择域名并填写子域名，例如 `nas.yourdomain.com`。
4. 在 **Service URL** 中填写 `cloudflared` 容器能访问的源站地址，然后保存。

如果 NAS 上的 Web 服务监听 HTTP `5244`，可根据部署方式选择地址:

- **Windows 宿主机**: 使用 Docker Desktop，且 Web 服务直接运行在宿主机上时，填写 `http://host.docker.internal:5244`。
- **同一 Docker 网络**: Web 服务运行在另一个容器中时，填写 `http://CONTAINER_NAME:5244`。将 `CONTAINER_NAME` 替换为共享网络内可解析的容器名或 Compose 服务名。
- **局域网主机**: Web 服务运行在容器可访问的局域网地址上时，填写 `http://LOCAL_IP:5244`。将 `LOCAL_IP` 替换为 Web 服务所在主机的内网 IP。

## 验证访问

先在隧道列表确认状态为 **Healthy**，再从外网打开 `https://nas.yourdomain.com`。如果启用了 Cloudflare Access，确认授权用户能在登录后访问服务，并用未登录的浏览器窗口确认服务内容无法直接访问。

遇到 `502 Bad Gateway` 时，检查源站的协议、监听地址和端口，以及连接器到源站的网络是否可达。若看到 `1033`，先检查 `cloudflared` 容器和隧道是否已连接。

Docker Compose 本地实测中，`cloudflared 2026.11.1` 容器成功启动，随后因占位令牌无效而退出。同一 Compose 网络中的探测容器成功访问模拟源站 `test-origin:5244`，收到预期的 HTTP 响应。

本次测试只验证了容器启动和同网源站的可达性。连接器注册、隧道进入 **Healthy** 状态，以及经公网域名转发请求到源站，仍需使用真实隧道令牌验证。

## 更新镜像

在 Compose 文件所在目录运行以下命令。第一条命令拉取镜像，第二条命令应用已拉取的镜像。单连接器部署在容器重建时可能短暂中断。

```bash
docker compose pull
docker compose up -d
```

更新后，重新检查隧道状态和公网域名的访问结果。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <https://blog.mazey.net/xxxx.html>

<!-- ID: ARTICLE_ID -->

```plain
#CloudflareTunnel #Cloudflared #DockerCompose #NAS #RemoteAccess #SelfHosting #CloudflareAccess #ZeroTrust #DomainRouting #ContainerNetworking
#内网穿透 #容器化部署 #网络附属存储 #远程访问 #自托管 #零信任 #域名路由 #访问控制 #隧道令牌 #源站验证
```
