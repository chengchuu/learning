# 基于 Docker Compose 部署 frp 实现内网穿透

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
- [10. 配置变更记录建议](#10-配置变更记录建议)

## 1. 适用范围

本文用于在以下环境部署 frp 反向代理服务，以暴露内网服务端口 `8000`。

- 客户端: 本地主机，使用 `Docker Compose` 运行 `frpc`。
- 服务端: Linux 公网服务器，使用 `Docker Compose` 运行 `frps`。
- 目标: 通过公网服务器访问内网容器 `WEB_SERVER:8000`。

## 2. 部署架构

### 2.1 组件说明

- `frps`: 部署在公网服务器，负责接收 `frpc` 连接和公网流量。
- `frpc`: 部署在本地主机，负责把内网服务映射到公网服务器。
- `WEB_SERVER`: 本地主机上的业务容器，提供 `8000` 端口服务。

### 2.2 流量路径

客户端访问 `公网 IP:6000` 后，流量路径如下:

`公网客户端` → `frps:6000` → `frpc` → `WEB_SERVER:8000`

## 3. 前置条件

- 本地主机与 Linux 服务器均已安装 Docker 与 Docker Compose。
- 公网服务器已放行 TCP 端口: `6000`、`7000`、`7500`。
- 客户端可以主动访问公网服务器 `111.111.222.222:7000`。
- 两端 `auth.token` 必须一致。

## 4. 服务端配置 (`frps`)

### 4.1 `docker-compose.yml`

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
      - "7500:7500"
    volumes:
      - "/PATH/frps.toml:/etc/frp/frps.toml"
```

### 4.2 `frps.toml`

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

```bash
docker compose up -d
```

## 5. 客户端配置 (`frpc`)

### 5.1 `docker-compose.yml`

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

```bash
docker compose up -d
```

## 6. 验证步骤

### 6.1 检查容器状态

服务端执行:

```bash
docker ps | grep CONTAINER_FRPS
```

客户端执行:

```bash
docker ps | findstr CONTAINER_FRPC
```

### 6.2 检查日志

服务端执行:

```bash
docker logs -f CONTAINER_FRPS
```

客户端执行:

```bash
docker logs -f CONTAINER_FRPC
```

### 6.3 连通性测试

从外网执行:

```bash
curl http://111.111.222.222:6000
```

如果业务是 HTTP 服务，应返回页面或接口响应。如果业务是非 HTTP 服务，请使用对应客户端工具验证 TCP 连通性。

## 7. 参数说明与默认策略

本文尽量采用 `frp` 默认行为，仅显式配置必要参数。

- `bindPort`: `frps` 控制通道端口。
- `serverAddr`、`serverPort`: `frpc` 连接 `frps` 的地址与端口。
- `auth.token`: 鉴权口令，两端须一致。
- `remotePort`: 公网暴露端口。
- `localIP`、`localPort`: 客户端内网目标服务地址与端口。

说明: `localIP = "WEB_SERVER"` 使用 Docker 内部 DNS 解析容器名。该写法适用于 `CONTAINER_FRPC` 与 `WEB_SERVER` 位于同一 Compose 网络的场景。

## 8. 安全建议

- 请替换示例中的 `token` 与 Dashboard 密码，使用高强度随机字符串。
- 生产环境建议限制 `7500` 的来源 IP，避免 Dashboard 暴露到公网。
- 如无 Dashboard 需求，可移除 `7500:7500` 端口映射，并删除相关配置。
- 建议定期升级镜像版本，并先在测试环境验证兼容性。

## 9. 故障排查

- 无法访问 `6000`:
  - 检查公网安全组与系统防火墙是否放行 `6000`、`7000`。
  - 检查 `frps` 是否正常监听并启动成功。
- `frpc` 连接失败:
  - 检查 `serverAddr`、`serverPort` 是否正确。
  - 检查两端 `auth.token` 是否一致。
- 连接建立但业务不通:
  - 检查 `WEB_SERVER` 容器是否监听 `8000`。
  - 在 `CONTAINER_FRPC` 容器内确认可解析并访问 `WEB_SERVER:8000`。

## 10. 配置变更记录建议

建议在仓库维护以下变更记录字段:

- 变更日期
- 变更人
- 变更项 (端口、镜像版本、鉴权参数、网络策略)
- 回滚方案

以上内容可保证后续运维与审计可追溯。
