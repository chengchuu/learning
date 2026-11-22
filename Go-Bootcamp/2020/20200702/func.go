package main

import (
    "fmt"
)

func main() {
    //函数的调用
    sum := getSum(50)//这里50 作为实参传递给方法
    fmt.Printf("%d", sum) //5050
}

//定义函数  num为形参用于接收调用方传递过来的参数
func getSum(num int) int {
    sum := 0
    for i := 0; i <= num; i++ {
        sum += i
    }
    return sum
}