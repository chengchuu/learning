# Debian 安装与使用 `Certbot`

- [概述](#概述)
- [前置条件](#前置条件)
- [安装 Certbot](#安装-certbot)
  - [安装基础组件](#安装基础组件)
  - [安装 Web 服务插件](#安装-web-服务插件)
- [申请 HTTPS 证书](#申请-https-证书)
  - [使用 standalone 模式](#使用-standalone-模式)
  - [使用 webroot 模式](#使用-webroot-模式)
  - [使用 Nginx 插件](#使用-nginx-插件)
  - [申请通配符证书](#申请通配符证书)
- [配置和验证证书](#配置和验证证书)
  - [配置 Nginx](#配置-nginx)
  - [验证证书](#验证证书)
- [查看证书状态](#查看证书状态)
  - [查看全部证书](#查看全部证书)
  - [查看证书目录](#查看证书目录)
- [续约证书](#续约证书)
  - [测试续约](#测试续约)
  - [执行续约](#执行续约)
  - [续约指定证书](#续约指定证书)
- [使用 Hook](#使用-hook)
  - [Hook 类型](#hook-类型)
  - [使用命令行 Hook](#使用命令行-hook)
  - [使用 Hook 脚本目录](#使用-hook-脚本目录)
  - [测试 deploy-hook](#测试-deploy-hook)
- [管理自动续约](#管理自动续约)
  - [查看定时器状态](#查看定时器状态)
  - [查看续约日志](#查看续约日志)
- [撤销和删除证书](#撤销和删除证书)
  - [撤销证书](#撤销证书)
  - [删除证书](#删除证书)
- [常见问题](#常见问题)
  - [TCP 80 端口被占用](#tcp-80-端口被占用)
  - [Docker Compose 服务占用端口](#docker-compose-服务占用端口)
  - [域名验证失败](#域名验证失败)
  - [webroot 验证文件无法访问](#webroot-验证文件无法访问)
- [总结](#总结)

## 概述

Certbot 是一个 ACME (Automated Certificate Management Environment，自动证书管理环境) 客户端。它可以申请、部署、续约和撤销 HTTPS 证书。

Certbot 通常用于申请 Let's Encrypt 证书。它支持以下验证方式:

- `standalone`
- `webroot`
- Nginx 插件
- Apache 插件
- DNS 插件
- 手动 DNS 验证

本文以 Debian 系统为例，介绍 Certbot 的安装、申请、续约和自动化管理方法。

## 前置条件

开始申请证书前，需要确认以下条件:

- 域名的 `A` 记录已指向服务器的公网 IPv4 地址。
- 域名存在 `AAAA` 记录时，该记录必须指向正确的 IPv6 地址。
- HTTP 验证需要外部网络访问服务器的 TCP 80 端口。
- 防火墙和云服务安全组必须允许 TCP 80 和 TCP 443。
- 当前用户必须拥有 `sudo` 权限。

可以使用以下命令检查 DNS 解析:

```bash
dig +short A example.com
dig +short AAAA example.com
```

## 安装 Certbot

### 安装基础组件

更新 Debian 软件包索引:

```bash
sudo apt update
```

安装 Certbot:

```bash
sudo apt install certbot
```

检查安装结果:

```bash
certbot --version
```

输出会包含当前安装的 Certbot 版本。

### 安装 Web 服务插件

使用 Nginx 时，安装 Nginx 插件:

```bash
sudo apt install python3-certbot-nginx
```

使用 Apache 时，安装 Apache 插件:

```bash
sudo apt install python3-certbot-apache
```

查看已经安装的 Certbot 插件:

```bash
sudo certbot plugins
```

## 申请 HTTPS 证书

### 使用 standalone 模式

`standalone` 模式会启动一个临时 HTTP 服务。该服务默认监听 TCP 80 端口。

申请单个域名证书:

```bash
sudo certbot certonly \
  --standalone \
  -d example.com
```

申请包含多个域名的证书:

```bash
sudo certbot certonly \
  --standalone \
  -d example.com \
  -d www.example.com
```

该模式不会修改 Nginx 或 Apache 配置。申请成功后，需要手动配置 Web 服务。

使用该模式前，需要确认 TCP 80 端口处于空闲状态:

```bash
sudo ss -ltnp | grep ':80'
```

Nginx、Apache 或 Docker 容器可能占用该端口。

### 使用 webroot 模式

`webroot` 模式通过现有 Web 服务提供验证文件。该模式不需要停止 Nginx 或 Apache。

假设网站根目录为:

```text
/var/www/html
```

申请证书:

```bash
sudo certbot certonly \
  --webroot \
  --webroot-path /var/www/html \
  -d example.com
```

也可以使用 `-w` 作为简写:

```bash
sudo certbot certonly \
  --webroot \
  -w /var/www/html \
  -d example.com
```

Certbot 会在以下目录创建临时验证文件:

```text
/var/www/html/.well-known/acme-challenge/
```

外部网络必须能够访问该目录中的文件。

使用 Nginx 时，可以增加以下配置:

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/html;
    default_type text/plain;
    try_files $uri =404;
}
```

修改配置后，执行检查和重载:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 使用 Nginx 插件

Nginx 插件可以申请证书，并自动修改 Nginx 配置:

```bash
sudo certbot --nginx \
  -d example.com \
  -d www.example.com
```

如果只申请证书，不修改 Nginx 配置，可以执行:

```bash
sudo certbot certonly --nginx \
  -d example.com \
  -d www.example.com
```

执行自动配置前，建议先检查 Nginx 配置:

```bash
sudo nginx -t
```

### 申请通配符证书

通配符证书必须使用 DNS 验证。

以下命令使用手动 DNS 验证:

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d example.com \
  -d '*.example.com'
```

Certbot 会要求用户创建一条 DNS `TXT` 记录。

手动 DNS 验证无法直接实现无人值守续约。生产环境应优先使用对应 DNS 服务商的 Certbot 插件。

## 配置和验证证书

### 配置 Nginx

Certbot 默认将证书保存在以下目录:

```text
/etc/letsencrypt/live/example.com/
```

Nginx 通常使用以下两个文件:

```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

完整的 HTTPS 配置示例:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    root /var/www/html;
}
```

检查并重载 Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

不要将 `privkey.pem` 提交到 Git 仓库，也不要向其他用户开放读取权限。

### 验证证书

查看证书主题、签发机构和有效期:

```bash
sudo openssl x509 \
  -in /etc/letsencrypt/live/example.com/cert.pem \
  -noout \
  -subject \
  -issuer \
  -dates
```

测试 HTTPS 连接:

```bash
curl -I https://example.com
```

检查 Nginx 配置:

```bash
sudo nginx -t
```

## 查看证书状态

### 查看全部证书

列出 Certbot 管理的证书:

```bash
sudo certbot certificates
```

示例输出:

```text
Certificate Name: example.com
Domains: example.com www.example.com
Expiry Date: 2026-09-20 08:00:00+00:00
Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```

`Certificate Name` 是 Certbot 内部使用的证书名称。续约、撤销和删除证书时，可以通过 `--cert-name` 指定该名称。

### 查看证书目录

Certbot 的常用目录如下:

| 目录 | 用途 |
|---|---|
| `/etc/letsencrypt/live/` | 当前有效证书的软链接 |
| `/etc/letsencrypt/archive/` | 证书的历史版本 |
| `/etc/letsencrypt/renewal/` | 每张证书的续约配置 |
| `/etc/letsencrypt/renewal-hooks/` | 自动续约 Hook 脚本 |
| `/var/log/letsencrypt/` | Certbot 日志 |
| `/var/lib/letsencrypt/` | Certbot 工作数据 |

Web 服务应引用 `/etc/letsencrypt/live/` 中的文件。

不要直接修改 `live` 或 `archive` 目录中的文件。

## 续约证书

### 测试续约

使用 Let's Encrypt 测试环境模拟续约:

```bash
sudo certbot renew --dry-run
```

测试成功时，会出现类似输出:

```text
Congratulations, all simulated renewals succeeded
```

`--dry-run` 不会替换当前使用的正式证书。

### 执行续约

检查全部证书并续约符合条件的证书:

```bash
sudo certbot renew
```

Certbot 4.0.0 及以上版本会根据证书总有效期计算续约时间。

当证书剩余有效期少于总有效期的三分之一时，Certbot 会尝试续约。有效期不超过 10 天的证书使用二分之一作为阈值。

`certbot renew` 可以频繁执行。尚未进入续约期的证书会被跳过。

### 续约指定证书

只检查指定证书:

```bash
sudo certbot renew \
  --cert-name example.com
```

强制续约指定证书:

```bash
sudo certbot renew \
  --cert-name example.com \
  --force-renewal
```

强制续约会申请新的正式证书。频繁执行可能触发证书颁发机构的速率限制。

Certbot 2.3.0 及以上版本可以使用 `reconfigure` 修改续约参数:

```bash
sudo certbot reconfigure \
  --cert-name example.com \
  --webroot-path /srv/www/example.com
```

Certbot 会先通过测试环境验证新配置。验证成功后，新配置会用于后续续约。

不建议直接编辑以下文件:

```text
/etc/letsencrypt/renewal/example.com.conf
```

错误配置可能导致自动续约失败。

## 使用 Hook

### Hook 类型

Hook (钩子) 可以在续约流程的不同阶段执行命令。

| Hook | 执行时间 | 常见用途 |
|---|---|---|
| `pre-hook` | 开始续约尝试前 | 停止占用 TCP 80 的服务 |
| `post-hook` | 完成续约尝试后 | 恢复此前停止的服务 |
| `deploy-hook` | 证书成功签发或续约后 | 重载 Web 服务或部署证书 |

`pre-hook` 和 `post-hook` 只会在 Certbot 实际尝试续约时执行。

`post-hook` 不代表续约成功。需要在成功后执行的操作，应使用 `deploy-hook`。

### 使用命令行 Hook

standalone 模式需要释放 TCP 80 端口时，可以停止并恢复 Nginx:

```bash
sudo certbot renew \
  --pre-hook "systemctl stop nginx" \
  --post-hook "systemctl start nginx"
```

如果 Nginx 由 Docker Compose 管理，可以执行:

```bash
sudo certbot renew \
  --pre-hook "docker compose -f /srv/web/compose.yaml stop nginx" \
  --post-hook "docker compose -f /srv/web/compose.yaml start nginx"
```

`docker compose stop nginx` 会停止现有容器，但不会删除容器。

`docker compose start nginx` 会重新启动该容器。

定时任务的工作目录并不固定。因此，Hook 中应通过 `-f` 指定 Compose 文件的绝对路径。

证书成功续约后，可以重载 Nginx:

```bash
sudo certbot renew \
  --deploy-hook "systemctl reload nginx"
```

### 使用 Hook 脚本目录

Certbot 会自动执行以下目录中的可执行文件:

```text
/etc/letsencrypt/renewal-hooks/pre/
/etc/letsencrypt/renewal-hooks/deploy/
/etc/letsencrypt/renewal-hooks/post/
```

创建 standalone 模式的 Docker Compose 停止脚本:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/pre/10-stop-nginx
```

写入以下内容:

```sh
#!/bin/sh
set -eu

/usr/bin/docker compose \
  -f /srv/web/compose.yaml \
  stop nginx
```

创建恢复脚本:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/post/90-start-nginx
```

写入以下内容:

```sh
#!/bin/sh
set -eu

/usr/bin/docker compose \
  -f /srv/web/compose.yaml \
  start nginx
```

授予执行权限:

```bash
sudo chmod +x \
  /etc/letsencrypt/renewal-hooks/pre/10-stop-nginx \
  /etc/letsencrypt/renewal-hooks/post/90-start-nginx
```

确认 Docker 的实际路径:

```bash
command -v docker
```

如果输出路径不是 `/usr/bin/docker`，需要同步修改脚本。

### 测试 deploy-hook

普通 `--dry-run` 不会执行 `deploy-hook`。

测试续约和 `deploy-hook`:

```bash
sudo certbot renew \
  --dry-run \
  --run-deploy-hooks
```

测试成功时，Certbot 会使用当前正式证书执行 `deploy-hook`。它不会部署测试环境生成的临时证书。

## 管理自动续约

### 查看定时器状态

通过 Debian 软件包安装 Certbot 后，系统通常会创建 systemd 定时器。

查看定时器状态:

```bash
sudo systemctl status certbot.timer
```

查看下次执行时间:

```bash
sudo systemctl list-timers --all | grep certbot
```

启用并立即启动定时器:

```bash
sudo systemctl enable --now certbot.timer
```

正常运行时，状态通常为:

```text
Active: active (waiting)
```

`waiting` 表示定时器正在等待下一次触发。

定时器会触发以下服务:

```text
certbot.service
```

`certbot.service` 通常是一次性任务。任务执行完成后，显示 `inactive (dead)` 属于正常情况。

### 查看续约日志

查看 `certbot.service` 日志:

```bash
sudo journalctl \
  --unit certbot.service \
  --lines 50 \
  --no-pager
```

查看最近一次启动后的日志:

```bash
sudo journalctl \
  --unit certbot.service \
  --boot \
  --no-pager
```

查看 Certbot 文件日志:

```bash
sudo tail -n 100 \
  /var/log/letsencrypt/letsencrypt.log
```

实时查看日志:

```bash
sudo tail -f \
  /var/log/letsencrypt/letsencrypt.log
```

## 撤销和删除证书

### 撤销证书

撤销操作会通知证书颁发机构停止信任该证书。

按证书名称撤销:

```bash
sudo certbot revoke \
  --cert-name example.com
```

也可以使用证书文件:

```bash
sudo certbot revoke \
  --cert-path /etc/letsencrypt/live/example.com/cert.pem
```

私钥泄露时，可以指定撤销原因:

```bash
sudo certbot revoke \
  --cert-name example.com \
  --reason keycompromise
```

撤销后，如果保留续约配置，Certbot 仍可能再次尝试续约。无需继续使用时，应同时删除该证书。

### 删除证书

先查看证书名称:

```bash
sudo certbot certificates
```

删除证书前，需要移除 Nginx、Apache 或其他服务中的证书路径引用。

确认服务配置不再引用该证书后，执行:

```bash
sudo certbot delete \
  --cert-name example.com
```

不要直接删除 `/etc/letsencrypt/` 中的证书文件。

删除操作不会自动撤销证书。私钥未泄露时，通常不需要专门撤销。

## 常见问题

### TCP 80 端口被占用

错误示例:

```text
Could not bind TCP port 80 because it is already in use
```

查看端口占用情况:

```bash
sudo ss -ltnp | grep ':80'
```

也可以使用:

```bash
sudo lsof -iTCP:80 -sTCP:LISTEN
```

停止对应服务后，重新测试续约:

```bash
sudo certbot renew --dry-run
```

### Docker Compose 服务占用端口

查看容器端口映射:

```bash
docker compose ps
```

查看全部运行中的容器:

```bash
docker ps \
  --format 'table {{.Names}}\t{{.Ports}}'
```

停止指定 Compose 服务:

```bash
docker compose \
  -f /srv/web/compose.yaml \
  stop nginx
```

重新启动指定服务:

```bash
docker compose \
  -f /srv/web/compose.yaml \
  start nginx
```

`start` 只能启动已经存在且处于停止状态的容器。

如果容器已经通过 `docker compose down` 删除，需要重新创建:

```bash
docker compose \
  -f /srv/web/compose.yaml \
  up -d nginx
```

standalone 模式配合自动续约时，应配置 `pre-hook` 和 `post-hook`。否则，systemd 定时续约可能因端口冲突而失败。

### 域名验证失败

检查 IPv4 解析:

```bash
dig +short A example.com
```

检查 IPv6 解析:

```bash
dig +short AAAA example.com
```

检查 HTTP 是否可以访问:

```bash
curl -I http://example.com
```

如果存在错误的 `AAAA` 记录，Let's Encrypt 可能访问错误的 IPv6 地址。此时需要修正或删除该记录。

还需要检查以下项目:

- 云服务安全组
- Debian 防火墙
- 路由器端口转发
- 运营商端口限制
- HTTP 重定向规则

### webroot 验证文件无法访问

创建测试文件:

```bash
sudo mkdir -p \
  /var/www/html/.well-known/acme-challenge

echo 'certbot-test' | sudo tee \
  /var/www/html/.well-known/acme-challenge/test
```

从外部访问:

```bash
curl \
  http://example.com/.well-known/acme-challenge/test
```

预期输出:

```text
certbot-test
```

测试完成后删除文件:

```bash
sudo rm \
  /var/www/html/.well-known/acme-challenge/test
```

如果返回 `403` 或 `404`，需要检查 Nginx 的 `root`、`alias`、`try_files` 和隐藏文件拦截规则。

查看详细错误日志:

```bash
sudo certbot renew --dry-run -v
```

## 总结

Debian 可以通过 APT 安装 Certbot 及其 Web 服务插件。

已经运行 Nginx 的服务器，优先使用 Nginx 插件或 `webroot` 模式。这两种方式通常不需要停止 Web 服务。

`standalone` 模式适合没有 Web 服务的服务器。该模式也适合可以短暂停止反向代理的场景。

Docker 容器占用 TCP 80 时，可以使用 Hook 停止并恢复指定服务。Hook 应使用 Compose 文件的绝对路径。

完成配置后，应检查 `certbot.timer`，并执行以下测试:

```bash
sudo certbot renew --dry-run
```

只有测试成功，才能确认自动续约流程可以正常工作。
