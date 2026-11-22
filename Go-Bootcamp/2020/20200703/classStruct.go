package main

import (
	"fmt"
)

// 定义结构体实现封装
type Haojiahuo struct {
	Name string
	Age  int
}

//使用NewPerson方法创建一个对象
func NewPerson(name string) *Haojiahuo {
	return &Haojiahuo{
		Name: name,
	}
}

// 使用SetAge方法设置结构体成员的Age
func (h *Haojiahuo) SetAge(age int) {
	h.Age = age
}

// 使用GetAge方法获取成员现在的Age
func (h *Haojiahuo) GetAge() int {
	return h.Age
}

func main() {
	//创建一个对象
	h := NewPerson("好家伙")
	h.SetAge(18)                    //访问封装的方法设置年龄
	fmt.Println(h.Name, h.GetAge()) //使用对象封装的方法获取年龄
}