package main

import "fmt"

func main () {
	a := 1
	switch a {
	case 1, 2, 3:
		fmt.Println("找到了", a)
		fallthrough
	case 4:
		fmt.Println("没找到！")
	}
	haha:
	for i :=0; i < 100; i++ {
		fmt.Println("circle", i)
		if i == 5 {
			break
		}
		for j := 0; j < 7; j++ {
			if j == 2 {
				goto haha
			}
			fmt.Println(i, j)
		}
	}
}