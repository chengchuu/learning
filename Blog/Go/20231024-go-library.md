# Go 实战: 创建、测试并发布自己的库

![从零起步创建、测试并发布自己的库](http://blog.mazey.net/wp-content/uploads/2023/10/Go_Lib_20251204_s7x3_v01.jpg)

本文介绍 Go 包的结构、库的复用价值，并以 Asiatz 为示例演示创建目录、初始化模块、实现时区转换、编写测试、撰写文档、管理版本和在项目中集成的流程，帮助读者掌握从构建到发布的完整实践。

- [前言: 为什么需要开发自己的 Go 库](#前言-为什么需要开发自己的-go-库)
- [第 1 步: 创建目录](#第-1-步-创建目录)
- [第 2 步: 初始化项目](#第-2-步-初始化项目)
  - [2.1 初始化 Go 模块](#21-初始化-go-模块)
  - [2.2 创建文件](#22-创建文件)
- [第 3 步: 编写测试](#第-3-步-编写测试)
- [第 4 步: 编写文档](#第-4-步-编写文档)
- [第 5 步: 发布](#第-5-步-发布)
  - [5.1 上传](#51-上传)
  - [5.2 版本控制](#52-版本控制)
- [第 6 步: 在真实项目中使用](#第-6-步-在真实项目中使用)
- [总结](#总结)

## 前言: 为什么需要开发自己的 Go 库

在编程语言中，包 (Package) 和库 (Library) 是代码组织和复用的重要工具。在 Go 中，包是代码的基本组织单位，每个 Go 程序都由包构成。包的作用是帮助组织代码，提供封装和代码复用的机制。

Go 包可以包含函数、类型、变量和常量等，这些元素可以被其他包引用和使用。例如，Go 的标准库提供了大量的包，如 [`net/http`](https://pkg.go.dev/net/http) 包提供了 HTTP 客户端和服务器实现，[`fmt`](https://pkg.go.dev/fmt) 包提供了[格式化](http://blog.mazey.net/3558.html)、I/O 函数等。

而库是一种特殊的包，不包含 `main` 函数，不能被直接运行，但可以被其他程序引用。库通常包含一些常用的功能或算法，如字符串处理、数学计算、网络通信等。

开发自己的 Go 库的优点:

1. 复用性: 当在多个项目中需要使用相同的功能时，可以将这些功能封装在一个库中，然后在需要的地方引用他。这样可以避免重复编写相同的代码，提高编程效率。
2. 可维护性: 当需要修改某个功能时，只需修改对应的库，而不需要在多个地方进行修改，这样可以使代码更易于理解和维护。
3. 可测试性: 为每个库编写单元测试，确保他们的功能正确。修改代码时，可以运行这些测试来检查是否引入了新的错误。

---

接下来，将以 Asiatz ([github.com/chengchuu/asiatz](https://github.com/chengchuu/asiatz)) 为例，详细演示如何创建一个规范的 Go 库。

Asiatz 主要功能是进行时区转换，特别是对亚洲时区的处理，他能够将各种时区转换为 UTC 时间。

```go
utcTime, err := asiatz.ShanghaiToUTC("08:00")
if err != nil {
    // handle error
}
fmt.Println(utcTime) // Output: 00:00
```

## 第 1 步: 创建目录

在本地创建一个新的目录，名为 `asiatz`。这个目录将包含所有的源代码、测试和文档文件。

```shell
mkdir asiatz
cd asiatz
```

## 第 2 步: 初始化项目

### 2\.1 初始化 Go 模块

在 `asiatz` 目录下，运行 `go mod init <domain>/<username>/<module-name>` 来初始化 Go 模块。

```shell
go mod init github.com/chengchuu/asiatz
```

项目结构:

```plain
asiatz
└── go.mod
```

### 2\.2 创建文件

创建一个新的 Go 文件，名为 `asiatz.go`。在此文件中，定义一个名为 `asiatz` 的包，并编写相对应的功能函数。

项目结构:

```plain
asiatz
├── asiatz.go
└── go.mod
```

代码示例:

```go
package asiatz

import (
    "fmt"
    "strconv"
)

// ToUTC converts a time string (HH:mm) from a specified timezone to UTC time string (HH:mm).
func ToUTC(timezoneOffset float64, time string) (string, error) {
    hour, err := strconv.Atoi(time[:2])
    if err != nil {
        return "", err
    }
    minute, err := strconv.Atoi(time[3:])
    if err != nil {
        return "", err
    }
    totalMinutes := hour*60 + minute
    utcTotalMinutes := ((totalMinutes-int(timezoneOffset*60))%1440 + 1440) % 1440
    utcHour := utcTotalMinutes / 60
    utcMinute := utcTotalMinutes % 60
    utcTime := fmt.Sprintf("%02d:%02d", utcHour, utcMinute)
    return utcTime, nil
}

// ShanghaiToUTC converts a Shanghai time string (HH:mm) to UTC time string (HH:mm).
// For example, "08:00" in Shanghai is equivalent to "00:00" in UTC.
func ShanghaiToUTC(shanghaiTime string) (string, error) {
    return ToUTC(8, shanghaiTime)
}
```

## 第 3 步: 编写测试

Go 提供了内置的测试框架，可以方便地编写和运行测试用例，以确保代码的正确性和稳定性。

在 `asiatz` 目录下创建一个新的 Go 文件，名为 `asiatz_test.go`。在这个文件中编写测试用例来测试 `asiatz.go` 中的函数。

项目结构:

```plain
asiatz
├── asiatz.go
├── asiatz_test.go
└── go.mod
```

代码示例:

```go
package asiatz

import "testing"

type testConversion struct {
    time     string
    expected string
}

var tests = map[string][]testConversion{
    "Shanghai": {
        {"01:00", "17:00"},
        {"23:59", "15:59"},
    },
    // Others
}

func runConversionTests(t *testing.T, tests []testConversion, conversionFunc func(string) (string, error)) {
    for _, test := range tests {
        actual, err := conversionFunc(test.time)
        if err != nil {
            t.Errorf("Unexpected error for %s: %v", test.time, err)
            continue
        }
        if actual != test.expected {
            t.Errorf("Expected %s for %s but got %s", test.expected, test.time, actual)
        }
    }
}

func TestAllConversions(t *testing.T) {
    for timezone, tests := range tests {
        t.Run(timezone, func(t *testing.T) {
            switch timezone {
            case "Shanghai":
                runConversionTests(t, tests, ShanghaiToUTC)
            // Others
            default:
                t.Errorf("Unexpected timezone %s", timezone)
            }
        })
    }
}
```

查看完整的用例可见: [github.com/chengchuu/asiatz/blob/main/asiatz_test.go](https://github.com/chengchuu/asiatz/blob/main/asiatz_test.go)

在当前目录下运行 `go test` 查看结果:

```plain
PASS
ok      github.com/chengchuu/asiatz     0.449s
```

## 第 4 步: 编写文档

为了方便其他人理解和使用 Asiatz 库，需要编写相应的使用文档。文档应包括库的目的、功能函数的用法、使用示例和注意事项等。

在 `asiatz` 目录下，创建一个新的 `README.md` 文件，并在其中编写文档。

项目结构:

```plain
asiatz
├── asiatz.go
├── asiatz_test.go
├── go.mod
└── README.md
```

文档示例:

![文档示例](http://blog.mazey.net/wp-content/uploads/2023/10/asiatz_rm_2023-10-22_21-58-v2.png)

## 第 5 步: 发布

### 5\.1 上传

![上传到 GitHub](http://blog.mazey.net/wp-content/uploads/2023/10/github_create_2023-10-22_22-15-v2.png)

将 Asiatz 库上传到 GitHub 或其他代码托管平台，使其他人可以方便地获取和使用。

```shell
go get github.com/chengchuu/asiatz
```

### 5\.2 版本控制

![标签](http://blog.mazey.net/wp-content/uploads/2023/10/tags_2023-10-22_22-17.png)

在 Git 仓库上，还可以使用标签来管理库的不同版本。

```shell
git tag v1.0.0
git push origin v1.0.0
```

例如 Asiatz 目前有四个版本: `v1.0.0`、`v1.1.0`、`v1.1.1`、`v1.1.2`，分别可以用以下命令获取:

```shell
go get github.com/chengchuu/asiatz@v1.0.0
go get github.com/chengchuu/asiatz@v1.1.0
go get github.com/chengchuu/asiatz@v1.1.1
go get github.com/chengchuu/asiatz@v1.1.2
```

## 第 6 步: 在真实项目中使用

以 Go 项目 [github.com/chengchuu/go-gin-gee](https://github.com/chengchuu/go-gin-gee) 为例，首先在项目目录 (`go-gin-gee`) 下运行命令 `go get github.com/chengchuu/asiatz` 获取 Asiatz 库，然后引入使用即可:

```go
// https://github.com/chengchuu/go-gin-gee/blob/main/internal/api/controllers/schedules-controller.go
package controllers

import (
    "log"
    "github.com/chengchuu/asiatz"
)

func Check() {
    // ...
    utcTime, err := asiatz.ShanghaiToUTC("10:00")
    if err != nil {
        // handle error
    }
    log.Println("UTC Time:", utcTime) // Output: 02:00
    // ...
}
```

## 总结

本文以 Asiatz 库为例，详细演示了如何从零开始创建、测试并发布自己的 Go 库。无论是新手，还是有经验的开发者；动手实践，开发并发布自己的库，不仅可以提高代码的复用性和维护性，提高自己的技能，还可以为社区做出贡献。

**更新记录**

本文首次编辑于 2023-10-24，最近更新于 2025-12-04。

**版权声明**

本文为原创文章，作者保留版权。转载请保留本文完整内容，并以超链接形式注明作者及原文出处。

作者: [除除](https://github.com/chengchuu)
原文: <https://blog.mazey.net/4150.html>

(完)
