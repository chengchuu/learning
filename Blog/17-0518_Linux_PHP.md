# Linux 安装 PHP

Linux 安装 PHP 需先安装 Vim，再下载 php-7.1.5.tar.gz 并解压；安装依赖 libxml2 及 devel，切换到 PHP 目录，通过 ./configure 生成 Makefile，编译后安装。最后创建 test.php 并运行 phpinfo () 验证。

- [Linux 安装 PHP](#linux-安装-php)
  - [安装 Vim](#安装-vim)
  - [下载 PHP](#下载-php)
  - [解压 PHP 文件](#解压-php-文件)
  - [安装 libxm12](#安装-libxm12)
  - [切到 PHP 文件目录下](#切到-php-文件目录下)
  - [生成 Makefile](#生成-makefile)
  - [编译](#编译)
  - [切到用户目录](#切到用户目录)
  - [安装](#安装)
  - [测试 PHP](#测试-php)

## 安装 Vim

```bash
# 使用 vi 则忽略这一步
sudo yum install vim
```

## 下载 PHP

```bash
wget http://cn2.php.net/get/php-7.1.5.tar.gz/from/this/mirror
```

## 解压 PHP 文件

```bash
tar -zxvf mirror
```

## 安装 libxm12

```bash
yum install gcc gcc++ libxm12-devel（不加下面两步或出现错误：xml2-config not found.）

yum install libxml2

yum install libxml2-devel -y
```

## 切到 PHP 文件目录下

```bash
cd php-7.1.5
```

## 生成 Makefile

```bash
./configure --prefix=/usr/local/php7-mazey --enable-fpm（生成Makefile供编译安装）
```

## 编译

```bash
make
```

## 切到用户目录

```bash
cd ~
```

## 安装

```bash
# 这一步需要 root 权限
sudo make install
```

## 测试 PHP

```bash
vim test.php

vim => phpinfo();（vim里面编辑测试语句，若出现下图则安装成功）

/usr/local/php7-mazey/bin/php test.php
```

![PHP](http://blog.mazey.net/wp-content/uploads/2021/12/1495037741119890.png)

**更新记录**

本文首次编辑于 2017-05-18，最近更新于 2025-11-25。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <http://blog.mazey.net/250.html>

(完)
