package main

import (
	"fmt"
)

func main() {
	go func() {
		fmt.Println("匿名函数创建goroutine执行")
	}()

	fmt.Println("主函数执行")
}