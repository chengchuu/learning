package main

import (
	"fmt"
	"time"
)

func main() {
	ch1 := make(chan int)
	ch2 := make(chan int)
	go func() {
		for {
			select {
			case <-ch1:
				fmt.Println("成功获取ch1的数据：", <-ch1)
			case ch2 <- 1:
				fmt.Println("成功向通道ch2中写入数据")
			case <-time.After(time.Second * 2):
			    //使用time.After 设置超时响应。如果迟迟接收不到以上的case就会响应超时。
				fmt.Println("超时!!")
			}
		}
	}()

	for i := 0; i < 10; i++ {
		ch1 <- i
		fmt.Println("ch1写入数据：", i)
	}
	for i := 0; i < 10; i++ {
		str := <-ch2
		fmt.Println("获取到ch2的数据：", str)
	}

	// select 会一直等待等到某个 case 语句完成，
	//也就是等到成功从 ch1 或者 ch2 中读到数据。则 select 语句结束。
}