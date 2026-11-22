package main

import (
    "fmt"
)

func main() {
    s1 := make([]int, 0, 3)
    fmt.Printf("地址%p,长度%d,容量%d\n", s1, len(s1), cap(s1))
    s1 = append(s1, 1, 2)
    fmt.Printf("地址%p,长度%d,容量%d\n", s1, len(s1), cap(s1))
    s1 = append(s1, 3, 4, 5)
    fmt.Printf("地址%p,长度%d,容量%d\n", s1, len(s1), cap(s1))
    
    
    //地址0xc000010540,长度0,容量3
    //地址0xc000010540,长度2,容量3
	//地址0xc00000e4b0,长度5,容量6
	
	//copy(目标切片,数据源)  深拷贝数据函数
	s2 := []int{1, 2, 3, 4}
	s3 := []int{7, 8, 9}

	copy(s2, s3)        //将s3拷贝到s2中    
	fmt.Println(s2)     //结果 [7 8 9 4]
	fmt.Println(s3)     //结果 [7 8 9]

	copy(s3, s2[2:])    //将s2中下标为2的位置 到结束的值 拷贝到s3中 
	fmt.Println(s2)     //结果 [1 2 3 4]
	fmt.Println(s3)     //结果 [3 4 9]

	copy(s3, s2)        //将s2拷贝到s3中
	fmt.Println(s2)     //结果 [1 2 3 4]
	fmt.Println(s3)     //结果 [1 2 3]
}