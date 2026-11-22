package main

import (
	"fmt"
)

func main() {
	ch1 := make(chan int)

	go func() {
		fmt.Println("======子协程执行======")
		for i := 0; i < 10; i++ {
			ch1 <- i //往通道中放数据
		}
		close(ch1) //结束发送数据  通知对方通道已经关闭了
	}()

	//通过for range循环读取通道中的数据,当通道关闭,循环也就结束了
	for v := range ch1 {
		fmt.Println("读取到的通道的数据：", v)
	}

	fmt.Println("主协程结束")
}