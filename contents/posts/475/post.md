---
title: Streamと配列の変換
time: 2022-03-23 09:48
tags: ["java"]
---

最近は[Exercism](https://exercism.org)でJavaの練習をしているのだけど、Streamの扱いで少しハマったので頭を整理して定着させるためにブログを書いておきたい。

```java
String[] acronym(String text) {
  return Arrays
    .stream(text.split(" "))
    .map(word -> word.substring(0, 1).toUpperCase())
    .toArray(String[]::new);
};
```

* `Arrays.stream()`や`Stream.of()`で配列からStreamへ変換できる。
* `toArray()`でStreamから配列へ変換できる。ただし、引数を指定しないと`Object[]`を返すため、`IntStream`を渡す必要がある。`IntStream`は配列のサイズを表すintegerを受け取ってStreamの要素の型の配列を返す関数で、この例だと`String[]::new`にあたる。
