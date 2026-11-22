package main

import (
    "fmt"
)

func main() {
    Test1()
}

func Test1() {
    defer func() {
        ms := recover()//这里执行恢复操作
        fmt.Println(ms, "恢复执行了..") //恢复程序执行,且必须在defer函数中执行
    }()
    defer fmt.Println("第1个被defer执行")
    defer fmt.Println("第2个被defer执行")
    for i := 0; i <= 6; i++ {
        if i == 4 {
            panic("中断操作") //让程序进入恐慌 终端程序操作
        }
    }
    
    defer fmt.Println("第3个被defer执行") //恐慌之后的代码是不会被执行的
}