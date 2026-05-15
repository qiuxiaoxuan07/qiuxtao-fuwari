---
title: iptables 端口转发教程
published: 2025-10-28
description: 使用 iptables 配置公网服务器端口转发到内网主机
tags:
  - iptables
  - Linux
  - 网络
category: 教程
draft: false
---
## 场景示例

- **描述：** 我们有一台公网 Linux 服务器（`11.11.11.11`），我们想通过访问它的 `3389` 端口，来安全地访问一台处于内网的 Windows RDP 主机（`172.16.0.19`）。
- **拓扑图：** `你 (Windows 客户端)` -> `公网 (11.11.11.11)` -> `内网 (172.16.0.19)`

## 准备工作：定义变量和环境

为了让脚本清晰易懂，我们先定义变量。

```bash
# 公网服务器要监听的端口
LOCAL_PORT=3389
# 真正提供服务的目标内网IP
TARGET_IP=172.16.0.19
# 目标内网IP的服务端口
TARGET_PORT=3389
```

## 步骤一：开启 Linux 内核转发

这是最基础的一步。如果内核不允许IP转发，`iptables` 的所有努力都白费。

```bash
# 1. 临时开启
sudo sysctl -w net.ipv4.ip_forward=1

# 2. 检查是否成功
cat /proc/sys/net/ipv4/ip_forward
# (确保返回 1)

# 3. 永久开启（推荐）
# sudo nano /etc/sysctl.conf
# 找到 net.ipv4.ip_forward=1 并取消注释
# 然后执行 sudo sysctl -p 使其生效
```

## 步骤二：配置 NAT 表

这是大多数教程都会讲的部分。我们需要两条规则：

1. **PREROUTING (DNAT):** 把“进来”的包，目标地址换成内网 RDP 主机。
2. **POSTROUTING (SNAT/MASQUERADE):** 把“出去”的包，源地址换成 Linux 服务器。**（关键：否则 RDP 主机会直接回复给你的客户端，而不是回复给 Linux 服务器）**

```bash
# 1. PREROUTING 规则 (DNAT)：修改目标地址
sudo iptables -t nat -A PREROUTING -p tcp --dport $LOCAL_PORT -j DNAT --to-destination $TARGET_IP:$TARGET_PORT

# 2. POSTROUTING 规则 (MASQUERADE)：修改源地址
sudo iptables -t nat -A POSTROUTING -d $TARGET_IP -p tcp --dport $TARGET_PORT -j MASQUERADE
```

## 步骤三：配置 filter 表（防火墙放行）

这是**教程的核心**。`nat` 表只负责翻译地址，但**不负责放行**。真正决定包能否通过的是 `filter` 表的 `FORWARD` 链。

```bash
# 注意：我们用 -I (Insert) 把规则插入到链的顶部，确保它们在 Docker 等规则之前被匹配。

# 1. 允许“已建立”和“相关”的连接（允许 RDP 的“返回”流量）
sudo iptables -I FORWARD 1 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

# 2. 允许“新”的连接（允许你客户端的“发起”流量）
sudo iptables -I FORWARD 2 -d $TARGET_IP -p tcp --dport $TARGET_PORT -j ACCEPT
```

## 步骤四：持久化规则

`iptables` 规则默认重启失效。

- **Debian/Ubuntu:**
  ```bash
  sudo apt-get install iptables-persistent
  sudo netfilter-persistent save
  ```

- **CentOS/RHEL (旧版):**
  ```bash
  service iptables save
  # 或
  iptables-save > /etc/sysconfig/iptables
  ```

## 如何重置 netfilter-persistent 保存的内容

### 步骤 1：清空当前内存中的所有规则

```bash
# 1. 清空 filter 表 (INPUT, OUTPUT, FORWARD)
sudo iptables -F
sudo iptables -X

# 2. 清空 nat 表 (PREROUTING, POSTROUTING)
sudo iptables -t nat -F
sudo iptables -t nat -X

# 3. 清空 mangle 表 (可选，以防万一)
sudo iptables -t mangle -F
sudo iptables -t mangle -X

# 4. (重要) 把默认策略改回 ACCEPT，防止SSH断开
sudo iptables -P INPUT ACCEPT
sudo iptables -P FORWARD ACCEPT
sudo iptables -P OUTPUT ACCEPT
```

### 步骤 2：保存这个“空”的状态

```bash
# 这会用“空规则”覆盖掉你之前保存的RDP转发规则
sudo netfilter-persistent save
```