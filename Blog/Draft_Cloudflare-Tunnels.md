# 使用 Docker 部署 Cloudflare Tunnels 指南

本文档介绍如何使用 Docker 部署 Cloudflare Tunnels (以下简称 "Tunnels")，将本地 NAS (Network Attached Storage，网络附属存储) 服务安全地发布至公网。

## 创建 Cloudflare Tunnel

### 登录与初始化

(1) 登录 [Cloudflare Zero Trust 控制台](https://dash.cloudflare.com/one/)。

(2) 依次点击 **Networks** (网络) > **Tunnels** (隧道)。

(3) 点击 **Create a tunnel** (创建隧道)，选择 **Cloudflared** 方案。

### 获取部署令牌

(1) 为隧道命名 (例如 `example-nas-tunnel`) 并保存。

(2) 在 **Install connector** (安装连接器) 页面中，选择 **Docker** 平台。

(3) 系统会显示一段包含 `--token` 参数的命令。请记录该 token (令牌) 字符串，用于后续部署。

## 使用 Docker 部署连接器

### 编写配置文件

在本地创建项目目录，并新建 `docker-compose.yml` 文件。

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared-tunnel
    restart: always
    command: tunnel --no-autoupdate run --token YOUR_TOKEN_HERE
```

### 启动服务

(1) 在当前目录下打开终端。

(2) 执行以下命令拉取镜像并启动容器：

```bash
docker compose up -d
```

注意：若本地不存在镜像，Docker 会自动执行 `docker pull` 操作。

### 更新镜像

若需手动获取最新版本的 `cloudflared` 镜像，请执行：

```bash
docker compose pull
```

## 配置入站路由规则

### 设置公共主机名

返回 Cloudflare 控制台的 **Public Hostname** (公共主机名) 标签页，配置以下信息：

(1) **Public Hostname**: 输入访问域名 (如 `nas.yourdomain.com`)。

(2) **Service Type**: 选择 `HTTP` 协议。

(3) **URL**: 根据服务运行环境填写地址。

### 指定内部服务地址

假设 NAS 服务运行在内部端口为 5244 的本地服务上，建议使用以下配置：

(1) 若 NAS 运行在 Windows 宿主机而非 Docker 容器内，填写 `http://host.docker.internal:5244`。

(2) 若 NAS 运行在同一 Docker 网络下的其他容器内，填写 `http://CONTAINER_NAME:5244`。

(3) 若使用静态 IP 地址，填写 `http://LOCAL_IP:5244`。
