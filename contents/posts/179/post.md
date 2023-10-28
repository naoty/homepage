---
title: Arduinoで構造体をつかう
time: 2013-04-18 23:35
tags: ['arduino']
---

引数が長くなったときに構造体使いたくなったんだけど、公式リファレンスがわかりづらかった && 公式以外にちゃんとした情報がなかったので、がんばった記録を投稿しておく。

```c:struct_sample.ino
#include "types.h"

void setup() {
  Serial.begin(9600);
  RGB color = getBlue();
  Serial.println(color.b);
}

void loop() {
}

RGB getBlue() {
  RGB color = { 0, 0, 255 };
  return color;
}
```

```c:types.h
#include <Arduino.h>

struct RGB {
  byte r;
  byte g;
  byte b;
};

RGB getBlue();
```

IDEの新しいタブから適当な名前のヘッダーファイルを作成して、そこに構造体の定義と構造体を返り値または引数のデータ型に持つ関数の宣言をする。

関数で構造体を使わないのであれば、こうする必要はなかったはず。

なぜこうするのかはまだよくわかっていない。

---

参考

- [Arduino Playground - Struct Resource](http://playground.arduino.cc/Code/Struct)
