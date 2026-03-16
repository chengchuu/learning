1 减少过于完美的句式结构；
2 避免过于机械化的段落结构；
3 使内容更自然，更像人类书写；
4 使内容视角更客观，移除第一/二/三人称；

Please output the code as one complete file (e.g., "macos-scutil-name-guide.md"), not multiple modules, so it can be copied and executed directly.

# macOS `scutil` 修改电脑名称与主机名称

本文介绍如何在 macOS 上使用 `scutil` 修改电脑名称与主机名称。本文同时说明 `ComputerName`、`LocalHostName` 和 `HostName` 的区别，以及这些名称在 SMB 和 SSH 场景中的作用。本文最后说明这些名称在 zsh 中的显示方式。

## 适用范围与准备工作

本文适用于 Intel Mac 和 Apple Silicon Mac。本文同样适用于较新的 macOS，以及较旧的 macOS (例如 macOS Monterey 12.7.6)。

你需要准备以下条件:

- 你可以使用管理员账号执行 `sudo`。
- 你了解目标网络是否提供 DNS 名称。
- 你知道自己更关注 SMB，还是更关注 SSH。

## 三个名称的区别与作用

macOS 常用以下 3 个名称属性。它们的用途不同，你应当分别设置。

### ComputerName 的作用

`ComputerName` 是"电脑名称"。它是一个面向用户的友好名称。

你通常会在以下位置看到该名称:

- System Settings (或 System Preferences) 的 Sharing 面板。
- Finder 的共享设备列表。
- AirDrop 的设备名称。

`ComputerName` 可以包含空格，也可以使用大写字母。

### LocalHostName 的作用

`LocalHostName` 是本地网络名称。它通常用于 Bonjour (mDNS) 场景。

当你在局域网内使用 `.local` 域名访问时，通常使用该名称:

- `ssh user@LOCALHOSTNAME.local`
- `smb://LOCALHOSTNAME.local`

`LocalHostName` 建议只使用以下字符:

- 英文字母
- 阿拉伯数字
- 连接号 (`-`)

你应当避免在 `LocalHostName` 中使用空格和下划线 (`_`)。部分服务可以容忍，但兼容性较差。

### HostName 的作用

`HostName` 是系统层面的主机名。它更偏向 UNIX 语义。

以下场景更可能用到 `HostName`:

- 你希望 `hostname` 或部分程序显示一个固定的主机名。
- 你将 Mac 加入企业网络，并通过 DNS 解析主机名。
- 你在脚本或远程管理中依赖主机名。

如果你的网络没有为你的 Mac 配置 DNS 记录，设置 `HostName` 并不会自动让外部网络可以通过 `ssh user@HOSTNAME` 访问你的 Mac。你仍然需要 DNS 或者使用 IP 地址。

## 推荐命名规则 (全大写方案)

你希望名称全大写时，建议按以下方式设置:

- `ComputerName`: 允许空格，适合显示用途，例如 `CHENG AIR`。
- `LocalHostName`: 使用连接号，不使用空格，例如 `CHENG-AIR`。
- `HostName`: 与 `LocalHostName` 一致，例如 `CHENG-AIR`。

这样设置后，你可以在局域网内优先使用 `CHENG-AIR.local` 访问。

## 修改操作与验证方法

### 使用 scutil 设置 3 个名称

以下命令将 3 个名称设置为全大写。

```bash
sudo scutil --set ComputerName "CHENG AIR"
sudo scutil --set LocalHostName "CHENG-AIR"
sudo scutil --set HostName "CHENG-AIR"
```

### 验证 scutil 设置结果

你可以使用以下命令检查当前值。

```bash
scutil --get ComputerName
scutil --get LocalHostName
scutil --get HostName
```

如果 `HostName` 未设置，`scutil --get HostName` 可能返回错误信息。这是正常现象。你可以重新执行 `--set HostName`。

### 使网络服务更快刷新

部分情况下，名称变更不会立刻反映到共享服务列表。你可以使用以下方法刷新:

- 关闭并重新打开 Wi-Fi。
- 重启 Mac。

你也可以刷新缓存。该命令通常不会造成副作用。

```bash
dscacheutil -flushcache
```

## SMB 与 SSH 场景说明

### SMB 连接时应当使用哪个名称

你在 Finder 里连接 SMB 时，建议优先使用 `LocalHostName`:

- `smb://CHENG-AIR.local`

如果你使用 IP 连接，也可以直接使用:

- `smb://192.168.1.10`

你在 Finder 侧边栏看到的设备显示名称，通常更接近 `ComputerName`。因此你会看到 `CHENG AIR`，但连接地址更适合使用 `CHENG-AIR.local`。

### SSH 连接时应当使用哪个名称

如果你在局域网内通过 Bonjour 连接，建议使用:

- `ssh 用户名@CHENG-AIR.local`

如果你在更复杂的网络环境通过 DNS 连接，你需要网络侧提供可解析的 DNS 名称。此时你可以使用 DNS 名称，或者使用 IP。

你可以执行以下命令检查本机当前主机名相关信息:

```bash
hostname
scutil --get HostName
scutil --get LocalHostName
```

## zsh 中名称显示的来源与配置建议

zsh 的提示符 (prompt) 显示内容由主题或 `PROMPT` 变量决定。它不一定直接使用 `ComputerName`、`LocalHostName` 或 `HostName`，常见情况是使用 `hostname` 的输出。

你可以用以下命令确认 `hostname` 当前输出:

```bash
hostname
```

如果你希望 zsh 明确显示你设置的名称，建议在 `~/.zshrc` 中显式使用主机名变量。以下示例展示一种常见写法:

- `%n` 表示用户名。
- `%m` 表示主机名 (短格式)。

```bash
PROMPT='%n@%m %~ %# '
```

如果你使用 Oh My Zsh 或其他主题系统，主题可能会覆盖 `PROMPT`。你需要在主题配置中调整显示逻辑。

## 常见问题

### 为什么我设置了全大写，但看到的是小写

部分客户端会对 Bonjour 名称做规范化显示。它可能将 `CHENG-AIR.local` 显示为 `cheng-air.local`。

这是客户端显示策略导致的现象，不代表设置失败。你可以用 `scutil --get LocalHostName` 确认真实配置。

### 我能否把 LocalHostName 设置为带空格的名字

你可以为 `ComputerName` 使用空格。你不应当为 `LocalHostName` 使用空格。

当你需要一个可读性更强的显示名称时，使用 `ComputerName`。当你需要一个稳定的网络访问名称时，使用 `LocalHostName`。
