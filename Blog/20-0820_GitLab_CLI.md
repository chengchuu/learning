# 使用 GitLab CI/CD 和阿里云 CLI 自动部署前端项目

![使用 GitLab CI/CD 和阿里云 CLI 自动部署前端项目](http://blog.mazey.net/wp-content/uploads/2025/09/Git_SF_7x3.jpg)

本文介绍了 CI/CD 的概念及其在 GitLab 中的实现，通过 .gitlab-ci.yml 配置文件定义镜像、阶段和执行条件，实现自动化构建、打包和部署。详细说明了 CLI 的用途及使用方法，包括配置 OSS 参数和执行发布命令，支持多环境发布并与 CI/CD 流程集成，提升开发和部署效率。

- [使用 GitLab CI/CD 和阿里云 CLI 自动部署前端项目](#使用-gitlab-cicd-和阿里云-cli-自动部署前端项目)
  - [一、什么是 CI/CD？](#一什么是-cicd)
    - [在 GitLab 中部署 CI/CD](#在-gitlab-中部署-cicd)
  - [二、什么是 CLI](#二什么是-cli)
    - [使用 aliyunoss-cli 自动上传阿里云 OSS](#使用-aliyunoss-cli-自动上传阿里云-oss)

## 一、什么是 CI/CD？

- CI (持续交付) 是功能迭代后自动构建、打包、校验代码格式、跑单测、单测覆盖率，常见的就是 webpack、Rollup、ESLint 等。
- CD (持续部署) 是经过 CI 后，代码自动部署到服务器。

### 在 GitLab 中部署 CI/CD

[GitLab](https://docs.gitlab.com/ee/README.html) CI/CD 通 [`.gitlab-ci.yml`](https://docs.gitlab.com/ee/ci/yaml/README.html) 配置文件来部署。

```bash
cd project_path

touch .gitlab-ci.yml
```

创建一个简单的 CI/CD 配置:

```plain
# 指定使用的镜像
image: node:latest

# 执行步骤，依次执行
stages:
  - install
  - build
  - deploy

# 安装依赖 job 下面的 stage 字段和 stages 下面的步骤一一对应
install-job:
  stage: install
  only: # 限定执行脚本的条件，only 支持 branch、tag、change、正则
    - master
    - develop
    - master
  script: # 此 stage 要执行的脚本
    -  npm i

# 打包
build-job:
  stage: build
  only:
    - master
    - develop
    - master
  script:
    -  npm run build

# 上传到服务器
deploy-job:
  stage: deploy
  only:
    - master
    - develop
    - master
  script:  
    -  npm run deploy
```

`.gitlab-ci.yml` 常用配置:


| 配置 | 说明 |
| --- | --- |
| image | 镜像 |
| jobs | 如上所示: `install-job`、`build-job` 便是 jobs，是 `.gitlab-ci.yml` 最基本的元素。 |
| stages | 用来组合 jobs 按步骤工作，jobs 下面对应的 stage 和 stages 的子集对应。 |
| only | 指定 jobs 的执行场景，相对应的是 except。 |

## 二、什么是 CLI

CLI (命令行界面) 和 CI 类似，都是解决重复劳动，例如用来初始化项目的 Vue-Cli、Create-React-App 和上传静态资源到阿里云的 [aliyunoss-cli](https://github.com/chengchuu/aliyunoss-cli)。

### 使用 aliyunoss-cli 自动上传阿里云 OSS

下载安装 CLI:

```bash
npm install aliyunoss-cli --save-dev

npx aliyunoss-cli --version
```

创建配置文件 `alioss.config.json`:

```json
{
  "region": "-",
  "accessKeyId": "-",
  "accessKeySecret": "-",
  "bucket": "-"
}
```

在配置文件中添加各环境对应 OSS 路径:

```json
{
  "region": "-",
  "accessKeyId": "-",
  "accessKeySecret": "-",
  "bucket": "-",
  "releaseEnvConf": {
    "dev": {
      "source": "dist/",
      "target": "home/dev/"
    },
    "pre": {
      "source": "dist/",
      "target": "home/pre/"
    },
    "prd": {
      "source": "dist/",
      "target": "home/prd/"
    }
  }
}
```

发布命令:

```bash
# 测试
npx aliyunoss-cli --releaseEnv dev
# 预发布
npx aliyunoss-cli --releaseEnv pre
# 生产
npx aliyunoss-cli --releaseEnv prd
```

直接使用命令行拼接参数指定路径:

```bash
# 测试
npx aliyunoss-cli --source dist/ --target home/dev/
```

配合 `.gitlab-ci.yml` 添加 `script` 命令行:

```plain
"deploy": "aliyunoss-cli --releaseEnv dev",
"publish": "npm i && npm run build && npm run deploy"
```

**更新记录**

本文首次编辑于 2020-08-20，最近更新于 2025-11-03。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/1695.html>

(完)
