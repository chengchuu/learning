# 读书笔记:《The Little Go Book》 – Karl Seguin 著

读完时间：2022 年 9 月 20 日

出版时间：2021 年 10 月 14 日

## Introduction

Compared to everything else we have to learn, new languages often feel like a poor investment of our time.

## Chapter 2 - Structures

Many times though, we don't want a variable that is directly associated with our value but rather a variable that has a pointer to our value. A pointer is a memory address; it's the location of where to find the actual value. It's a level of indirection. Loosely, it's the difference between being at a house and having directions to the house.

---

```
func main() {
  goku := &Saiyan{"Goku", 9000}
  Super(goku)
  fmt.Println(goku.Power)
}

func Super(s *Saiyan) {
  s.Power += 10000
}
```

We made two changes. The first is the use of the `&` operator to get the address of our value (it's called the address of operator). Next, we changed the type of parameter `Super` expects. It used to expect a value of type `Saiyan` but now expects an address of type `*Saiyan`, where `*X` means pointer to value of type `X`. There's obviously some relation between the types `Saiyan` and `*Saiyan`, but they are two distinct types.

---

Our factory doesn't have to return a pointer; this is absolutely valid: 

```
func NewSaiyan(name string, power int) Saiyan {
  return Saiyan{
    Name: name,
    Power: power,
  }
}
```

---

Despite the lack of constructors, Go does have a built-in new function which is used to allocate the memory required by a type. The result of `new(X)` is the same as `&X{}`:

```
goku := new(Saiyan)
// same as
goku := &Saiyan{}
```

## Chapter 3 - Maps, Arrays and Slices

```
func main() {
  scores := make([]int, 5)
  scores = append(scores, 9332)
  fmt.Println(scores)
}
```

To a human, that might seem logical. To a compiler, you're telling it to append a value to a slice that already holds 5 values.

## Chapter 4 - Code Organization and Interfaces

Go uses a simple rule to define what types and functions are visible outside of a package. If the name of the type or function starts with an uppercase letter, it's visible. If it starts with a lowercase letter, it isn't.

## Chapter 6 - Concurrency

A goroutine is similar to a thread, but it is scheduled by Go, not the OS. Code that runs in a goroutine can run concurrently with other code. 

```
package main

import (
  "fmt"
  "time"
)

func main() {
  fmt.Println("start")
  go process()
  time.Sleep(time.Millisecond * 10) // this is bad, don't do this!
  fmt.Println("done")
}

func process() {
  fmt.Println("processing")
}
```

If we go back to our example, you'll notice that we had to Sleep for a few milliseconds. That's because the main process exits before the goroutine gets a chance to execute (the process doesn't wait until all goroutines are finished before exiting). To solve this, we need to coordinate our code.
