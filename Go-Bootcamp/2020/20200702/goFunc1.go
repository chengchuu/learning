package main

import (
    "fmt"
)

func main() {
    s := 10
    fmt.Println(s) //调用函数之前数值是10
    fun1(&s)
    fmt.Println(s) //调用函数之后再访问则被修改成2
}

//接收一个int类型的指针作为参数
func fun1(a *int) {
    *a = 2
}