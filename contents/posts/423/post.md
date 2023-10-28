---
title: イテレータについて整理
time: 2020-07-04 21:58
tags: ["rust"]
---

for式を書くと所有権まわりのエラーが出てしまい、よくわからなかったので整理する。

# into_iter()

```rust
let numbers = vec![1, 2, 3];
for number in numbers {
  // numberは要素そのもの
}
// numbersは再利用不可
```

[公式ドキュメント](https://doc.rust-lang.org/std/iter/index.html#for-loops-and-intoiterator)にある通り、for式はコレクションに対して`IntoIterator`トレイトの`into_iter()`を呼び`Iterator`トレイトを実装するものを生成する。そして、それに対し`next()`を呼ぶことで要素を取り出す。

```rust
fn into_iter(self) -> Self::IntoIter
```

定義によると`into_iter()`は`self`を受けるため、`Copy`トレイトが実装されていなければmoveが発生する。なので、for式のあとで再利用しようとしてエラーが発生してしまう。

# iter(), iter_mut()

```rust
let numbers = vec![1, 2, 3];
for number = numbers.iter() {
  // numberは要素への参照
}
// numbersは再利用可
```

ここからの話は`Vec`型を想定する。moveを発生させたくない場合、`iter()`や`iter_mut()`を使う。

```rust
pub fn iter(&self) -> Iter<T>
```

`into_iter()`とは違い、`&self`を受けるのでmoveは発生しない。`Vec`型の実装だと、`std::slice::Iter`型を返す。なので、for式はこの`Iter`型の`into_iter()`を呼ぶことになるが、[実装](https://doc.rust-lang.org/src/core/iter/traits/collect.rs.html#247-249)を見ると`self`を返しているだけ。`Iter`型は`Iterator`トレイトも実装しているということになる。

```rust
let numbers = vec![1];
let mut iterator = numbers.iter();
assert_eq!(iterator.next(), Some(&1));
assert_eq!(iterator.next(), None);
```

`Iter`型の`next()`の実装を見てみたけど、現時点では理解できそうになかった。ただ、上のコードの通り、`next()`は要素の不変の参照を返す。一方で、`iter_mut()`ではこれが可変の参照になる。
