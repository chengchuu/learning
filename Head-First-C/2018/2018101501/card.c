#include <stdio.h>
#include <stdlib.h>
int main() {
    char card_name[3];
    puts("输入牌名：");
    scanf("%2s", card_name);
    int val = 0;
    if (card_name[0] == 'K') {
        val = 10;
    } else if (card_name[0] == 'Q') {
        val = 10;
    } else if (card_name[0] == 'J') {
        val = 10;
    } else if (card_name[0] == 'A') {
        val = 11;
    } else {
        val = atoi(card_name);
    }
    printf("这张牌的点数是：%i\n", val);
    /* 检查 3 - 6 */
    if (val > 2 && val < 7) {
        puts("计数增加");
    } else if (val == 10) {
        puts("计数减少");
    }
    return 0;
}
