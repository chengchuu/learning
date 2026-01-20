## 一、背景

使用前端 UI 框架（例如：Bootstrap、Mustard UI）的时候，虽然我们可以直接修改源码里面的 CSS 样式，但是修改起来非常麻烦低效；好在大多数框架是基于当下流行的 CSS 预处理脚本 Less 和 Sass 编译开发的，通过修改官方给出的 Sass 源码，我们可以很方便的定制它们。

## 二、什么是 Sass

世界上最成熟、最稳定、最强大的专业级 CSS 扩展语言！

![什么是 Sass](http://blog.mazey.net/wp-content/uploads/2021/02/scss-bd-w-800.jpg)

Sass 可以让开发者像使用编程语言一样编程 CSS，比如它拥有变量，函数等特性。

### 什么是 Scss

Sass 有两种语法，一种是 Sass 语法，是一种古老的语法，采用缩进而非花括号的方式来完成嵌套规则；另一种是 Scss 语法，它更接近于 CSS 的语法规则，采用花括号的嵌套规则，一般来说，CSS 文件只要把文件后缀换成 Scss 便可以无缝转换成 Scss 语法的文件，而 Sass 语法规则的却不行。本文所用到的均是 Scss 语法规则。

## 三、安装 Sass

### 3.1 安装 Ruby

因为 Sass 是用 Ruby 写的，使用的时候依赖于 Ruby，所以必须先去官网下载安装下 Ruby。

![根据自己的电脑选择相应的配置下载](http://blog.mazey.net/wp-content/uploads/2021/02/install-ruby-w-800.jpg)

如果因为某些原因不能正常下载的话可以找找[国内的镜像站](http://www.ruby-lang.org/zh_cn/downloads/)下载。

![可以在页面底部找到镜像站入口](http://blog.mazey.net/wp-content/uploads/2021/02/entre-w-800.jpg)

安装的时候记得勾选添加至环境变量（ **Add Ruby executables to your PATH** ）这个选项，不然使用时会报找不到命令这样的错误。

安装完后命令行敲 `ruby -v` 查看有版本信息，有的话即是安装成功。

![ruby -v](http://blog.mazey.net/wp-content/uploads/2021/02/cmd-0215.jpg)

### 3.2 安装 Sass

安装 Ruby 的时候会自动安装一个库管理工具 gem。

![gem](http://blog.mazey.net/wp-content/uploads/2021/02/cmd-1112.jpg)

接着在命令行输入 `gem install sass` 便可以安装 Sass 了，一样的安装完 `sass -v` 查看是否安装成功。

![sass -v](http://blog.mazey.net/wp-content/uploads/2021/02/cmd-1113.jpg)

若实在墙的厉害，可以试试本地安装 Sass。

## 四、编译 Scss 到 CSS

### 4.1 编译单个 Scss

```
// 切到scss文件目录下
cd /d/scss-study/
  
// 运行scss编译scss
scss test-input.scss test-output.css
  
// test-input.scss
$color-white: #fff;

body{
  &>p{
    &:hover{
      color: $color-white;
    }
  }
}

// test-output.css
body > p:hover {
  color: #fff; }
```

### 4.2 监控单个文件

单个文件内（包括使用 `@import` 导入的文件）任何变化都会触发编译。

```
scss --watch test-input.scss:test-output.css
```

命令行效果图：

![scss --watch](http://blog.mazey.net/wp-content/uploads/2021/02/cmd-1122.jpg)

### 4.3 监控整个文件夹

整个文件夹内所有文件发生变化都会触发编译。

```
scss --watch /d/scss-study/
```

## 五、基础语法

### 5.1 变量

Scss 变量用 `$` 符号来标识 `$some-variate: #fff`，不同于 Less 用 `@some-variate: #fff`，也区别于 CSS 的变量 `--some-variate: #fff`。引用变量 `color: $some-variate`。

```
// scss
$some-variate: #fff;
h1{
  color: $some-variate;
}

// css
h1 {
  color: #fff; }
```

### 5.2 嵌套规则

在平常 CSS 中我们需要重复写父级选择器，复杂低效又不好记，Scss 可以通过在一个父级样式花括号 `{}` 中嵌套子级样式来书写样式。

```
// scss
.parent{
  background: #f5f5f5;
  .girl{
    color: #fff;
  }
  .son{
    color: #000;
  }
  p{
    font-size: 14px;
  }
}

// css
.parent {
  background: #f5f5f5; }
  .parent .girl {
    color: #fff; }
  .parent .son {
    color: #000; }
  .parent p {
    font-size: 14px; }
```

#### 5.2.1 父级选择器的标识符 &

有时候需要使用伪元素（`:hover :first-child`）时普通的嵌套规则就满足不了需求了，这时就需要用到父级选择器标识符 `&`，简单来说在 `.parent{}` 内使用 `&`; 时，`&` 就相当于 `.parent`，即 `&:hover` 相当于 `.parent:hover`，`&:first-child` 相当于 `.parent:first-child`，`&>p` 相当于 `.parent>p`。

```
// scss
$color-white: #fff;
.parent{
  &:hover{
    background: #f5f5f5;
  }
  &>p.girl{
    color: $color-white;
  }
  .son{
    color: #000;
  }
  &>p:nth-child(2n + 1){
    font-size: 14px;
  }
}

// css
.parent:hover {
  background: #f5f5f5; }
.parent > p.girl {
  color: #fff; }
.parent .son {
  color: #000; }
.parent > p:nth-child(2n + 1) {
  font-size: 14px; }
```
#### 5.2.2 嵌套属性

Scss 中在写边框 `border-*` 和字体 `font-*` 属性的时候利用嵌套规则只需要利用冒号 `:` 书写一遍前缀即可，但是要把中间的连接线 `-` 去掉。

```
// scss
body{
  font:{
    family: Arial;
    size: 12px;
  }
}

// css
body {
  font-family: Arial;
  font-size: 12px; }
```

### 5.3 文件导入

在别的编程语言中常常可以使用 `include` 或 `require` 来导入文件，这使得开发者可以模块化管理文件。Scss 中使用 `@import` 导入其它 Scss 文件，这样便可以把变量或其它单独放在一个文件中方便管理。

```
├── index.scss
└── variate.scss
    
// index.scss
@import "variate.scss";

body{
  p{
    color: $color-white;
  }
}

// variate.scss
$color-white: #fff;

// index.css
body p {
  color: #fff; }
```

### 5.4 注释

写出来的代码除了项目用之外，最主要的还是要给别人（维护）看，当别人看着你密密麻麻代码却没有一行注释时是怎样的一种心情 :D。Scss 提供两种注释风格，一种和 CSS 一样的标准注释风格 `/*...*/`，这种注释编译成 CSS 时会出现在生成的 CSS 文件中。另一种是和 JavaScript 一样的双斜杠注释法 `//`，这种注释不会出现在生成的 CSS 文件中。

```
// scss
body{
  // 段落 - 我会消失
  p{
    color: #fff;
  }
  /* 链接 - 我会出现 */
  a{
    color: #000;
  }
}

// css
body {
  /* 链接 - 我会出现 */ }
  body p {
    color: #fff; }
  body a {
    color: #000; }
```
