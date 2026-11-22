package main

import "fmt"

func main() {
	arr := []int{12, 7, 2}
	fmt.Println(arr)
	for i := len(arr) - 1; i > 0; i-- { // i 代表着每次获得的数字
		for j := 0; j < i; j++ {
			if arr[j] > arr[j+1] {
				arr[j], arr[j+1] = arr[j+1], arr[j]
			}
		}
	}
	fmt.Println(arr)

	var arr1 [5]int
	arr1[1] = 3
	arr1[2] = 4

	fmt.Println(arr1)
	fmt.Println(len(arr1))
	fmt.Println(cap(arr1))

	arr2 := [...]int{7: 7, 4: 3}

	fmt.Println(arr2)
	fmt.Println(len(arr2))
	fmt.Println(cap(arr2))

	for i, v := range arr2 {
		fmt.Println("range", i, v)
	}

	for i := 0; i < len(arr2); i++ {
		fmt.Println("for", i, arr2[i])
	}

	arr3 := [2][3]int{}

	fmt.Println(arr3)

	var arr4 []int
	arr5 := make([]int, 5)
	fmt.Println("arr4", arr4)
	fmt.Println("arr5", arr5, len(arr5))

	arr5 = append(arr5, 9, 8, 7)
	fmt.Println("arr5 append", arr5, len(arr5))

	arr6 := make([]int, 2, 3)
	arr5 = append(arr5, len(arr6))
	fmt.Println("arr5 append arr", arr5, len(arr5))

	//使用append() 给切片末尾追加元素
	var slice []int
	slice = append(slice, 1, 2, 3)
	fmt.Println(slice) // [1, 2, 3]

	//使用make函数创建切片
	s1 := make([]int, 0, 5)
	fmt.Println(s1) // [] 打印空的切片
	s1 = append(s1, 1, 2)
	fmt.Println(s1) // [1,2]
	//因为切片可以扩容  所以定义容量为5 但是可以加无数个数值
	s1 = append(s1, 3, 4, 5, 6, 7)
	fmt.Println(s1) // [1,2,3,4,5,6,7]

	//添加一组切片到另一切片中
	s2 := make([]int, 0, 3)
	s2 = append(s2, s1...) //...表示将另一个切片数组完整加入到当前切片中
}
