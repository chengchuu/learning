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
    p2 := Person{age: 2, address: "陕西", name: "老李头", sex: "女"}
    
    //1 使用结构体指针
    var p *Person
    p = &p2 //将p2 的地址赋给p
    fmt.Println(p)
    p.name = "好家伙" //修改p的值
    fmt.Println(p)
    fmt.Println(p2) //p2的值也被修改了

    //2 使用new 创建结构体指针
    pnew := new(Person)
    fmt.Println(pnew)
    pnew.address = "陕西"
    pnew.age = 23
    pnew.name = "李书记"
    pnew.sex = "男"
    fmt.Println(pnew)
}