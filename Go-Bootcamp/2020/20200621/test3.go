package main

import "fmt"

type UType int

const (
	NUM UType = iota
	ONE
	TWO
	THREE
)

func main () {
	fmt.Println(TWO)
	fmt.Println(THREE)

	foo, bar, baz := 'A', `B`, "haha\\ 123"
	fmt.Println(foo)
	fmt.Println(bar)
	fmt.Println(baz)

	a := 3.14
	b := int(a)
	fmt.Println("b", b)
}