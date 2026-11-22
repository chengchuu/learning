#include <stdio.h>
#include <stdlib.h>
void walk ();
void takeCoke ();
/*有一只肥宅的名字是 main，有一天他饿了。*/
void main () {
    printf("肥宅饿了；\n");
    /*饿了当然要吃薯片鸭，薯片就在身边拿起来就吃。*/
    printf("吃了一包薯片；\n");
    /*薯片是干的，容易渴； 定义一个字符串判断渴了没，y表示渴了，n表示不渴。*/
    char isThirsty[3];
    puts("渴了请输入 y：");
    scanf("%2s", isThirsty);
    /*渴了当然要喝可乐鸭，但是身边没有可乐，需要去冰箱拿，只能行动起来了！*/
    if (isThirsty[0] == 'y') {
        walk(1);
        takeCoke();
        walk(0);
    }
    printf("吃饱了，继续看番！");
}

/*去冰箱[子函数]，接受一个指示，1表示走向冰箱，0表示从冰箱走回来。*/
void walk (int behavior) {
    if (behavior == 1) {
        printf("走向冰箱；\n");
    } else {
        printf("走回来；\n");
    }
}

/*拿可乐[子函数]*/
void takeCoke () {
    printf("拿到可乐了；\n");
}