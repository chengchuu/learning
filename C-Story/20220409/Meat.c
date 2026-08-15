#include <stdio.h>
#include <stdlib.h>

/*肉的守恒通用样本*/
typedef struct {
    const char *name;
    int meat;
} Person;
/*是阿飘*/
Person Piao = {"阿飘", 44};

void main () {
    /*
    申请存储器的函数叫malloc()，
    是memory allocation（存储器分配）的意思。
    malloc()接收一个参数：所需要的字节数。
    通常你不知道确切的字节数，因此malloc()经常与sizeof运算符一起使用，像这样。
    */
    Person *Piao = malloc(sizeof(Person)); // Winter is coming... Eat Meat!!!
    Piao->name = "阿飘";
    Piao->meat = 44;
    /*
    free()需要接收malloc()创建的存储器的地址。
    只要告诉C标准库存储器块从哪里开始，
    它就能查阅记录，
    知道要释放多少存储器。
    假如想要释放上面那行代码分配的存储器，可以这样做。
    */
    free(Piao); // 释放冬天增加的肉。
}