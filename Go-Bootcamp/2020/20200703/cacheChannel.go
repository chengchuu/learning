package main

import (
	"fmt"
)

func main() {
	//定义一个缓冲区大小为5的通道
	ch1 := make(chan int, 5)

	//开启子协程写入数据
	go func() {
		for i := 0; i < 10; i++ {
			ch1 <- i
			fmt.Println("子协程写入数据：", i)
		}
		close(ch1) //关闭通道
	}()

	//主协程读取数据
	for {
		v, ok := <-ch1
		if !ok {
			fmt.Println("读取结束", ok)
			break
		}
		fmt.Println("主协程读取到的数据为：", v)
	}

	fmt.Println("主协程结束")
}