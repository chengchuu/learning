# [ZH] Docker 容器启动时报错 "entrypoint.sh" 的排查与修复指南

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

本文聚焦 Docker 启动时 "entrypoint.sh" 存在却执行失败的问题，梳理 CRLF、权限、shebang、挂载覆盖、架构不匹配与 EOL 镜像仓库异常等根因，提供诊断命令与修复路径，并给出兼顾稳定性与可维护性的 Dockerfile、CI 与镜像升级建议。

- [概述](#概述)
- [常见现象与根因](#常见现象与根因)
- [为什么"文件存在但无法执行"](#为什么文件存在但无法执行)
  - [CRLF 与 LF 行尾不一致](#crlf-与-lf-行尾不一致)
  - [脚本没有可执行权限](#脚本没有可执行权限)
  - [shebang 解释器不匹配](#shebang-解释器不匹配)
  - [绑定挂载覆盖镜像内入口脚本](#绑定挂载覆盖镜像内入口脚本)
  - [二进制架构不匹配](#二进制架构不匹配)
  - [EOL 镜像导致构建期 apt 失败](#eol-镜像导致构建期-apt-失败)
- [快速诊断命令](#快速诊断命令)
  - [在宿主机进入容器进行排查](#在宿主机进入容器进行排查)
  - [在容器内检查文件状态](#在容器内检查文件状态)
- [修复方案与推荐模式](#修复方案与推荐模式)
  - [在源码侧统一行尾 (首选)](#在源码侧统一行尾-首选)
  - [在 Dockerfile 中直接转换行尾 (无额外依赖)](#在-dockerfile-中直接转换行尾-无额外依赖)
  - [构建时安装 dos2unix (按需)](#构建时安装-dos2unix-按需)
  - [确保脚本具备执行权限](#确保脚本具备执行权限)
  - [使用与镜像一致的 shebang](#使用与镜像一致的-shebang)
  - [处理 EOL Debian 镜像 (以 `node:10-buster` 为例)](#处理-eol-debian-镜像-以-node10-buster-为例)
  - [关注绑定挂载覆盖问题](#关注绑定挂载覆盖问题)
  - [Windows 宿主机的执行位问题](#windows-宿主机的执行位问题)
  - [架构不匹配问题](#架构不匹配问题)
- [推荐的最终 Dockerfile 模式](#推荐的最终-dockerfile-模式)
- [CI 与团队协作建议](#ci-与团队协作建议)
- [故障排查清单](#故障排查清单)
- [结论](#结论)

## 概述

明明把 `entrypoint.sh` 打进了镜像，容器一启动却直接退出。报错信息经常是 `no such file or directory`、`permission denied`，或者 `exec format error`。这类问题看起来像是"文件丢了"，但多数时候原因不在文件本身。下面按常见场景拆解原因，并给出排查思路和修复方式。

## 常见现象与根因

容器在启动阶段失败，通常由以下原因引起:

- 脚本使用 CRLF 行尾，而不是 LF。
- 脚本缺少可执行权限。
- shebang 解释器路径错误，或解释器不存在。
- 绑定挂载覆盖镜像内文件。
- 二进制文件架构不匹配。
- 基础镜像已 EOL (End of Life，生命周期结束)，导致 apt 仓库不可用。

以上问题都可能让容器在执行入口脚本时失败。

## 为什么"文件存在但无法执行"

### CRLF 与 LF 行尾不一致

如果脚本使用 Windows 的 CRLF 行尾，shebang 行末会带 `^M`。内核会把解释器路径识别为带回车符的路径，最终找不到解释器。此时常见报错是 `no such file or directory`。

### 脚本没有可执行权限

脚本在镜像内必须具备执行位，某些平台上的宿主机绑定挂载可能丢失执行位。此时常见报错是 `permission denied`。

### shebang 解释器不匹配

脚本可能写了 `#!/bin/bash`，但镜像里只有 `/bin/sh`。例如 Alpine 镜像默认使用 BusyBox `sh`。解释器路径错误时，脚本同样无法执行。

### 绑定挂载覆盖镜像内入口脚本

如果将宿主机目录挂载到 `/PATH`，会覆盖镜像内 `/PATH` 的内容。若宿主机目录没有 `entrypoint.sh`，容器就找不到入口脚本。

### 二进制架构不匹配

如果入口文件是二进制，且架构与运行平台不一致，会触发 `exec format error`。例如在 x86 环境执行 ARM 二进制。

### EOL 镜像导致构建期 apt 失败

旧版发行版 (如 buster) 可能已归档。构建时 `apt-get update`、`apt-get install` 可能返回 404 或 502。这会影响安装 `dos2unix` 等工具，间接导致行尾修复失败。

## 快速诊断命令

### 在宿主机进入容器进行排查

- `docker run --rm -it --entrypoint /bin/sh IMAGE_NAME`
- `docker-compose run --rm SERVICE_NAME sh`

### 在容器内检查文件状态

- `ls -l /PATH/entrypoint.sh`
- `stat /PATH/entrypoint.sh`
- `head -n1 /PATH/entrypoint.sh | sed -n l`
- `file /PATH/entrypoint.sh`
- `od -c /PATH/entrypoint.sh | head`

这组命令可以快速确认权限、行尾、解释器和文件类型。

## 修复方案与推荐模式

### 在源码侧统一行尾 (首选)

建议通过 `.gitattributes` 强制 shell 脚本使用 LF:

```plain
# .gitattributes
*.sh text eol=lf
```

同时在 CI 中加入行尾检查，避免问题进入镜像构建阶段。

### 在 Dockerfile 中直接转换行尾 (无额外依赖)

Debian 系镜像可用 `sed` 去除 CR:

```dockerfile
FROM node:10-buster

COPY entrypoint.sh /PATH/entrypoint.sh

RUN sed -i 's/\r$//' /PATH/entrypoint.sh \
 && chmod +x /PATH/entrypoint.sh

ENTRYPOINT ["/PATH/entrypoint.sh"]
```

也可使用 `tr`:

```plain
RUN tr -d '\r' < /PATH/entrypoint.sh > /PATH/entrypoint.sh.new && mv /PATH/entrypoint.sh.new /PATH/entrypoint.sh
```

### 构建时安装 dos2unix (按需)

在 `bookworm-slim` 中可直接安装:

```dockerfile
FROM debian:bookworm-slim

COPY entrypoint.sh /PATH/entrypoint.sh

RUN apt-get update \
  && apt-get install -y --no-install-recommends dos2unix \
  && dos2unix /PATH/entrypoint.sh \
  && chmod +x /PATH/entrypoint.sh \
  && rm -rf /var/lib/apt/lists/*
```

如果使用旧版镜像 (如 `node:10-buster`)，apt 可能不可用。此时优先使用 `sed` 或 `tr` 方案，避免依赖 apt。

### 确保脚本具备执行权限

可在宿主机设置:

```plain
chmod +x entrypoint.sh
```

也可在 Dockerfile 中设置:

```plain
RUN chmod +x /PATH/entrypoint.sh
```

### 使用与镜像一致的 shebang

- Alpine: 优先 `#!/bin/sh`。
- Debian 系: 通常可用 `/bin/bash`，但精简镜像可能仅有 `/bin/sh`。
- 如果无法保证解释器，建议在 `ENTRYPOINT` 显式调用 shell:

```plain
ENTRYPOINT ["sh", "/PATH/entrypoint.sh"]
```

### 处理 EOL Debian 镜像 (以 `node:10-buster` 为例)

问题是 buster 仓库已归档，apt 更新失败。可选方案如下:

- 首选: 升级到受支持镜像，例如 `node:18`、`node:20-bullseye`、`node:20-bookworm`。
- 最小改动: 不用 apt，改用 `sed` 或 `tr` 处理 CRLF。
- 必须使用 apt 时: 切换到归档仓库并关闭 valid-until 校验 (仅临时)。

```dockerfile
FROM node:10-buster
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list \
 && sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list || true \
 && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until \
 && apt-get update -o Acquire::Check-Valid-Until=false \
 && apt-get install -y --no-install-recommends dos2unix \
 && rm -rf /var/lib/apt/lists/*
```

该方案存在安全风险。归档仓库不再维护，应尽快升级镜像。

### 关注绑定挂载覆盖问题

如果在 `docker-compose` 中挂载 `./PATH:/PATH`，宿主机目录会覆盖镜像目录。当宿主机目录缺少入口脚本时，容器就无法找到它。

示例 (风险配置):

```plain
volumes:
  - ./PATH:/PATH
```

### Windows 宿主机的执行位问题

Windows 绑定挂载可能不保留执行位。可采用以下方式降低风险:

- 使用 `ENTRYPOINT ["sh", "/PATH/entrypoint.sh"]`。
- 优先使用命名卷，而不是宿主机目录绑定挂载。
- 在镜像内设置执行位，并避免挂载覆盖入口脚本路径。

### 架构不匹配问题

若入口为二进制文件，请确认其架构与目标平台一致，例如 ARM 二进制不能直接在 x86 环境执行。可使用多架构镜像，或按目标平台重新构建二进制。

## 推荐的最终 Dockerfile 模式

下面方案体积小、依赖少、稳定性高:

```dockerfile
FROM debian:bookworm-slim

WORKDIR /PATH
COPY entrypoint.sh /PATH/entrypoint.sh

RUN sed -i 's/\r$//' /PATH/entrypoint.sh \
 && chmod +x /PATH/entrypoint.sh

ENTRYPOINT ["/PATH/entrypoint.sh"]
```

## CI 与团队协作建议

在仓库中启用 `.gitattributes`，统一脚本行尾为 LF。

在 CI 增加检查步骤:

- CRLF 检查: `git grep -I --name-only $'\r' || true`
- shell 语法与规范检查 (如 shellcheck)

同时统一编辑器设置，确保仓库文件默认保存为 LF。

## 故障排查清单

排查时建议按以下顺序执行:

1. 记录完整错误信息。
2. 使用 `ls -l`、`head -n1 | sed -n l` 检查权限与行尾。
3. 旧镜像 apt 失败时，先改用 `sed` 方案，或直接升级基础镜像。
4. 使用绑定挂载时，核对宿主机目录内容与权限。
5. 怀疑解释器或架构问题时，检查 shebang 路径和二进制架构。

## 结论

`entrypoint.sh` 存在却无法执行时，最常见根因是 CRLF 行尾。建议优先在源码和 CI 中统一 LF。如果需要在镜像内快速修复，可使用 `sed -i 's/\r$//'`。同时请确认执行位、解释器路径和挂载配置正确。对于 EOL 镜像，应尽快升级到受支持版本，以减少构建和安全风险。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/6215.html>

(完)
