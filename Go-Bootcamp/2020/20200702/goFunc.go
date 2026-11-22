package main

import (
    "fmt"
)

func main() {

    //定义一个变量
    a := 2
    fmt.Printf("变量A的地址为%p", &a) //通过%p占位符, &符号获取变量的内存地址。
    //变量A的地址为0xc000072090
    

    //创建一个指针
    // 指针的声明 通过 *T 表示T类型的指针
    var i *int     //int类型的指针
    var f *float64 //float64类型的指针
    fmt.Println(i) // < nil >空指针
    fmt.Println(f)

    //因为指针存储的变量的地址 所以指针存储值
    i = &a
    fmt.Println(i)  //i存储a的内存地址0xc000072090
    fmt.Println(*i) //i存储这个指针存储的变量的数值2
    *i = 100
    fmt.Println(*i) //100
    fmt.Println(a)  //100通过指针操作 直接操作的是指针所对应的数值

}