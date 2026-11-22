# 读书笔记:《Go Bootcamp》 – Matt Aimonetti 著

读完时间：2022 年 10 月 13 日

出版时间：2016 年 7 月 28 日

## Chapter 2: The Basics 

Functions can be defined to return any number of values that are always typed.

```
package main

import "fmt"

func add(x int, y int) int {
    return x + y
}

func main() {
    fmt.Println(add(42, 13))
}
```

---

To get the pointer of a value, use the `&` symbol in front of the value; to dereference a pointer, use the `*` symbol.

## Chapter 4: Collection Types

Note: `lo` and `hi` would be integers representing indexes.

```
package main

import "fmt"

func main() {
 mySlice := []int{2, 3, 5, 7, 11, 13}
 fmt.Println(mySlice)
 // [2 3 5 7 11 13]

 fmt.Println(mySlice[1:4])
 // [3 5 7]

 // missing low index implies 0
 fmt.Println(mySlice[:3])
 // [2 3 5]

 // missing high index implies len(s)
 fmt.Println(mySlice[4:])
 // [11 13]
}
```

## Chapter 6: Methods

```
package main

import (
 "fmt"
)

type User struct {
 FirstName, LastName string
}

func (u *User) Greeting() string {
 return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}

func main() {
 u := &User{"Matt", "Aimonetti"}
 fmt.Println(u.Greeting())
}
```

Remember that Go passes everything by value, meaning that when `Greeting()` is defined on the value type, every time you call `Greeting()`, you are copying the `User` struct. Instead when using a pointer, only the pointer is copied (cheap).

## Chapter 7: Interfaces

An interface type is defined by a set of methods. A value of interface type can hold any value that implements those methods.

## Chapter 8: Concurrency

Do not communicate by sharing memory; instead, share memory by communicating.

## Chapter 9: Get Setup

Installing `Godoc`, `vet` and `Golint`, three very useful Go tools from the Go team, is highly recommended:

```
$ go get golang.org/x/tools/cmd/godoc
$ go get golang.org/x/tools/cmd/vet
$ go get github.com/golang/lint/golint
```

## Chapter 11: Tips and Tricks

The error handling in Go seems cumbersome and repetitive at first, but quickly becomes part of the way we think. Instead of creating exceptions that bubble up and might or might not be handled or passed higher, errors are part of the response and designed to be handled by the caller. Whenever a function might generate an error, its response should contain an error param.
