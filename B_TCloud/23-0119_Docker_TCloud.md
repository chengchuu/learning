# Docker 解决 `denied: requested access to the resource is denied`

![Docker](http://blog.mazey.net/wp-content/uploads/2023/01/Docker_SF_7x3.jpg)

**内容声明**

本文仅用于技术分享和学习交流，内容不包含任何广告、推广、引流、付费课程或外链信息。所有示例和配置均为技术实践，欢迎参考和自定义。

---

在将镜像推送到 DockerHub 时若出现 denied 错误，可通过创建对应仓库、重新登录 docker.io、为镜像正确打 Tag 后再执行 docker push 解决。流程涵盖账号登录、仓库名称匹配与镜像重命名，可确保顺利上传并用于部署或共享。

- [Docker 解决 `denied: requested access to the resource is denied`](#docker-解决-denied-requested-access-to-the-resource-is-denied)
  - [背景](#背景)
  - [解决方案](#解决方案)
  - [案例](#案例)

## 背景

在频繁进行服务器迁移的过程中，为了方便部署和共享，简单的 Shell 脚本已经不能满足需求了，于是将所有的项目 Docker 化。

部分不含敏感配置的项目准备放到 [DockerHub](https://hub.docker.com/) 上面，但是在 `docker push` 的时候报错:

```plain
denied: requested access to the resource is denied
```

## 解决方案

登录 [DockerHub](https://hub.docker.com/) 创建相对应的项目名。

![Docker Hub Create Repository](http://blog.mazey.net/wp-content/uploads/2023/01/docker-hub-create-repository-e1674116826946.png)

如果在 Docker Desktop 手动登录过了，需要先命令行退出登录:

```bash
login out
```

重新在命令行登录:

```bash
docker login -u "Name" -p "Password" docker.io
```

登录成功后会提示 `Login Succeeded`。

对要上传的镜像打 Tag:

```bash
docker tag Your_Repository/Subname:Tagname Docker_Hub_User_Name/Your_Repository:Tagname
```

上传:

```bash
docker push Docker_Hub_User_Name/Your_Repository:Tagname
```

成功后提示:

```plain
The push refers to repository [docker.io/docker-hub-user-name/your-repository]
fbb8711b1824: Pushed 
b686d86b3388: Pushed 
4700545bfd00: Pushed 
ac24d93be4ae: Pushed 
1b5df2fde28f: Pushed 
8964dbe7aa60: Pushed 
8e012198eea1: Pushed 
tagname: digest: sha256:965d123457f12345dca0d109a8f720de174139aaf25376a56de76caf1234572b size: 1790
```

**注意**

以上步骤参考了 DOCKER COMMUNITY FORUMS [1] 和 Stack Overflow [2] 的帖子，部分步骤可能是冗余的。

## 案例

GitHub: <https://github.com/chengchuu/go-gin-gee>

DockerHub: [docker/mazeyqian/go-gin-gee](https://hub.docker.com/repository/docker/mazeyqian/go-gin-gee/general)

命令行:

```bash
docker logout

docker login -u "mazeyqian" -p "Password" docker.io

docker images

docker tag go-gin-gee/api:v12413 mazeyqian/go-gin-gee:v202301211427

docker push mazeyqian/go-gin-gee:v202301211427
```

**参考**

1. [Docker push - Error - requested access to the resource is denied](https://forums.docker.com/t/docker-push-error-requested-access-to-the-resource-is-denied/64468)
2. [denied: requested access to the resource is denied: docker](https://stackoverflow.com/questions/41984399/denied-requested-access-to-the-resource-is-denied-docker)

**更新记录**

本文首次编辑于 2023-01-19，最近更新于 2025-11-28。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/2980.html>

(完)
