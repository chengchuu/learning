package main

import (
	"fmt"
)

func main() {
	ch1 := make(chan int)   //双向通道
	ch2 := make(chan<- int) //只写通道
	ch3 := make(<-chan int) //只读通道

	//=========1================
	//如果创建时候创建的就是双向通道
	//则在子协程内部写入数据，读取的时候不受影响。
	go WriteOnly(ch1)
	data2 := <-ch1
	fmt.Println("获取到只写通道中的数据是", data2)

	//=========2================
	//如果将定向通道ch2只写通道，作为参数传递。
	//则不能读取到写回来的数据。
	go WriteOnly(ch2)
	//data := <-ch2 //不能读取会报错：invalid operation: <-ch2 (receive from send-only type chan<- int)

	go ReadOnly(ch1) //这里可以传ch1 双向通道
	ch1 <- 20        //向通道ch1中写入数据

	//=========3================
	go ReadOnly(ch3) //传递单向通道ch3 就无法向通道中写入数据

	fmt.Println("结束")
}

//只读
func ReadOnly(ch <-chan int) {
	data := <-ch
	fmt.Println("读取到通道的数据是：", data)
}

//只写
func WriteOnly(ch chan<- int) {
	//如果传进来的原本是双向通道
	//但是函数本身接收的是一个只写的通道，则在此函数内部只允许写入数据不允许读取数据
	//所以单向通道往往是作为参数传递
	ch <- 10
	fmt.Println("只写通道结束")
}