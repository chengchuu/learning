# 解决 Git Access Token Error: `remote: You must use a personal access token ...`

![Git](http://blog.mazey.net/wp-content/uploads/2025/09/Git_SF_7x3.jpg)

本文介绍远程使用 Git 进行 HTTP 克隆时，如遇 Access Token 认证失败，可通过生成具备 api 权限的 Personal Access Token 来完成访问。创建 Token 后，可使用命令行方式直接克隆。

- [解决 Git Access Token Error: `remote: You must use a personal access token ...`](#解决-git-access-token-error-remote-you-must-use-a-personal-access-token-)
  - [背景](#背景)
  - [解决方案](#解决方案)

## 背景

在家远程办公的时候执行 `git clone` 出现以下报错:

```plain
remote: HTTP Basic: Access denied
remote: You must use a personal access token with 'api' scope for Git over HTTP.
```

![Access denied](http://blog.mazey.net/wp-content/uploads/2023/05/646ce21651691.png)

这个错误表明: 基于 HTTP Basic Authentication 的传统用户名/密码认证方式已被弃用或禁用。

## 解决方案

通过其提示的地址生成一个 Token:

```plain
remote: You can generate one at https://example.com/profile/personal_access_tokens
```

![Generate](http://blog.mazey.net/wp-content/uploads/2023/05/646ce2b1acaa9.png)

然后通过命令行组合 Token 操作即可:

```bash
git clone https://oauth2:${PERSONAL_ACCESS_TOKEN}@example.com/example/example.git
```

![Git](http://blog.mazey.net/wp-content/uploads/2023/05/646ce38a270db.png)

**更新记录**

本文首次编辑于 2023-05-29，最近更新于 2025-12-07。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/3488.html>

(完)
