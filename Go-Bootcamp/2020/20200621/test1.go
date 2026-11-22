package main

import (
	"fmt"
	"os"
)

// # 简短定义方式不能定义全局变量，也就是不能声明在函数外部。
var name,age = "王钢蛋",18 

func main () {
	fmt.Println(name)
	foo()
}

func foo () {
	msg := "i am foo"
	fmt.Println(msg)
	if text, err := os.Open("./text0.txt"); err != nil {
		fmt.Println(text)
	} else {
		fmt.Println(err)
	}
	// fmt.Println(text)
}