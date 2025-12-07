# GitHub/Gitee 等托管平台添加 SSH Key

![Git 添加 SSH Key](http://blog.mazey.net/wp-content/uploads/2025/09/Git_SF_7x3.jpg)

本文介绍了生成和添加 SSH Key 的步骤。首先，通过 ssh-keygen 命令生成 SSH Key。然后，进入 .ssh 目录，使用 cat id_rsa.pub 查看并复制公钥，最后将其添加到所需平台。

- [GitHub/Gitee 等托管平台添加 SSH Key](#githubgitee-等托管平台添加-ssh-key)
  - [生成 SSH Key](#生成-ssh-key)
  - [添加到平台](#添加到平台)

## 生成 SSH Key

平台兼容 RSA:

```bash
# check
cd ~
ls -a

# generate
ssh-keygen -t rsa -C "name@example.com"
```

2025 年主流 Ed25519:

```bash
ssh-keygen -t ed25519 -C "name@example.com"
```

## 添加到平台

```bash
# find and copy
cd ~/.ssh
cat id_rsa.pub
```

![添加到平台](http://blog.mazey.net/wp-content/uploads/2022/02/sshkey-add-600x283-1.jpg)

**更新记录**

本文首次编辑于 2021-02-25，最近更新于 2025-12-07。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/2628.html>

(完)
