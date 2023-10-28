---
title: カスタムエラー型の定義
time: 2020-08-19 21:24
tags: ["rust"]
---

```rust
use std::{error, fmt};

#[derive(Debug)]
pub enum MyError {
  InvalidFormat,
}

impl fmt::Display for MyError {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::InvalidFormat => write!(f, "invalid format"),
    }
  }
}

impl error::Error for MyError {}

fn main() {
  let error: Box<dyn error::Error> = Box::new(MyError::InvalidFormat);
  eprintln!("error: {}", error);
}
```

* `std::error::Error`トレイトは基本的なエラーの振る舞いを表す。
* `std::error::Error`トレイトは`Debug`トレイトと`Display`トレイトを継承しているため、まずはこの2つを実装する必要がある。
* `impl error::Error for MyError {}`という空の定義がないと、下のようなエラーになってしまうためこれも必要になる。
  ```
  error[E0277]: the trait bound `MyError: std::error::Error` is not satisfied
    --> src/main.rs:19:40
     |
  19 |     let error: Box<dyn error::Error> = Box::new(MyError::InvalidFormat);
     |                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ the trait `std::error::Error` is not implemented for `MyError`
     |
     = note: required for the cast to the object type `dyn std::error::Error`
  ```
