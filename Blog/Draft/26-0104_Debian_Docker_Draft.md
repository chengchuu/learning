# Debian 12.x 安装与配置 Docker 服务

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
apt install -y docker.io
```

测试安装结果:

```bash
docker --version
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

## 手动部署

背景: 考虑到官方 Docker 库有网络问题，而云服务商的独享镜像托管服务需要开通"企业版"，所以选择手动上传镜像文件来部署服务。

IMAGE: 容器镜像服务 - 产品概述

本地保存镜像:

```bash
docker save IMAGE_NAME:TAG | gzip > IMAGE_FILE.tar.gz
```

通过 SFTP/SCP/Docker Registry 等方式上传到服务器。

```bash
sftp USER@YOUR_SERVER_IP
sftp> cd DOCKER_IMAGE_PATH
sftp> put IMAGE_FILE.tar.gz
sftp> ls -lh
sftp> bye
```

服务端加载镜像:

```bash
docker load -i IMAGE_FILE.tar.gz
```

运行容器:

```bash
docker run --name CONTAINER_NAME -d -p PORT1:PORT2 IMAGE_NAME:TAG
```

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

安装 `ufw` 和 `net-tools`:

```bash
apt install -y ufw net-tools
```

检查 `ufw` 状态:

```bash
ufw status
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

