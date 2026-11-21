# 基于 Docker Compose 部署 frp 实现内网穿透

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

通过 Docker Compose 部署 frp，可以把内网容器的 8000 端口映射到公网服务器的 TCP 6000 端口。部署完成后，先看日志确认代理已注册，再从外网发起请求，检查业务是否正常响应。

- [1. 适用范围](#1-适用范围)
- [2. 部署架构](#2-部署架构)
  - [2.1 组件说明](#21-组件说明)
  - [2.2 流量路径](#22-流量路径)
- [3. 前置条件](#3-前置条件)
- [4. 服务端配置 (`frps`)](#4-服务端配置-frps)
  - [4.1 `docker-compose.yml`](#41-docker-composeyml)
  - [4.2 `frps.toml`](#42-frpstoml)
  - [4.3 启动命令](#43-启动命令)
- [5. 客户端配置 (`frpc`)](#5-客户端配置-frpc)
  - [5.1 `docker-compose.yml`](#51-docker-composeyml)
  - [5.2 `frpc.toml`](#52-frpctoml)
  - [5.3 启动命令](#53-启动命令)
- [6. 验证步骤](#6-验证步骤)
  - [6.1 检查容器状态](#61-检查容器状态)
  - [6.2 检查日志](#62-检查日志)
  - [6.3 连通性测试](#63-连通性测试)
- [7. 参数说明与默认策略](#7-参数说明与默认策略)
- [8. 安全建议](#8-安全建议)
- [9. 故障排查](#9-故障排查)

## 1. 适用范围

示例使用 frp v0.68.0 转发 TCP 流量。公网端是一台 Linux 服务器，内网端是一台运行 `WEB_SERVER` 业务容器的主机。

## 2. 部署架构

### 2.1 组件说明

- `frps` 部署在公网服务器上。`7000` 接收 `frpc` 的连接，`6000` 接收来自外网的业务流量。
- 内网主机上的 `frpc` 主动连接 `frps`，再把收到的业务流量转给目标容器。
- 业务容器 `WEB_SERVER` 监听 `8000`，与 `frpc` 共用一个 Compose 网络。

### 2.2 流量路径

外网客户端访问 `公网 IP:6000` 时，业务流量按以下路径转发:

`公网客户端` → `frps:6000` → `frpc` → `WEB_SERVER:8000`

## 3. 前置条件

- 在内网主机和公网服务器上安装 Docker 与 Docker Compose。
- 确认公网服务器的 TCP `6000` 和 `7000` 端口可用。在安全组和系统防火墙中，分别允许预期的外网访问方连接 `6000`、内网主机连接 `7000`。
- 确认 `WEB_SERVER` 已就绪，并能通过同一 Docker 网络访问 `8000`。
- 为两端的 `auth.token` 准备同一个高强度随机字符串。

Dashboard 使用可选的管理端口 `7500`。示例仅在公网服务器的回环地址上发布该端口。访问方式见[安全建议](#8-安全建议)。

## 4. 服务端配置 (`frps`)

### 4.1 `docker-compose.yml`

在公网服务器上创建 Compose 文件。把挂载路径中的 `/PATH` 换成 `frps.toml` 所在目录。

```yaml
services:
  CONTAINER_FRPS:
    image: fatedier/frps:v0.68.0
    container_name: CONTAINER_FRPS
    restart: unless-stopped
    command: ["-c", "/etc/frp/frps.toml"]
    ports:
      - "6000:6000"
      - "7000:7000"
      - "127.0.0.1:7500:7500"
    volumes:
      - "/PATH/frps.toml:/etc/frp/frps.toml"
```

### 4.2 `frps.toml`

将 `AUTH_TOKEN` 替换为准备好的鉴权令牌。保留 Dashboard 时，还需将 `WEBSERVER_PASSWORD` 替换为独立的高强度随机密码。

`webServer.addr` 是容器内的监听地址。保留 `0.0.0.0`，让 Docker 的端口映射能够访问容器内的 Dashboard。宿主机的访问范围由 Compose 中的端口绑定控制。

```toml
bindPort = 7000
auth.token = "AUTH_TOKEN"

# Dashboard
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "WEBSERVER_PASSWORD"
```

### 4.3 启动命令

在公网服务器上进入服务端 Compose 文件所在目录，运行以下命令:

```bash
docker compose up -d
```

## 5. 客户端配置 (`frpc`)

### 5.1 `docker-compose.yml`

在内网主机现有的 Compose 文件中，把 `CONTAINER_FRPC` 加到已有的 `services` 下，与 `WEB_SERVER` 并列。将 `/PATH` 换成 `frpc.toml` 所在目录，并让两个服务加入同一网络。

如果业务的 Compose 服务名不同，需同时替换 `depends_on` 和 `frpc.toml` 中 `localIP` 的 `WEB_SERVER`。这里使用的是 `services` 下的服务名。

这里的 `depends_on` 只保证启动顺序。做连通性测试前，先确认业务已经能响应请求。

```yaml
services:
  CONTAINER_FRPC:
    image: fatedier/frpc:v0.68.0
    container_name: CONTAINER_FRPC
    restart: unless-stopped
    command: ["-c", "/etc/frp/frpc.toml"]
    volumes:
      - "/PATH/frpc.toml:/etc/frp/frpc.toml"
    depends_on:
      - WEB_SERVER
```

### 5.2 `frpc.toml`

将示例 IP `111.111.222.222` 替换为公网服务器的实际 IP，并使用与服务端相同的 `AUTH_TOKEN` 值。

```toml
serverAddr = "111.111.222.222"
serverPort = 7000
auth.token = "AUTH_TOKEN"

[[proxies]]
name = "FRP_NAME"
type = "tcp"
localIP = "WEB_SERVER"
localPort = 8000
remotePort = 6000
```

### 5.3 启动命令

在内网主机上进入客户端 Compose 文件所在目录，运行以下命令:

```bash
docker compose up -d
```

## 6. 验证步骤

### 6.1 检查容器状态

服务端执行:

```bash
docker ps | grep CONTAINER_FRPS
```

客户端命令适用于支持 `findstr` 的 Windows 环境。Linux 或 macOS 上可沿用上面的 `grep` 写法，改为筛选客户端容器。

```bash
docker ps | findstr CONTAINER_FRPC
```

确认两端容器都处于运行状态。

### 6.2 检查日志

服务端执行:

```bash
docker logs -f CONTAINER_FRPS
```

客户端执行:

```bash
docker logs -f CONTAINER_FRPC
```

两端容器启动后，重点查看日志中的连接和代理注册结果。若出现报错，可按[故障排查](#9-故障排查)逐段定位。

### 6.3 连通性测试

验证 HTTP 服务时，从外网发起请求。命令中的示例 IP 需要换成公网服务器的实际 IP。

```bash
curl http://111.111.222.222:6000
```

能收到预期的页面或接口响应，就说明请求已经到达业务端。业务使用其他 TCP 协议时，用对应的客户端检查响应。

## 7. 参数说明与默认策略

示例单独设置了转发、鉴权和可选的 Dashboard 参数，其余设置沿用 frp 默认值。

- `bindPort`: `frps` 控制通道端口。
- `serverAddr`、`serverPort`: `frpc` 连接 `frps` 的地址与端口。
- `auth.token`: 鉴权口令，两端须一致。
- `remotePort`: 公网暴露端口。
- `localIP`、`localPort`: 客户端内网目标服务地址与端口。

`localIP = "WEB_SERVER"` 通过 Docker DNS 解析 Compose 服务名。该写法要求 `CONTAINER_FRPC` 与 `WEB_SERVER` 共享网络。

## 8. 安全建议

- `auth.token` 用于 frp 两端之间的鉴权。通过 `6000` 访问的业务仍需按实际需求配置访问控制。
- `127.0.0.1:7500:7500` 将 Dashboard 发布到宿主机回环地址。可在公网服务器本机访问 `http://127.0.0.1:7500`，远程管理可通过 SSH 本地端口转发访问。
- 无需 Dashboard 时，移除 `127.0.0.1:7500:7500` 端口映射和 `frps.toml` 中的 `webServer` 相关配置。
- 建议定期升级镜像版本，并先在测试环境验证兼容性。

## 9. 故障排查

- 外网无法访问 `6000`:
  - 检查公网安全组和系统防火墙是否允许测试来源访问 `6000`。
  - 如果防火墙规则正确，再看服务端容器是否发布了 `6000`，以及日志中是否有代理注册成功的记录。
- `frpc` 连接失败:
  - 检查 `serverAddr`、`serverPort` 是否正确。
  - 确认 `frps` 已启动，且内网主机能访问公网服务器的 `7000`。
  - 检查两端 `auth.token` 是否一致。
- 代理已注册，但业务无响应:
  - 检查 `WEB_SERVER` 是否已就绪，以及监听地址是否允许容器间访问 `8000`。
  - 从与客户端共享网络的环境验证能否解析并访问 `WEB_SERVER:8000`。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <https://blog.mazey.net/xxxx.html>

<!-- ID: ARTICLE_ID -->

```plain
#FRP #Compose #Proxy #Docker #TCP #Container #Linux #Network #Security #Troubleshooting
#容器化 #端口 #容器 #测试 #日志 #服务器 #运维
```
