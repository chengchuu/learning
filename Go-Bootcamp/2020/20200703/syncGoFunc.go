package main

import (
    "fmt"
    "sync"
)

//创建一个同步等待组的对象
var wg sync.WaitGroup

func main() {
    wg.Add(3) //设置同步等待组的数量
    go Relief1()
    go Relief2()
    go Relief3()
    wg.Wait() //主goroutine进入阻塞状态
    fmt.Println("main end...")
}

func Relief1() {
    fmt.Println("func1...")
    wg.Done() //执行完成 同步等待数量减1
}
func Relief2() {
    defer wg.Done()
    fmt.Println("func2...")
}
func Relief3() {
    defer wg.Done() //推荐使用延时执行的方法来减去执行组的数量
    fmt.Println("func3...")
}