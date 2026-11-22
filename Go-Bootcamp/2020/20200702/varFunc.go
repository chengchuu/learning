package main

import (
    "fmt"
)

func main() {
    //声明一个变量f  类型是一个函数类型
    var f func()
    //将自定义函数myfunc 赋给变量f
    f = myfunc
    //调用变量f 相当于调用函数myfunc()
    f()
}

//自定义函数
func myfunc() {
    fmt.Println("myfunc...")
}