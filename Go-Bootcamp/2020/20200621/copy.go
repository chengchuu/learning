package main

import (
	"fmt"
	"strings"
)

func  main () {
	slice := []int{1, 2, 3, 4}
	s2 := make([]int, 0)
	for _, v := range slice {
		s2 = append(s2, v)
	}
	slice = append(slice, 7)
	fmt.Println(slice)
	fmt.Println(s2)

	// slice = slice[1:3]
	// fmt.Println(slice)
	slice = append(slice[:3], slice[4:]...)
	fmt.Println(slice)
}