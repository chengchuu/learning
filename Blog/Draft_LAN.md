# Mac 旁路由 + Surge 5 实现指南

## 系统环境与目标

本文介绍如何在 macOS Monterey 12.7.6 上，使用 Surge 5 构建一个旁路由系统。该系统基于 WiFi 热点，实现设备自动代理与分流。

目标如下:

- 使用 Mac 作为旁路由节点
- 使用 Surge 5 实现透明代理
- 所有接入设备自动走代理
- 无需手动设置 HTTP 或 SOCKS 代理

## 网络拓扑设计

整体网络结构如下:

```text
           Internet
               ↑
          主路由（WiFi）
               ↑
            Mac（旁路由）
       Surge 5 + TUN 模式
               ↑
         Mac WiFi 热点
               ↑
     手机 / 平板 / 其他设备
````

数据流路径如下:

```text
客户端设备 → Mac 热点 → Surge TUN → 分流规则 → 主路由 → Internet
```

该结构中，Mac 负责代理与流量控制，主路由仅负责基础网络连接。

## 核心功能说明

### Surge TUN 模式

Surge 的 TUN 模式用于接管系统流量，实现透明代理。该模式可以自动处理 TCP 和部分 UDP 流量。

启用后，所有通过 Mac 的流量都会进入 Surge 规则引擎。

### 互联网共享

macOS 提供"互联网共享"功能，用于创建 WiFi 热点。其他设备连接该热点后，流量会经过 Mac 转发。

### IP 转发

IP 转发允许 Mac 在不同网络接口之间转发数据包，是旁路由运行的必要条件。

## 实现步骤

### 开启 IP 转发

执行以下命令开启 IP 转发:

```bash
sudo sysctl -w net.inet.ip.forwarding=1
```

如果需要永久生效，可以写入配置文件:

```bash
sudo nano /etc/sysctl.conf
```

添加以下内容:

```conf
net.inet.ip.forwarding=1
```

### 配置 Surge 5

在 Surge 中启用 TUN 模式。配置示例如下:

```ini
[General]
tun = auto
```

确认以下功能已开启:

* Allow LAN
* Enhanced Mode (建议使用 fake-ip)
* 自动路由

Surge 将自动接管流量，并根据规则进行分流。

### 开启 Mac WiFi 热点

进入系统设置，开启互联网共享:

```text
系统设置 → 通用 → 共享 → 互联网共享
```

配置如下:

* 共享来源: 当前连接的 WiFi 网络
* 共享到: WiFi

设置完成后，Mac 会创建一个新的 WiFi 热点。

### 连接客户端设备

将手机、平板或其他设备连接到 Mac 创建的 WiFi 热点。

连接成功后:

* 所有流量自动经过 Mac
* Surge 根据规则进行分流
* 无需额外代理配置

## DNS 配置建议

建议在 Surge 中启用增强 DNS 模式，以避免 DNS 污染问题。

示例配置:

```ini
[DNS]
enhanced-mode = fake-ip
```

该模式可以提高分流准确性，并减少解析异常。

## 验证与排查

完成配置后，可以通过以下方式验证:

* 打开境外网站，确认是否正常访问
* 使用 `curl ifconfig.me` 查看出口 IP
* 检查 Surge 日志，确认流量命中规则

如果出现问题，可以检查以下内容:

* IP 转发是否开启
* Surge TUN 是否生效
* 热点设备是否连接正确
* DNS 是否配置正常

## 注意事项

* Mac 休眠会导致网络中断，建议关闭自动休眠
* WiFi 热点稳定性有限，不适合大量设备长期使用
* Surge 需要持续运行，否则代理失效

## 进阶优化方向

如果需要更高稳定性或更复杂功能，可以考虑以下优化:

* 使用规则集实现精细分流
* 接入外部 DNS 服务（如 DoH 或 DoT）
* 使用独立设备运行 OpenWRT 作为旁路由
* 将 Surge 配置纳入版本控制系统

## 总结

本文介绍了一种基于 macOS 和 Surge 5 的旁路由方案。该方案实现简单，适合开发者快速搭建代理环境。

通过 TUN 模式、IP 转发和互联网共享的组合，可以实现接近软路由的效果。
