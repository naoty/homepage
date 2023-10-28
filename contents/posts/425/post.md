---
title: モジュールをディレクトリで構成する
time: 2020-07-08 22:56
tags: ["rust"]
---

下のディレクトリ構成のように複数ファイルから`reader`モジュールを作りたい。

```
src
├── lib.rs
├── main.rs
├── reader
│   ├── csv_reader.rs
│   ├── jsonl_reader.rs
│   └── ltsv_reader.rs
└── reader.rs
```

`csv_reader.rs`, `jsonl_reader.rs`, `ltsv_reader.rs`にはそれぞれ`CsvReader`, `JsonlReader`, `LtsvReader`がある。

# ファイルごとにモジュールを公開する

```rust
// lib.rs
pub mod reader;
```

```rust
// reader.rs
pub mod csv_reader;
pub mod jsonl_reader;
pub mod ltsv_reader;
```

こうすると、`main.rs`からはこうなる。

```rust
use mycrate::reader::csv_reader::CsvReader;
use mycrate::reader::jsonl_reader::JsonlReader;
use mycrate::reader::ltsv_reader::LtsvReader;
```

各ファイルがモジュールとして公開されているため、冗長な感じになる。

# モジュールをまとめて公開し直す

```rust
// lib.rs
pub mod reader;
```

```rust
// reader.rs
mod csv_reader;
mod jsonl_reader;
mod ltsv_reader;

pub use csv_reader::CsvReader;
pub use json_reader::JsonlReader;
pub use ltsv_reader::LtsvReader;
```

`pub use`を使い、各モジュールに含まれるstructを`reader`モジュールとして公開している。こうすると、`main.rs`からはこうなる。

```rust
use mycrate::reader::{CsvReader, JsonlReader, LtsvReader};
```
