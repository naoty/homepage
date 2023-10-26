---
title: Resultをio::Resultに変換する
time: 2020-06-29 22:13
tags: ["rust"]
---

`Read`トレイトや`Write`トレイトを実装するには、`io::Result`を返す必要がある。これらの関数のなかで`std::result::Result`を扱うとき、これを`io::Result`に変換したい。

```rust
fn write(&mut self, buf: &[u8]) -> io::Result {
  let string = String::from_utf8(buf.to_vec());
    .map_err(io::Error::from(io::ErrorKind::InvalidData))?;

  // ...
}
```

* `io::Result`にするために、`map_err`を使ってエラーの型を`io::Error`に変換する。
* `io::Error`は`io::ErrorKind`から`from`関数で生成できる。
* `io::ErrorKind`は[ドキュメント](https://doc.rust-lang.org/std/io/enum.ErrorKind.html)にあるようにenumとして定義されている。このコードのような不正なデータを受け取った場合は`InvalidData`で表せそう。
