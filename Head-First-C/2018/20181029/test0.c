#include <stdio.h>
#include <limits.h>
#include <float.h>

int main () {
    printf("The value of INT_MAX is %i\n", INT_MAX);
    printf("The value of INT_MIN is %i\n", INT_MIN);
    printf("An int take %z bytes\n", sizeof(int));

    printf("The value of FLT_MAX is %f\n", FLT_MAX);
    printf("The value of FLT_MIN is %.50f\n", FLT_MIN);
    printf("A float takes %z bytes\n", sizeof(float));

    return 0;
}