package main

import (
	"fmt"
	"reflect"
)

func myfunc(a, b int) int {
	return a + b
}

func main() {
	r_func := reflect.ValueOf(myfunc)

	//设置函数需要传入的参数也必须是反射类型
	params := []reflect.Value{reflect.ValueOf(10), reflect.ValueOf(20)}

	//反射调用函数
	res := r_func.Call(params)
	
	//获取返回值
	fmt.Println(res[0].Int())
}