package main

import (
	"errors"
	"fmt"
)

func main() {
	err := errors.New("错误信息...")
	fmt.Println(err)

	num, err2 := Calculation(0)
	fmt.Println(num, err2)
}

//通过内置errors包创建错误对象来返回
func Calculation(divisor int) (int, error) {
	if divisor == 0 {
		return 0, errors.New("错误:除数不能为零.")
	}
	return 100 / divisor, nil
}