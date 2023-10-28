---
title: Result型の返り値を使わないとき
time: 2019-01-05T17:09:00+0900
tags: ["rust"]
---
以下のように`Result`型を返すメソッドの返り値を使わないと、コンパイラが```unused `std::result::Result` that must be used```のような警告を出す。

```rust
process::Command::new("ls").output()
```

`Result`型を返すメソッドが失敗したとき、返り値を使わないとそれに気づくことができないため、必ず返り値を使うようにコンパイラが警告してくれる。

返り値を使わないときは`expect`を使う。このメソッドは`Result`が`Ok`であれば値を返し、`Err`であれば引数のメッセージを表示してpanicを起こす。

```rust
process::Command::new("ls").output().expect("failed");
```

あるいは、`?`オペレータを使ってエラーをそのまま呼び出し元に転送することもできる。

```rust
fn execute_ls() -> io::Result<()> {
    process::Command::new("ls").output()?;
    Ok(())
}
```

