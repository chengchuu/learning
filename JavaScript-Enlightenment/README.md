# JavaScript启示录 - Cody Lindley 著 / 徐涛 译

核心知识点基本都讲了，JavaScript入门的话是很好的一本书。

2014年3月第1版

## Function()参数

Function()构造函数采用不定数量的参数，但Function()构造函数的最后一个参数是一个包含具有函数体语句的字符串。在最后一个参数之前传递给构造函数的任何参数都可用于创建的函数。也可以将多个参数放在一起以逗号分隔形成字符串进行传递。

```
let add = new Function('a', 'b', 'return a + b');
// 等于
let add = new Function('a, b', 'return a + b');
// 等于
let add = function (a, b) {
    return a + b;
};
// 等于
function add (a, b) {
    return a + b;
}
```

## arguments.callee属性

arguments对象拥有名为callee的属性，它是对当前执行函数的引用。该属性可以用于从函数的作用域内引用函数（如arguments.callee） - 自我引用（严格模式`use strict;`不能使用）。当函数需要递归调用时，它非常有用。

```
function SumNum (num) {
    if (num === 1) {
        return num
    }
    return num + arguments.callee(--num);
}
console.log(SumNum(5)); // 15

// 尾递归
function SumNumTail (num, total) { // total = 0 设置默认值会报错，因为严格模式不能使用arguments.callee
    if (num === 1) {
        return total + 1;
    }
    total += num
    return arguments.callee(--num, total);
}
console.log(SumNumTail(5, 0)); // 15
```

可以通过利用callee属性获得长度值，即arguments.callee.length。

## 自调用的匿名函数语句

自调用的匿名函数语句。

```
(function (msg) {
    console.log(msg);
})('Hello, 2018!'); // Hello, 2018!
// 等于
(function (msg) {
    console.log(msg);
}('Hello, 2018!')); // Hello, 2018!
// 等于
!function (msg) {
    console.log(msg);
}('Hello, 2018!'); // Hello, 2018!
```

## 创建继承连

设计原型继承的目的是要在传统的面向对象编程语言中找到模仿继承模式的继承链。继承只是一个对象可以访问另外一个对象的属性。具体做法是，实例化**想要继承的对象**，将**该对象实例**作为**要继承该对象实例的函数的prototype属性**。完成之后，对象之间有一个链接（也称为__proto__），可以通过属性查找将可用属性扩展至对象。

```
function f0 () {}
function f1 () {}
f1.prototype = new f0();
console.log(f1.prototype.__proto__ === f0.prototype); // true
```
