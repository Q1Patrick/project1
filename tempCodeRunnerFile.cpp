#include<iostream>
using namespace std;
int main() {
    int N = 1000;
    int *ptr = new int(N);
    cout << ptr << endl;
    cout << *ptr << endl;
}