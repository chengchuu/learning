# macOS 使用 `scutil` 统一 ComputerName、LocalHostName 与 HostName

![Draft_macOS_scutil](#)

macOS 中，Finder 里显示的设备名称与局域网访问时使用的主机名，可能来自不同字段。`scutil` 可以分别设置 `ComputerName`、`LocalHostName` 和 `HostName`，从而控制显示名称、Bonjour (mDNS，组播域名系统) 名称，以及系统层面的主机名行为。本文说明 3 个字段的差异与用途，并给出 SMB、SSH 相关的使用方式，以及 zsh 提示符中常见的显示来源与配置方法。

- [适用范围与开始前的说明](#适用范围与开始前的说明)
- [三个名称字段的区别](#三个名称字段的区别)
  - [ComputerName: 面向展示的电脑名称](#computername-面向展示的电脑名称)
  - [LocalHostName: Bonjour 与 `.local` 的常用名称](#localhostname-bonjour-与-local-的常用名称)
  - [HostName: 系统层面的主机名字段](#hostname-系统层面的主机名字段)
- [全大写命名的建议](#全大写命名的建议)
- [修改与验证](#修改与验证)
  - [设置 3 个名称字段](#设置-3-个名称字段)
  - [验证设置结果](#验证设置结果)
  - [刷新显示与缓存](#刷新显示与缓存)
- [SMB 与 SSH 场景中的使用方式](#smb-与-ssh-场景中的使用方式)
  - [SMB: 显示名称与连接地址可能不同](#smb-显示名称与连接地址可能不同)
  - [SSH: 局域网常用 `.local`，企业网络常用 DNS](#ssh-局域网常用-local企业网络常用-dns)
- [zsh 提示符中的主机名显示来源](#zsh-提示符中的主机名显示来源)
- [常见问题](#常见问题)
  - [设置为大写后，显示为小写的原因](#设置为大写后显示为小写的原因)
  - [LocalHostName 是否适合使用空格](#localhostname-是否适合使用空格)

## 适用范围与开始前的说明

本文适用于 Apple Silicon Mac 和 Intel Mac。对较新的 macOS 和较旧的 macOS 同样通用，例如 macOS Monterey 12.7.6。

执行前建议明确以下信息:

- 是否具备管理员权限并可执行 `sudo`。
- 局域网访问是否依赖 `.local`，或依赖企业网络 DNS。
- 名称更关注展示效果，还是更关注网络连接时的可用性与兼容性。

## 三个名称字段的区别

macOS 常用 3 个名称字段。他们用途不同，通常可以分别理解为显示名称、局域网名称和系统名称。

### ComputerName: 面向展示的电脑名称

`ComputerName` 是系统界面中常见的"电脑名称"。他主要用于展示与识别。

常见出现位置包括:

- System Settings (或 System Preferences) 的 Sharing 面板。
- Finder 侧边栏的共享设备列表。
- AirDrop 的设备名称。

`ComputerName` 支持空格，也支持大写字母。该字段更适合用于可读性较强的名称，例如 `USER MACBOOK`。

### LocalHostName: Bonjour 与 `.local` 的常用名称

`LocalHostName` 通常用于 Bonjour (mDNS) 场景。局域网内通过 `.local` 域名访问时，常见使用方式如下:

- `ssh user@LOCALHOSTNAME.local`
- `smb://LOCALHOSTNAME.local`

命名建议使用以下字符集合:

- 英文字母
- 阿拉伯数字
- 连接号 (`-`)

不建议使用空格和下划线 (`_`)。部分服务可容忍，但可能带来兼容性问题。为降低不确定性，建议使用连接号。

### HostName: 系统层面的主机名字段

`HostName` 更偏 UNIX 语义。一些命令行工具与系统组件会使用该字段，或受该字段影响。

常见用途包括:

- 需要让 `hostname` 或相关程序显示稳定、可控的主机名。
- 在脚本或远程管理工具中依赖主机名。
- 在企业网络环境中通过 DNS 解析主机名。

需要注意的是: 如果网络侧未为该主机配置 DNS 记录，仅设置 `HostName` 并不会自动获得可从外部网络解析的域名。此时应使用 DNS 名称或 IP 地址进行连接。

## 全大写命名的建议

全大写命名可以实现，但建议区分展示用途与连接用途，以降低 URL 输入与服务兼容性风险。

推荐的全大写方案如下:

- `ComputerName`: 可包含空格，用于展示，例如 `USER MACBOOK`。
- `LocalHostName`: 使用连接号，不使用空格，例如 `USER-MACBOOK`。
- `HostName`: 与 `LocalHostName` 一致，例如 `USER-MACBOOK`。

该方案在局域网中通常可以使用 `USER-MACBOOK.local` 进行访问。

部分客户端可能会将 `.local` 名称以小写显示。这通常是显示层的规范化行为，不代表设置未生效。

## 修改与验证

本节给出修改命令、验证命令，以及常见刷新方式。

### 设置 3 个名称字段

以下命令将 3 个名称设置为全大写。

```bash
sudo scutil --set ComputerName "USER MACBOOK"
sudo scutil --set LocalHostName "USER-MACBOOK"
sudo scutil --set HostName "USER-MACBOOK"
```

### 验证设置结果

以下命令用于读取当前值。

```bash
scutil --get ComputerName
scutil --get LocalHostName
scutil --get HostName
```

如果 `HostName` 未设置，执行 `scutil --get HostName` 可能返回错误信息。该现象属于正常情况。重新执行 `--set HostName` 后再验证即可。

### 刷新显示与缓存

名称变更后，Finder 或共享列表可能不会立即刷新。常见处理方式包括:

- 关闭并重新打开 Wi-Fi。
- 重启 Mac。

也可以执行缓存刷新命令。该操作通常不会造成副作用。

```bash
dscacheutil -flushcache
```

## SMB 与 SSH 场景中的使用方式

SMB 与 SSH 对名称字段的依赖方式不完全一致。连接时建议优先选择更适合网络标识与 URL 的字段。

### SMB: 显示名称与连接地址可能不同

Finder 侧边栏显示的设备名称通常更接近 `ComputerName`，例如 `USER MACBOOK`。

连接地址建议优先使用 `LocalHostName`，更适合用于 URL:

- `smb://USER-MACBOOK.local`

也可以直接使用 IP 地址:

- `smb://192.168.1.10`

### SSH: 局域网常用 `.local`，企业网络常用 DNS

在局域网中通过 Bonjour 连接时，常见形式为:

- `ssh 用户名@USER-MACBOOK.local`

在企业网络中，如果访问依赖 DNS，连接名通常由 DNS 提供。此时即使设置了 `HostName`，也不一定能被外部网络解析。应以 DNS 配置结果为准。

以下命令可用于确认本机与主机名相关的状态:

```bash
hostname
scutil --get HostName
scutil --get LocalHostName
```

## zsh 提示符中的主机名显示来源

zsh 的提示符 (prompt) 由主题或 `PROMPT` 变量决定。他不一定直接读取 `ComputerName`、`LocalHostName` 或 `HostName`。在常见配置中，提示符会使用 `hostname` 的输出作为主机名显示来源。

可通过以下命令查看 `hostname` 输出:

```bash
hostname
```

如需在 `~/.zshrc` 中显式配置提示符，可以使用如下示例:

- `%n` 表示用户名。
- `%m` 表示主机名 (短格式)。

```bash
PROMPT='%n@%m %~ %# '
```

如果使用 Oh My Zsh 或其他主题系统，主题可能覆盖 `PROMPT`。此时应在主题配置中调整显示逻辑。

## 常见问题

### 设置为大写后，显示为小写的原因

部分系统或客户端会对 Bonjour 名称做规范化显示，可能将 `USER-MACBOOK.local` 显示为 `user-macbook.local`。

可通过以下命令确认实际配置值:

```bash
scutil --get LocalHostName
```

### LocalHostName 是否适合使用空格

不建议为 `LocalHostName` 使用空格。

`ComputerName` 适用于展示场景，可使用空格增强可读性。`LocalHostName` 更适合用于网络访问标识，建议保持字符集简单，并使用连接号连接单词。
