---
title: JavaScriptのループ文あれこれ
time: 2011-03-10 11:46
tags: ['javascript']
---

1.　典型的なfor文

```
for (var i = 0; i < array.length; i++) {
    statement
}
```

- ループ開始前に「var i = 0」でループに使う変数を宣言する。ちなみに、「,」でつなげると、複数の変数を宣言できる。
- 「i \< array.length」がtrueであるかぎり、ループが続く。
- 「i++」が各ループの最後に実行される。「i++」はiが0のとき、iに1を足して0を返す。
- 各ループのはじめにarray.lengthを呼び出しているので、効率が悪い。事前にキャッシュすると2.のようになる。

2.　改良型for文

```
var i = 0, len = array.length;
for (; i < len; i++) {
    statement
}
```

- 事前にiとarray.lengthをキャッシュしておく。
- 「;」は省略できない。なんか気持ち悪い。whileを使ってシンプルにすると、3.のようになる。

3.　while文

```
var len = array.length;
while (len--) {
    statement
}
```

- 「len--」がfalseになるとループが停止する。
- 「len--」は、lenが1のとき、lenに0をセットし、1を返す（よって、ループは続く）。lenが0のとき、lenに-1をセットし、0を返す（よって、falseと解釈されループは停止する）。

4.　while文・do while文のテスト

```
var i = 10
while (i--) {
    console.log(i);
}
//=> 9, 8, 7, 6, 5, 4, 3, 2, 1, 0

while (--i) {
    console.log(i);
}
//=> 9, 8, 7, 6, 5, 4, 3, 2, 1

do {
    console.log(i);
} while (i--)
//=> 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0

do {
    console.log(i);
} while (--i)
//=> 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
```

- 「i--」はiを返してから1引く。「--i」は1引いてからiを返す。
- while文はループ開始時に評価し、do while文はループ終了時に評価する。
- 回数を指定してループを実行したいときは、「while (i--) {}」か「do {} while (i--)」がいい。
