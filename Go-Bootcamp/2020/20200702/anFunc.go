package main

import (
    "fmt"
)

func main() {

    func() {
        fmt.Println("匿名函数")
    }()

    func(a int, b int) {
        fmt.Println(a, b)
    }(1, 2) //括号内为匿名函数的实参

    res := func(a int, b int) int {
        return a + b
    }(1, 2)
    fmt.Println(res) //打印匿名函数返回值

    //如果不写后面的括号 则函数没有被调用
    // func(a, b int) int {
        // return a + b
    // } //没有加括号只是定义了一个函数
}