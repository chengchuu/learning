package main

import (
	"fmt"
)

func main() {

	h := Haojiahuo{name: "好家伙"}
	fmt.Println(h.name)

	l := Laolitou{name: "老李头"}
	fmt.Println(l.name)

	//testInterface 需要参数类型为Kongfu接口类型的参数
	//h实现了Kongfu接口的方法
	//h就是这个接口的实现 就可以作为这个函数的参数
	testInterface(h)

	var kf Kongfu
	kf = h
	kf.Toad()

	l.PlayGame()
}

//测试方法
func testInterface(k Kongfu) {
	k.Toad()
	k.SixSwords()
}

//定义接口
type Kongfu interface {
	Toad()      //蛤蟆功
	SixSwords() //六脉神剑
}

//实现类
type Haojiahuo struct {
	name string
}

//实现类
type Laolitou struct {
	name string
}

//实现方法
func (o Haojiahuo) Toad() {
	fmt.Println(o.name, "实现了蛤蟆功..")
}

//实现方法
func (o Haojiahuo) SixSwords() {
	fmt.Println(o.name, "实现了六脉神剑..")
}

//实现方法
func (f Laolitou) Toad() {
	fmt.Println(f.name, "也实现了蛤蟆功..")
}

//实现方法
func (f Laolitou) SixSwords() {
	fmt.Println(f.name, "也实现了六脉神剑.")
}

//实现自己的方法
func (f Laolitou) PlayGame() {
	fmt.Println(f.name, "玩游戏..")
}