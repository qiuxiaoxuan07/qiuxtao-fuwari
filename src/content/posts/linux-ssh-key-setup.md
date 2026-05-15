---
title: Linux 设置 SSH 密钥登录
published: 2026-05-15
description: 记录在 Linux 中生成 SSH 密钥、配置公钥登录、调整权限并关闭密码登录的常用步骤
tags:
  - Linux
  - SSH
  - 密钥
category: 笔记
draft: false
---
## 前言

SSH 密钥登录比密码登录更适合长期管理服务器：本地保存私钥，服务器只保存公钥。只要私钥不泄露，就不需要把密码暴露在每次登录过程中。

这篇笔记记录从生成密钥、上传公钥、验证登录，到关闭密码登录的完整流程。

## 生成 SSH 密钥

在本地电脑执行：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

一路回车会生成默认密钥文件：

```bash
~/.ssh/id_ed25519
~/.ssh/id_ed25519.pub
```

其中 `id_ed25519` 是私钥；`id_ed25519.pub` 是公钥。将他们都下载到本地，并删除服务器上的文件。

## 配置 authorized_keys

编辑公钥文件：

```bash
nano ~/.ssh/authorized_keys
```

把本地 `id_ed25519.pub` 的内容粘贴进去，保存后设置权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

权限不正确时，SSH 服务可能会拒绝使用密钥登录。

## 使用密钥登录

在本地测试：

```bash
ssh -i ~/.ssh/id_ed25519 用户名@服务器IP
```

如果使用的是默认密钥文件，通常可以直接登录：

```bash
ssh 用户名@服务器IP
```

## 关闭密码登录

确认密钥登录成功后，再关闭密码登录。建议先保留一个已经登录的 SSH 窗口，避免配置错误导致无法重新连接。

编辑 SSH 服务端配置：

```bash
sudo nano /etc/ssh/sshd_config
```

确认或添加以下配置：

```text
PubkeyAuthentication yes
PasswordAuthentication no
```

保存后先检查配置是否正确：

```bash
sudo sshd -t
```

没有输出表示配置语法正常，然后重新加载 SSH 服务：

```bash
sudo systemctl reload sshd
```