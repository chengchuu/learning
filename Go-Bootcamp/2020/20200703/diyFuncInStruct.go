package main

import (
	"fmt"
)

// 将好家伙 定义为int类型
type Haojiahuo int

// 使用Clear方法将Haojiahuo的所有值清空
func (h Haojiahuo) Clear() bool {
	h = 0
	return h == 0
}

// 使用Add方法给Haojiahuo增加值
func (h Haojiahuo) Add(num int) int {
	return int(h) + num
}
func main() {
	var h Haojiahuo
	fmt.Println(h.Clear()) //调用清空方法
	fmt.Println(h.Add(2))  //调用添加方法加2
	fmt.Println(h.Add(3))  //调用添加方法加3
	fmt.Println(h.Clear()) //调用清空方法
	fmt.Println(h.Add(6))  //调用添加方法加6
	fmt.Println(h.Clear()) //调用清空方法
	fmt.Println(h)
}