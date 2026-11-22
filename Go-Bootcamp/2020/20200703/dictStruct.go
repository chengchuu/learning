package main

import "fmt"

// 字典结构
type Dictionary struct {
	data map[string]interface{} // 数据key为string值为interface{}类型
}

// 获取值
func (d *Dictionary) GetData(key string) interface{} {
	return d.data[key]
}

// 设置值
func (d *Dictionary) SetData(key string, value interface{}) {
	d.data[key] = value
}

// 创建一个字典
func NewDict() *Dictionary {
	return &Dictionary{
		data: make(map[string]interface{}),//map类型使用前需要初始化，所以需要使用make创建 防止空指针异常。
	}
}

func main() {
	// 创建字典实例
	dict := NewDict()
	// 添加数据
	dict.SetData("001", "第一条数据")
	dict.SetData("002", 3.1415)
	dict.SetData("003", false)
	// 获取值
	d := dict.GetData("001")
	fmt.Println(d)
}