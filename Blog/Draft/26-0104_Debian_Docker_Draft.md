# Debian 12.x Docker 从安装配置到容器部署全流程

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

本文介绍如何在腾讯云轻量应用服务器 (或 CVM) 上安装 Debian 12 系统，配置 Docker 环境，并通过上传镜像的方式部署容器服务。适用于想规避 Docker Hub 网络波动或需要私有化部署的场景。

- [Debian 12.x Docker 从安装配置到容器部署全流程](#debian-12x-docker-从安装配置到容器部署全流程)
  - [安装系统](#安装系统)
  - [安装 Docker](#安装-docker)
  - [容器部署](#容器部署)
    - [部署背景](#部署背景)
    - [镜像准备](#镜像准备)
    - [镜像上传](#镜像上传)
    - [容器启动](#容器启动)
    - [容器管理](#容器管理)
  - [防火墙管理](#防火墙管理)

## 安装系统

安装 Debian 12.x 操作系统。

IMAGE: 安装系统 - Debian

## 安装 Docker

安装依赖:

```bash
apt update
apt upgrade -y
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

安装 Docker:

```bash
apt install -y docker.io docker-compose
```

测试安装结果:

```bash
docker --version
docker-compose --version
```

检查 Docker 服务:

```bash
systemctl status docker
```

```plain
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; preset: enabled)
     Active: active (running) since Sat 2026-01-03 13:32:54 CST; 4min 33s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 104286 (dockerd)
      Tasks: 8
     Memory: 30.5M
        CPU: 309ms
     CGroup: /system.slice/docker.service
             └─104286 /usr/sbin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

## 容器部署

### 部署背景

考虑到官方 Docker 库有网络问题，而云服务商的独享镜像托管服务需要开通"企业版"，所以选择手动上传镜像文件来部署服务。

IMAGE: 容器镜像服务 - 产品概述

### 镜像准备

本地保存镜像:

```bash
# 普通保存
docker save IMAGE_NAME:TAG -o IMAGE_FILE.tar
# 压缩保存 (推荐)
docker save IMAGE_NAME:TAG | gzip > IMAGE_FILE.tar.gz
```

### 镜像上传

通过 SFTP/SCP/Docker Registry 等方式上传到服务器。

SFTP 示例:

```bash
sftp USER@YOUR_SERVER_IP
sftp> cd DOCKER_IMAGE_PATH
sftp> put IMAGE_FILE.tar.gz
sftp> ls -lh
sftp> bye
```

SCP 示例:

```bash
scp IMAGE_FILE.tar.gz USER@YOUR_SERVER_IP:/path/to/destination/
```

服务端加载镜像:

```bash
docker load -i IMAGE_FILE.tar.gz
```

### 容器启动

运行容器:

```bash
docker run --name CONTAINER_NAME -d -p PORT1:PORT2 IMAGE_NAME:TAG
```

参数说明:

- `--name CONTAINER_NAME`: 指定容器名称。
- `--restart`: 重启策略，例如 `unless-stopped`、`always` 等。
- `-d`: 后台运行容器。
- `-p PORT1:PORT2`: 端口映射，将宿主机的 `PORT1` 端口映射到容器的 `PORT2` 端口。
- `-v /host/path:/container/path`: 数据卷映射，将宿主机的 `/host/path` 目录映射到容器的 `/container/path` 目录。
- `IMAGE_NAME:TAG`: 指定要运行的镜像名称和标签。

### 容器管理

查看容器日志:

```bash
docker logs CONTAINER_NAME
```

进入容器:

```bash
docker exec -it CONTAINER_NAME bash
```

更新容器重启策略:

```bash
docker update --restart=unless-stopped CONTAINER_NAME
```

## 防火墙管理

检查 `nftables` 状态:

```bash
systemctl status nftables
```

```plain
○ nftables.service - nftables
     Loaded: loaded (/lib/systemd/system/nftables.service; disabled; preset: enabled)
     Active: inactive (dead)
       Docs: man:nft(8)
             http://wiki.nftables.org
```

如果想规避冲突，可以禁用 `nftables` (可选):

```bash
systemctl stop nftables
systemctl disable nftables
```

安装 `ufw` 和 `net-tools`:

```bash
apt install -y ufw net-tools
```

检查 `ufw` 状态:

```bash
ufw status verbose
```

```plain
Status: inactive
```

启用 `ufw`:

```bash
ufw enable
```

配置 `ufw` 规则:

```bash
ufw allow PORT_NUMBER/tcp
```

例如:

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
```

验证端口是否开放:

```bash
netstat -tulnp | grep PORT_NUMBER
```

检查云服务商 - 防火墙 - 规则:

IMAGE: 防火墙

IMAGE: 防火墙 - 添加规则

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/>

(完)
