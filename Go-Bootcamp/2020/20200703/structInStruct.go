package main

import (
	"fmt"
)

//结构体一
type Prescription struct {
	name     string
	unit     string
	additive Prescription2
}

//结构体二
type Prescription2 struct {
	name string
	unit string
}

//也可以嵌套结构体指针
type Prescription3 struct {
	name     string
	unit     string
	additive *Prescription2
}

func main() {
    
	p := Prescription{}
	p.name = "鹤顶红"
	p.unit = "1.2kg"
	p.additive = Prescription2{
		name: "砒霜",
		unit: "0.5kg",
	}
	fmt.Println(p)
	
    //结构体初始化可以使用上面两种格式将字段名和对应的值写在括号内，使用(字段名:值,)的格式填充
    //第二种初始化的方式，定义好结构体之后使用重新赋值的方式:使用(变量.字段名=值)的格式
    
	//嵌套结构体指针
	pr := Prescription2{}
	pr.name = "鹤顶红升级版"
	pr.unit = "2.2kg"

	pre := Prescription3{}
	pre.name = "砒霜+"
	pre.unit = "1.2kg"
	pre.additive = &pr
	fmt.Println(pre)
}