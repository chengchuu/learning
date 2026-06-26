# Debian 安装与使用 `Certbot`

- [概述](#概述)
- [安装 Certbot](#安装-certbot)
  - [安装基础组件](#安装基础组件)
  - [安装 Web 服务插件](#安装-web-服务插件)
- [创建 HTTPS 证书](#创建-https-证书)
  - [使用 standalone 模式](#使用-standalone-模式)
  - [使用 webroot 模式](#使用-webroot-模式)
  - [使用 Nginx 自动配置模式](#使用-nginx-自动配置模式)
- [查看证书状态](#查看证书状态)
  - [查看全部证书](#查看全部证书)
  - [查看证书文件目录](#查看证书文件目录)
- [续约证书](#续约证书)
  - [测试续约](#测试续约)
  - [执行续约](#执行续约)
  - [强制重新签发](#强制重新签发)
- [使用 Hook 自动执行脚本](#使用-hook-自动执行脚本)
  - [使用命令行 Hook](#使用命令行-hook)
  - [修改续约配置](#修改续约配置)
- [删除和撤销证书](#删除和撤销证书)
  - [删除证书](#删除证书)
  - [撤销证书](#撤销证书)
- [自动续约服务](#自动续约服务)
- [常见问题](#常见问题)
  - [TCP 80 端口被占用](#tcp-80-端口被占用)
  - [域名验证失败](#域名验证失败)
- [总结](#总结)

## 概述

Certbot 是一个用于管理 HTTPS 证书的工具。它由 Let's Encrypt 提供支持。用户可以通过 Certbot 自动申请、安装和续约证书。

Certbot 支持多种验证方式，例如:

- standalone 模式
- webroot 模式
- Nginx 模式
- Apache 模式

本文以 Debian 系统为例，介绍 Certbot 的安装和常用操作。

## 安装 Certbot

### 安装基础组件

更新软件源:

```bash
sudo apt update
```

安装 Certbot:

```bash
sudo apt install certbot
```

安装完成后，检查版本:

```bash
certbot --version
```

示例输出:

```bash
certbot 3.1.0
```

### 安装 Web 服务插件

如果使用 Nginx，可以安装 Nginx 插件:

```bash
sudo apt install python3-certbot-nginx
```

如果使用 Apache，可以安装 Apache 插件:

```bash
sudo apt install python3-certbot-apache
```

## 创建 HTTPS 证书

### 使用 standalone 模式

standalone 模式会启动一个临时 Web 服务。

Certbot 会占用 TCP 80 端口。

申请单个域名证书:

```bash
sudo certbot certonly \
--standalone \
-d example.com
```

申请多个域名证书:

```bash
sudo certbot certonly \
--standalone \
-d example.com \
-d www.example.com
```

执行流程如下:

```text
Let's Encrypt
        ↓
DNS 解析
        ↓
example.com
        ↓
服务器 TCP 80
        ↓
Certbot 临时服务
        ↓
验证成功
```

注意:

- 域名必须正确解析到服务器。
- TCP 80 端口必须空闲。
- Nginx、Docker 或 Apache 可能占用端口。

检查端口占用情况:

```bash
sudo ss -tlnp | grep :80
```

### 使用 webroot 模式

webroot 模式不会停止 Web 服务。

假设网站目录为:

```bash
/var/www/html
```

申请证书:

```bash
sudo certbot certonly \
--webroot \
-w /var/www/html \
-d example.com
```

验证文件会生成到:

```bash
/var/www/html/.well-known/acme-challenge/
```

### 使用 Nginx 自动配置模式

如果已经安装 Nginx 插件，可以直接执行:

```bash
sudo certbot --nginx -d example.com
```

此模式会自动完成以下操作:

- 创建证书
- 修改 Nginx 配置
- 重载 Nginx

## 查看证书状态

### 查看全部证书

执行以下命令:

```bash
sudo certbot certificates
```

示例输出:

```text
Certificate Name: example.com
Domains: example.com www.example.com
Expiry Date: 2026-09-20
Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```

输出内容说明:

- Certificate Name: 证书名称
- Domains: 域名列表
- Expiry Date: 过期时间
- Certificate Path: 证书文件路径
- Private Key Path: 私钥文件路径

### 查看证书文件目录

Certbot 默认保存到:

```bash
/etc/letsencrypt/
```

常用目录:

```bash
/etc/letsencrypt/live/
/etc/letsencrypt/archive/
/etc/letsencrypt/renewal/
```

目录说明:

- live: 当前使用的证书软链接
- archive: 历史证书文件
- renewal: 自动续约配置

## 续约证书

### 测试续约

建议先执行模拟测试:

```bash
sudo certbot renew --dry-run
```

测试成功后，会出现类似输出:

```text
Congratulations, all simulated renewals succeeded
```

### 执行续约

执行实际续约:

```bash
sudo certbot renew
```

Certbot 默认会在证书剩余有效期小于 30 天时执行更新。

### 强制重新签发

执行以下命令:

```bash
sudo certbot renew --force-renewal
```

或者:

```bash
sudo certbot certonly \
--force-renewal \
-d example.com
```

## 使用 Hook 自动执行脚本

Hook 用于在续约前后执行自定义命令。

### 使用命令行 Hook

续约前停止 Nginx。

续约完成后启动 Nginx:

```bash
sudo certbot renew \
--pre-hook "systemctl stop nginx" \
--post-hook "systemctl start nginx"
```

如果使用 Docker:

```bash
sudo certbot renew \
--pre-hook "docker stop nginx-container" \
--post-hook "docker start nginx-container"
```

### 修改续约配置

打开配置文件:

```bash
sudo nano /etc/letsencrypt/renewal/example.com.conf
```

增加配置:

```ini
pre_hook = docker stop nginx-container
post_hook = docker start nginx-container
```

保存后，自动续约会执行 Hook。

## 删除和撤销证书

### 删除证书

查看证书名称:

```bash
sudo certbot certificates
```

删除指定证书:

```bash
sudo certbot delete \
--cert-name example.com
```

### 撤销证书

执行以下命令:

```bash
sudo certbot revoke \
--cert-path \
/etc/letsencrypt/live/example.com/fullchain.pem
```

## 自动续约服务

Debian 默认会创建 systemd 定时任务。

查看状态:

```bash
sudo systemctl status certbot.timer
```

启动自动续约:

```bash
sudo systemctl enable certbot.timer

sudo systemctl start certbot.timer
```

查看执行时间:

```bash
sudo systemctl list-timers | grep certbot
```

## 常见问题

### TCP 80 端口被占用

错误示例:

```text
Could not bind TCP port 80
```

查看占用进程:

```bash
sudo lsof -i:80
```

或者:

```bash
sudo ss -tlnp | grep :80
```

如果 Docker 占用端口:

```bash
docker stop container-name
```

完成续约后重新启动:

```bash
docker start container-name
```

### 域名验证失败

检查 DNS 是否解析正确:

```bash
nslookup example.com
```

或者:

```bash
dig example.com
```

确认域名已经指向当前服务器公网 IP。

## 总结

Certbot 可以自动管理 HTTPS 证书。对于生产环境，推荐使用 webroot 模式。

standalone 模式适合临时使用。该模式要求 TCP 80 端口空闲。

如果使用 Docker 或 Nginx，建议配合 Hook 实现自动停止和启动服务。
