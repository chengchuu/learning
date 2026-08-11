# macOS 使用 `scutil` 统一 ComputerName、LocalHostName 与 HostName

macOS 使用不同字段管理设备显示名称和网络主机名。通过 `scutil`，可以分别设置 `ComputerName`、`LocalHostName` 和 `HostName`。这些字段会影响系统显示名称、Bonjour (mDNS，组播域名系统) 名称和系统主机名。本文说明 3 个字段的差异与用途，并介绍 SMB、SSH 和 zsh 提示符中的常见使用方式。

- [适用范围与准备工作](#适用范围与准备工作)
- [3 个名称字段的区别](#3-个名称字段的区别)
  - [ComputerName: 面向展示的电脑名称](#computername-面向展示的电脑名称)
  - [LocalHostName: Bonjour 与 `.local` 的常用名称](#localhostname-bonjour-与-local-的常用名称)
  - [HostName: 系统层面的主机名字段](#hostname-系统层面的主机名字段)
- [常规命名建议](#常规命名建议)
- [修改与验证](#修改与验证)
  - [设置 3 个名称字段](#设置-3-个名称字段)
  - [验证设置结果](#验证设置结果)
  - [刷新显示与缓存](#刷新显示与缓存)
- [SMB 与 SSH 场景中的使用方式](#smb-与-ssh-场景中的使用方式)
  - [SMB: 显示名称与连接地址可能不同](#smb-显示名称与连接地址可能不同)
  - [SSH: 局域网常用 `.local`，企业网络常用 DNS](#ssh-局域网常用-local企业网络常用-dns)
- [zsh 提示符中的主机名显示来源](#zsh-提示符中的主机名显示来源)
- [常见问题](#常见问题)
  - [`.local` 名称为什么可能显示为小写](#local-名称为什么可能显示为小写)
  - [LocalHostName 是否适合使用空格](#localhostname-是否适合使用空格)

## 适用范围与准备工作

本文适用于 Apple Silicon Mac 和 Intel Mac，也适用于不同版本的 macOS，例如 macOS Monterey 12.7.6。

执行前建议明确以下信息:

- 是否具备管理员权限并可执行 `sudo`。
- 局域网访问是否依赖 `.local`，或依赖企业网络 DNS。
- 名称主要用于系统展示，还是用于网络连接。

## 3 个名称字段的区别

macOS 常用 3 个名称字段，分别对应显示名称、局域网名称和系统主机名。

### ComputerName: 面向展示的电脑名称

`ComputerName` 是系统界面中常见的"电脑名称"，主要用于展示和识别设备。

常见出现位置包括:

- System Settings (或 System Preferences) 的 Sharing 面板。
- Finder 侧边栏的共享设备列表。
- AirDrop 的设备名称。

`ComputerName` 支持空格和大小写字母，适合使用可读性较强的名称，例如 `User MacBook`。

### LocalHostName: Bonjour 与 `.local` 的常用名称

`LocalHostName` 通常用于 Bonjour (mDNS) 场景。在局域网内通过 `.local` 域名访问时，可以使用以下形式:

- `ssh user@User-MacBook.local`
- `smb://User-MacBook.local`

命名建议使用以下字符集合:

- 英文字母
- 阿拉伯数字
- 连接号 (`-`)

空格和下划线 (`_`) 可能带来兼容性问题，建议使用连接号分隔单词。

### HostName: 系统层面的主机名字段

`HostName` 具有更明确的 UNIX 主机名语义。一些命令行工具和系统组件会使用该字段，或受该字段影响。

常见用途包括:

- 需要让 `HostName` 或相关程序显示稳定、可控的主机名。
- 在脚本或远程管理工具中依赖主机名。
- 在企业网络环境中通过 DNS 解析主机名。

如果网络侧未为该主机配置 DNS 记录，仅设置 `HostName` 不会自动获得可从外部网络解析的域名。此时，应使用 DNS 名称或 IP 地址连接。

## 常规命名建议

建议根据字段用途设置名称。展示名称可以保留空格，网络名称则使用连接号。该方式兼顾可读性和网络连接时的兼容性。

推荐方案如下:

- `ComputerName`: 可包含空格，用于展示，例如 `User MacBook`。
- `LocalHostName`: 使用连接号，不使用空格，例如 `User-MacBook`。
- `HostName`: 与 `LocalHostName` 保持一致，例如 `User-MacBook`。

使用该方案后，局域网内通常可以通过 `User-MacBook.local` 访问设备。

部分客户端可能以小写形式显示 `.local` 名称。这通常是显示层的规范化行为，不代表设置未生效。

## 修改与验证

本节介绍名称设置、结果验证和缓存刷新方式。

### 设置 3 个名称字段

以下命令按照字段用途设置 3 个名称。

```bash
sudo scutil --set ComputerName "User MacBook"
sudo scutil --set LocalHostName "User-MacBook"
sudo scutil --set HostName "User-MacBook"
```

### 验证设置结果

以下命令用于读取当前值。

```bash
scutil --get ComputerName
scutil --get LocalHostName
scutil --get HostName
```

如果尚未设置 `HostName`，执行 `scutil --get HostName` 可能返回错误信息。可以先设置 `HostName`，再重新验证。

### 刷新显示与缓存

名称变更后，Finder 或共享列表可能不会立即刷新。可以尝试以下方式:

- 关闭并重新打开 Wi-Fi。
- 重启 Mac。

也可以执行以下命令刷新缓存:

```bash
dscacheutil -flushcache
```

## SMB 与 SSH 场景中的使用方式

SMB 与 SSH 对名称字段的依赖方式不完全一致。连接时建议优先选择更适合网络标识与 URL 的字段。

### SMB: 显示名称与连接地址可能不同

Finder 侧边栏显示的设备名称通常更接近 `ComputerName`，例如 `User MacBook`。

连接地址建议优先使用 `LocalHostName`，更适合用于 URL:

- `smb://User-MacBook.local`

也可以直接使用 IP 地址:

- `smb://192.168.1.10`

### SSH: 局域网常用 `.local`，企业网络常用 DNS

在局域网中通过 Bonjour 连接时，常见形式为:

- `ssh 用户名@User-MacBook.local`

在企业网络中，如果访问依赖 DNS，连接名通常由 DNS 提供。此时即使设置了 `HostName`，也不一定能被外部网络解析。应以 DNS 配置结果为准。

以下命令可用于确认本机与主机名相关的状态:

```bash
hostname
scutil --get HostName
scutil --get LocalHostName
```

## zsh 提示符中的主机名显示来源

zsh 的提示符 (prompt) 由主题或 `PROMPT` 变量决定，不一定直接读取 `ComputerName`、`LocalHostName` 或 `HostName`。常见配置会使用 `hostname` 的输出作为主机名显示来源。

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

### `.local` 名称为什么可能显示为小写

部分系统或客户端会规范化 Bonjour 名称的显示形式，例如将 `User-MacBook.local` 显示为 `user-macbook.local`。

可通过以下命令确认实际配置值:

```bash
scutil --get LocalHostName
```

### LocalHostName 是否适合使用空格

不建议为 `LocalHostName` 使用空格。

`ComputerName` 适用于展示场景，可以使用空格增强可读性。`LocalHostName` 用于网络访问标识时，建议保持字符集简单，并使用连接号分隔单词。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/6437.html>

<!-- id: 26-0613-macOS-scutil -->

(完)
