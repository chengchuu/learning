#include <stdio.h>

int main () {
    int energy;
    /* 初始梦境第 0 层。 */
    int dream = 0;
    /*  for 循环解析 只要有能量（不饿）就一直睡觉！
        energy = 100 初始状态 100 个能量，只在循环（第一次做梦）开始前执行一次！只执行一次！循环的时候不再执行！
        energy > 0 只要有能量就一直睡觉，每次循环开始前（进入新梦境前）都执行一下！符合条件才进入循环！
        energy-- 每进入一重梦境消耗一个能量，每次循环结束后执行一下！
    */
    for (energy = 100; energy > 0; energy--) {
        dream++;
        /* 超过 10 层梦境的时候，梦太深就听不到皮卡丘的声音了，会跳过 for 循环（此次循环，进入下一个循环）里面 continue 下面的语句。 */
        if (dream > 10) {
            continue;
        }
        printf("Pikachu: I have %i energies.\n", energy);
    }
    printf("Pikachu: Master Piao! I'm hungry, I have need energies.\n");
}