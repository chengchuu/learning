package main

import (
	"encoding/json"
	"fmt"
)

//结构体
type Prescription struct {
	Name     string        `json:"name"` //重新指定json字段为小写输出
	Unit     string        `json:"unit"`
	Additive *Prescription `json:"additive,omitempty"`
}

func main() {
	jsonstr := `{"name":"鹤顶红","unit":"1.2kg","additive":{"name":"砒霜","unit":"0.5kg"}}`
	var p Prescription
	if err := json.Unmarshal([]byte(jsonstr), &p); err != nil {
		fmt.Println(err)
	}
	fmt.Println(p)
}