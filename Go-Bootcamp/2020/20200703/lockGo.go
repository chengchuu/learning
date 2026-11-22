package main

import (
	"fmt"
	"sync"
)

//定义全局变量 表示救济粮食总量
var food = 10

//同步等到组对象
var wg sync.WaitGroup

//创建一把锁
var mutex sync.Mutex

func main() {
	wg.Add(4)
	//开启4个协程抢粮食
	go Relief("灾民好家伙")
	go Relief("灾民好家伙2")
	go Relief("灾民老李头")
	go Relief("灾民老李头2")
	wg.Wait() //阻塞主协程，等待子协程执行结束
}

//定义一个发放的方法
func Relief(name string) {
	defer wg.Done()
	for {
		//上锁
		mutex.Lock()
		if food > 0 { //加锁控制之后每次只允许一个协程进来，就会避免争抢
			food--
			fmt.Println(name, "抢到救济粮 ，还剩下", food, "个")
		} else {
			mutex.Unlock() //条件不满足也需要解锁 否则就会造成死锁其他不能执行
			fmt.Println(name, "别抢了 没有粮食了。")
			break
		}
		//执行结束解锁，让其他协程也能够进来执行
		mutex.Unlock()
	}
}
