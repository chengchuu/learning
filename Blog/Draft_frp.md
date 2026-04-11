# 基于 Docker Compose 部署 FRP 实现内网穿透

## 1. 适用范围

本文用于在以下环境部署 `FRP` 反向代理服务，以暴露内网服务端口 `5244`。

- 客户端: Windows 10，使用 `Docker Compose` 运行 `frpc`。
- 服务端: Linux 公网服务器，使用 `Docker Compose` 运行 `frps`。
- 目标: 通过公网服务器访问内网容器 `winlist:5244`。

## 2. 部署架构

### 2.1 组件说明

- `frps`: 部署在公网服务器，负责接收 `frpc` 连接和公网流量。
- `frpc`: 部署在 Windows 10 主机，负责把内网服务映射到公网服务器。
- `winlist`: Windows 10 主机上的业务容器，提供 `5244` 端口服务。

### 2.2 流量路径

客户端访问 `公网 IP:6001` 后，流量路径如下:

`公网客户端` → `frps:6001` → `frpc` → `winlist:5244`

## 3. 前置条件

- Windows 10 与 Linux 服务器均已安装 Docker 与 Docker Compose。
- 公网服务器已放行 TCP 端口: `6001`、`7001`、`7501`。
- 客户端可以主动访问公网服务器 `114.132.222.111:7001`。
- 两端 `auth.token` 必须一致。

## 4. 服务端配置 (`frps`)

### 4.1 `docker-compose.yml`

```yaml name=docker-compose.yml
services:
  webfrps:
    image: fatedier/frps:v0.68.0
    container_name: webfrps
    restart: unless-stopped
    networks:
      - webhost
    command: ["-c", "/etc/frp/frps.toml"]
    ports:
      - "6001:6001"
      - "7001:7001"
      - "7501:7501"
    volumes:
      - "/web/frps.toml:/etc/frp/frps.toml"

networks:
  webhost:
    external: true
```

### 4.2 `frps.toml`

```toml name=frps.toml
bindPort = 7001
auth.token = "Wxx#Fxx#0000"

# Dashboard
webServer.addr = "0.0.0.0"
webServer.port = 7501
webServer.user = "admin"
webServer.password = "Wxx#Fxxx#0000"
```

### 4.3 启动命令

```bash name=run-frps.sh
docker compose up -d
```

## 5. 客户端配置 (`frpc`)

### 5.1 `docker-compose.yml`

```yaml name=docker-compose.yml
services:
  winfrpc:
    image: fatedier/frpc:v0.68.0
    container_name: winfrpc
    restart: unless-stopped
    command: ["-c", "/etc/frp/frpc.toml"]
    volumes:
      - "C:/Web/web/server/config/dockerwin/frpc.toml:/etc/frp/frpc.toml"
    depends_on:
      - winlist
```

### 5.2 `frpc.toml`

```toml name=frpc.toml
serverAddr = "114.132.222.111"
serverPort = 7001
auth.token = "Wxx#Fxx#0000"

[[proxies]]
name = "webfrp"
type = "tcp"
localIP = "winlist"
localPort = 5244
remotePort = 6001
```

### 5.3 启动命令

```powershell name=run-frpc.ps1
docker compose up -d
```

## 6. 验证步骤

### 6.1 检查容器状态

服务端执行:

```bash name=check-frps.sh
docker ps | grep webfrps
```

客户端执行:

```powershell name=check-frpc.ps1
docker ps | findstr winfrpc
```

### 6.2 检查日志

服务端执行:

```bash name=logs-frps.sh
docker logs -f webfrps
```

客户端执行:

```powershell name=logs-frpc.ps1
docker logs -f winfrpc
```

### 6.3 连通性测试

从外网执行:

```bash name=test-public-access.sh
curl http://114.132.222.111:6001
```

如果业务是 HTTP 服务，应返回页面或接口响应。
如果业务是非 HTTP 服务，请使用对应客户端工具验证 TCP 连通性。

## 7. 参数说明与默认策略

本文尽量采用 `frp` 默认行为，仅显式配置必要参数。

- `bindPort`: `frps` 控制通道端口。
- `serverAddr`、`serverPort`: `frpc` 连接 `frps` 的地址与端口。
- `auth.token`: 鉴权口令，两端���须一致。
- `remotePort`: 公网暴露端口。
- `localIP`、`localPort`: 客户端内网目标服务地址与端口。

说明: `localIP = "winlist"` 使用 Docker 内部 DNS 解析容器名。该写法适用于 `winfrpc` 与 `winlist` 位于同一 Compose 网络的场景。

## 8. 安全建议

- 请替换示例中的 `token` 与 Dashboard 密码，使用高强度随机字符串。
- 生产环境建议限制 `7501` 的来源 IP，避免 Dashboard 暴露到公网。
- 如无 Dashboard 需求，可移除 `7501:7501` 端口映射，并删除相关配置。
- 建议定期升级镜像版本，并先在测试环境验证兼容性。

## 9. 故障排查

- 无法访问 `6001`:
  - 检查公网安全组与系统防火墙是否放行 `6001`、`7001`。
  - 检查 `frps` 是否正常监听并启动成功。
- `frpc` 连接失败:
  - 检查 `serverAddr`、`serverPort` 是否正确。
  - 检查两端 `auth.token` 是否一致。
- 连接建立但业务不通:
  - 检查 `winlist` 容器是否监听 `5244`。
  - 在 `winfrpc` 容器内确认可解析并访问 `winlist:5244`。

## 10. 配置变更记录建议

建议在仓库维护以下变更记录字段:

- 变更日期
- 变更人
- 变更项 (端口、镜像版本、鉴权参数、网络策略)
- 回滚方案

以上内容可保证后续运维与审计可追溯。
