# macOS `scutil` 修改电脑名称与主机名称

我经常遇到这种情况: Finder 里看到的 Mac 名称是一套，局域网里用 `ssh` 或 `smb://` 访问时又是另一套。macOS 里这些名字确实不是同一个字段。

本文用 `scutil` 把它们理顺。你会看到 `ComputerName`、`LocalHostName`、`HostName` 分别负责什么，它们对 SMB、SSH 有什么影响，以及在 zsh 里通常怎么显示。

## 适用范围与开始前要知道的事

本文适用于 Intel Mac 和 Apple Silicon Mac。对较新的 macOS 和较旧的 macOS 也都通用，比如 macOS Monterey 12.7.6。

开始前，你只需要确认 3 点:

- 你能用管理员账号执行 `sudo`。
- 你主要在局域网里用 `.local` 访问，还是依赖公司网络的 DNS。
- 你想要"看起来好看"的名称，还是"好用好敲"的主机名。

这 3 点会影响你怎么取名。

## 三个名称分别是什么

macOS 常用 3 个名称属性。它们各司其职，你可以把它们理解成"显示名"、"局域网名"和"系统名"。

### ComputerName: 更像展示用的名字

`ComputerName` 是你在系统界面里最常看到的"电脑名称"。它更像一个展示用标签。

常见出现位置包括:

- System Settings (或 System Preferences) 的 Sharing 面板。
- Finder 侧边栏的共享设备列表。
- AirDrop 设备名称。

它可以包含空格，也能写成大写，比如 `CHENG AIR`。从体验上说，这个字段最适合用来满足"看着顺眼"。

### LocalHostName: `.local` 里常用的名字

`LocalHostName` 是局域网里更实用的那个名字，通常和 Bonjour (mDNS，组播域名系统) 绑定得更紧。

如果你在局域网里用 `.local` 访问，一般就是它在起作用:

- `ssh user@LOCALHOSTNAME.local`
- `smb://LOCALHOSTNAME.local`

命名上建议收敛一点。你可以用:

- 英文字母
- 阿拉伯数字
- 连接号 (`-`)

不建议用空格和下划线 (`_`)。有些服务能容忍，但兼容性会变差。你想要省心，就用连接号。

### HostName: 更偏 UNIX 语义的主机名

`HostName` 是系统层面的主机名，偏 UNIX 语义，很多命令行工具会用到它，或者受它影响。

它更常出现在这些场景里:

- 你希望 `hostname` 这类输出稳定、可控。
- 你在脚本里依赖主机名做分支判断。
- 你在企业网络里用 DNS 解析主机名。

需要注意的是: 如果网络没有给你的 Mac 配置 DNS 记录，你就算设置了 `HostName`，也不会自动获得一个可从外部解析的域名。此时 `ssh user@HOSTNAME` 往往还是不行，你需要 DNS 或直接用 IP。

## 全大写命名的取舍与建议

你希望"全部大写"，可以做到。不过在实际体验上，我更建议你把"展示"和"连接"分开考虑。

比较稳妥的一套全大写方案是:

- `ComputerName`: 用空格，适合展示，例如 `CHENG AIR`。
- `LocalHostName`: 用连接号，不用空格，例如 `CHENG-AIR`。
- `HostName`: 跟 `LocalHostName` 一致，例如 `CHENG-AIR`。

这样你在局域网里通常可以用 `CHENG-AIR.local` 访问。

另外补一句: 某些客户端会把 `.local` 显示成小写。你设置大写不代表失败，只是显示时做了规范化。

## 修改与验证

这部分就是操作步骤。建议你按顺序执行，然后用命令验证结果。

### 设置 3 个名称

下面命令会把 3 个名称都设置为全大写。

```bash
sudo scutil --set ComputerName "CHENG AIR"
sudo scutil --set LocalHostName "CHENG-AIR"
sudo scutil --set HostName "CHENG-AIR"
```

### 验证设置是否生效

你可以直接读取当前值。

```bash
scutil --get ComputerName
scutil --get LocalHostName
scutil --get HostName
```

如果你从没设置过 `HostName`，读取时可能报错。这个现象正常。你重新执行一次 `--set HostName` 就可以。

### 刷新显示与缓存

有时 Finder 或共享列表不会立刻更新。你可以先试试下面两种方式:

- 关闭并重新打开 Wi-Fi。
- 重启 Mac。

你也可以刷新缓存，这条命令一般没有副作用:

```bash
dscacheutil -flushcache
```

## SMB 与 SSH 分别怎么看这些名字

名字改完了，关键是"连接时到底用哪个"。SMB 和 SSH 的习惯不太一样。

### SMB: Finder 里看到的名字和连接用的名字可能不同

Finder 侧边栏看到的设备名称，通常更接近 `ComputerName`。所以你可能看到的是 `CHENG AIR`。

但你在地址栏里连接时，更建议用 `LocalHostName`，因为它更适合放进 URL:

- `smb://CHENG-AIR.local`

当然，你也可以直接用 IP:

- `smb://192.168.1.10`

如果你在局域网里经常手敲地址，`LocalHostName` 用连接号会明显舒服很多。

### SSH: `.local` 是最常见的用���

在局域网里通过 Bonjour 连接时，一般这样用:

- `ssh 用户名@CHENG-AIR.local`

如果你在公司网络里依赖 DNS，那么连接名通常由 DNS 决定。此时就算你设置了 `HostName`，也未必能让外部解析到它。

你可以用这些命令快速确认当前状态:

```bash
hostname
scutil --get HostName
scutil --get LocalHostName
```

## zsh 里主机名是怎么显示的

zsh 的提示符 (prompt) 显示什么，主要取决于主题或 `PROMPT` 变量。它不一定直接读取 `ComputerName`、`LocalHostName` 或 `HostName`。

很多配置会直接用 `hostname` 的输出，也就是你在终端里运行 `hostname` 看到的那一串。

你可以先确认一下当前 `hostname` 输出:

```bash
hostname
```

如果你想在 zsh 提示符里明确显示主机名，可以在 `~/.zshrc` 里设置 `PROMPT`。这是一个常见写法:

- `%n` 表示用户名。
- `%m` 表示主机名 (短格式)。

```bash
PROMPT='%n@%m %~ %# '
```

如果你使用 Oh My Zsh 或其他主题，主题可能会覆盖 `PROMPT`。这种情况下，你需要到主题的配置里改显示逻辑。

## 常见问题

### 我设置成大写了，为什么看到的是小写

部分系统或客户端会对 Bonjour 名称做规范化显示。它可能把 `CHENG-AIR.local` 显示为 `cheng-air.local`。

你可以用下面命令确认真实配置是否仍是你设置的值:

```bash
scutil --get LocalHostName
```

### LocalHostName 能不能带空格

不建议。

你可以让 `ComputerName` 带空格，用于展示。你应该让 `LocalHostName` 保持简单，用连接号连接单词。

当你更在意可读性时，用 `ComputerName`。

当你更在意连接稳定、兼容性好时，用 `LocalHostName`。
