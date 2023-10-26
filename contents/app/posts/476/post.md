---
title: ラムダ式・メソッド参照
time: 2022-03-27 19:56
tags: ["java"]
---

はるか昔にAndroidアプリを開発していたときはJava 1.6を使っており、当時はラムダ式などはなく無名クラスを実装するしかなかった。Javaを書くのはそれ以来なので、ラムダ式やメソッド参照を確実に理解しておきたい。

# 関数型インターフェイス
ラムダ式の前に関数型インターフェイスを理解する必要がある。関数型インターフェイスは実装すべきメソッドが1つだけのインターフェイスだ。

```java
interface Function {
  R apply(T t);
}
```

`java.util.function`パッケージに汎用的な関数型インターフェイスが定義されており、以下のような命名規則に従っている。

* `*Function`: 引数を受け取って、戻り値を返す
* `*Consumer`: 引数を受け取って、戻り値を返さない（副作用をおこす）
* `*Predicate`: 引数を受け取って、booleanを返す
* `*Supplier`: 引数を受け取らず、戻り値を返す

さらに、引数を2つ受け取る場合は`BiFunction`のように`Bi*`というprefixがつき、特定の型を扱う場合は`IntConsumer`というように型名がくっつく。

# ラムダ式
関数型インターフェイスを実装する際に、以前のように無名クラスを定義する代わりに以下のようにラムダ式を渡せる。

以下の2つのコードは同じ結果になる。

```java
Arrays.sort(words, (a, b) -> a.compareTo(b));
```

```java
Arrays.sort(words, new Comparator<String>() {
  public int compare(String a, String b) {
    return a.compareTo(b);
  }
});
```

`Comparator`インターフェイスも`compare`しか抽象メソッドをもたない関数型インターフェイスで、`compare`の実装部分をラムダ式として渡すことができる。

# メソッド参照
ラムダ式を定義する際にただメソッドを呼び出しているだけの場合、メソッド参照を使うことでさらに簡潔に書けるようになる。

上記の例だと、ラムダ式はただ`compareTo()`を呼び出しているだけなので、メソッド参照を使って下のように書ける。

```java
Arrays.sort(words, String::compareTo);
```

メソッド参照は4種類ある。以下の2つ並んだコードはいずれも同じ結果になる。

## staticメソッドへの参照

```java
Stream.of("1", "2").map(text -> Integer.valueOf(text));
```

```java
Stream.of("1", "2").map(Integer::valueOf);
```

## 特定のオブジェクトに対するインスタンスメソッドへの参照

```java
Stream.of("java", "ruby").forEach(lang -> System.out.println(lang));
```

```java
Stream.of("java", "ruby").forEach(System.out::println);
```

## 引数のオブジェクトに対するインスタンスメソッドの参照 

```java
Stream.of("java", "ruby").map(lang -> lang.toUpperCase());
```

```java
Stream.of("java", "ruby").map(String::toUpperCase);
```

## コンストラクタへの参照

```java
Stream.of("java", "ruby").map(lang -> new StringBuilder.new(lang));
```

```java
Stream.of("java", "ruby").map(StringBuilder::new);
```

# おさらい
関数型インターフェイスや4種類のメソッド参照を理解できると、`Stream#collect`が理解できてくる。下のコードは同じ結果になる。

```java
Stream.of("java", "ruby").collect(
  () -> new ArrayList<>(),
  (list, lang) -> list.add(lang),
  (list1, list2) -> list1.addAll(list2)
);
```

```java
Stream.of("java", "ruby").collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
```

* `collect`の引数は順に`Supplier`, `BiConsumer`, `BiConsumer`となっている。上述のとおり、`Supplier`は引数を受け取らず、今回だと`ArrayList`を返す。`BiConsumer`は`Bi`とあるとおり2つの引数を受け取り、戻り値がない。
* `collect`の第一引数ではコンストラクタへの参照を利用し、第二、第三引数ではラムダ式の引数に対するインスタンスメソッドへの参照を応用している。
