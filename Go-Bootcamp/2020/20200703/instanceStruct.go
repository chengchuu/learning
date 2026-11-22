package main

import (
	"fmt"
)

//定义结构体
type Person struct {
	name string
	age  int
	sex  string
}

func main() {
	p := newPerson("好家伙", 18, "男")
	fmt.Println(p.name, p.age, p.sex)
}

//使用函数来实例化结构体 
func newPerson(name string, age int, sex string) *Person {
	return &Person{
		name: name,
		age:  age,
		sex:  sex,
	}
}