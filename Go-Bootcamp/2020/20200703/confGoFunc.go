package main

import (
	"fmt"
	"math/rand"
	"time"
)

//定义全局变量 表示救济粮食总量
var food = 10

func main() {
	//开启4个协程抢粮食
	go Relief("灾民好家伙1")
	go Relief("灾民好家伙2")
	go Relief("灾民老李头1")
	go Relief("灾民老李头2")

	//让程序休息5秒等待所有子协程执行完毕
	time.Sleep(5 * time.Second)
}

//定义一个发放的方法
func Relief(name string) {
	for {
		if food > 0 { //此时有可能第二个goroutine访问的时候 第一个goroutine还未执行完 所以条件也成立
			time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond) //随机休眠时间
			food--
			fmt.Println(name, "抢到救济粮 ，还剩下", food, "个")
		} else {
			fmt.Println(name, "别抢了 没有粮食了。")
			break
		}
	}
}