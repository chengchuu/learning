package main

import (
	"fmt"
)

func main() {
    //使用Role结构体创建一个角色代表任我行
	rwx := Role{"任我行", "吸星大法", 10, 9.9}
	rwx.Kungfu()//调用这个结构体的方法。
}

//创建一个结构体代表人物角色--任我行
type Role struct {
	Name    string  //姓名
	Ability string  //技能
	Level   int     //级别
	Kill    float64 //杀伤力
}

//创建一个方法,只要是Role结构体就能调用。
func (r Role) Kungfu() {
	fmt.Printf("我是:%s，我的武功:%s,已经练到%d级了，杀伤力%.1f\n", r.Name, r.Ability, r.Level, r.Kill)
}