package main

import (
    "fmt"
)

func main() {
    defer test(1) //第一个被defer的，函数后执行
    defer test(2) //第二个被defer的，函数先执行
    test(3)       //没有defer的函数，第一次执行
    
    //执行结果
    //3
    //2
    //1
}

func test(s int) {
    fmt.Println(s)
}