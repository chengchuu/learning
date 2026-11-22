#include <stdio.h>

/*主角的属性*/
typedef struct {
    const char *name;
    char *season;
    char *food;
    int age;
} Person;

/*子程序：描述阿飘每个季节的行为。*/
void Action (Person Who) {
    printf("我是%s, 今年 %i 岁了，%s我爱吃%s！\n",
            Who.name, Who.age, Who.season, Who.food);
}

/*主程序：一年四季*/
void main () {
    /*初始化场景，春天的阿飘。*/
    Person Piao = {"阿飘", "春天", "草", 15};
    /*春天吃草夏天会瘦一点。*/
    Action(Piao);
    /*夏天买裙子花光了积蓄，只能吃土了！*/
    Piao.season = "夏天";
    Piao.food = "土";
    Action(Piao);
    /*秋天可以养膘了，吃猪排！*/
    Piao.season = "秋天";
    Piao.food = "猪排";
    Action(Piao);
    /*冬天太冷了，只想躺在床上冬眠，吃空气！*/
    Piao.season = "冬天";
    Piao.food = "空气";
    Action(Piao);
}