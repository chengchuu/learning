package main

import (
	"encoding/json"
	"fmt"
)

//结构体
type Prescription struct {
	Name     string        
	Unit     string        
	Additive *Prescription 
}

func main() {
	p := Prescription{}
	p.Name = "鹤顶红"
	p.Unit = "1.2kg"
	p.Additive = &Prescription{
		Name: "砒霜",
		Unit: "0.5kg",
	}

	buf, err := json.Marshal(p) //转换为json返回两个结果
	if err != nil {
		fmt.Println("err = ", err)
		return
	}

	fmt.Println("json = ", string(buf))
}