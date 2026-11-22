package main

import (
    "fmt"
)

func main() {
    //定义四个变量
    a, b, c, d := 1, 2, 3, 4
    
    arr1 := [4]int{a, b, c, d}
    arr2 := [4]*int{&a, &b, &c, &d} //将所有变量的指针，放进arr2里面

    fmt.Println(arr1)   //结果为：[1 2 3 4]
    fmt.Println(arr2)   //结果为：[0xc00000c1c8 0xc00000c1e0 0xc00000c1e8 0xc00000c1f0]

    arr1[0] = 100  //修改arr1中的值
    fmt.Println("arr1的值：", arr1)  //修改后的结果为：[100 2 3 4]
    
    fmt.Println("a=", a) //变量a的值还是1，相当于值传递，只修改了数值的副本。

    //修改指针数组
    *arr2[0] = 200 //修改指针的值
    fmt.Println(arr2)
    fmt.Println("a=", a) //200  引用传递 修改的是内存地址所对应的值 所以a也修改了
    
    //循环数组，用*取数组中的所有值。 
    for i := 0; i < len(arr2); i++ {
        fmt.Println(*arr2[i])
    }
}