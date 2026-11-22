package main

import (
    "fmt"
)

//定义结构体
type Person struct {
    name    string
    age     int
    sex     string
    address string
}

func main() {
    //实例化后并使用结构体
    p := Person{} //使用简短声明方式，后面加上{}代表这是结构体
    
    p.age = 2     //给结构体内成员变量赋值
    p.address = "陕西"
    p.name = "好家伙"
    p.sex = "女"
    
    fmt.Println(p.age, p.address, p.name, p.sex)//使用点.来访问结构体内成员的变量的值。

}