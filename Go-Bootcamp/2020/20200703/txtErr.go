package main

import (
    "fmt"
    "io/ioutil"
)

func main() {
    //使用io/ioutil包下的读取文件方法
    conent, err := ioutil.ReadFile("test.txt")
    if err != nil {
        fmt.Println(err)//打印错误信息
    } else {
        fmt.Println(string(conent))//返回正常信息
    }
}