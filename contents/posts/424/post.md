---
title: clapカスタマイズメモ
time: 2020-07-05 22:49
tags: ["rust"]
---

rustでCLIツールを作るときにフレームワークを調べるとclapしか出てこない。これがデファクトスタンダードなのだろうということで使ってみるが、微妙にカスタマイズしたかったのでメモ。

```rust
let matches = App::new("mycli")
    .version(crate_version!())
    .author("Naoto Kaneko <naoty.k@gmail.com>")
    .about(DESCRIPTION)
    .template(USAGE_TEMPLATE.trim())
    .version_short("v")
    .get_matches();
```

ポイントは3つ。

* `crate_version!()`マクロを使うと、Cargo.tomlで定義しているパッケージのバージョンを取得してくれるのでCLIが返すバージョンに設定できて便利。
* `template()`を使うと、デフォルトのヘルプメッセージが気に食わない、でもサブコマンドや各フラグの定義時に渡したヘルプメッセージも使いたいみたいなときにテンプレートを指定することでいい感じにカスタマイズができて便利。
* `version_short()`を使うと、バージョンの短縮形のフラグがデフォルトで`-V`だったのが`-v`など自由に変更できる。これがclapを使って最初に感じた違和感だったのでカスタマイズできてよかった。

# 補足
僕はいつもCLIを作るときはdocopt形式のヘルプメッセージを使っているので、こんな感じのテンプレートを指定してclapでもdocopt風のヘルプメッセージを表示している。

```rust
const USAGE_TEMPLATE: &str = r#"
Usage:
    {usage}

Flags:
{flags}
"#;
```

`{usage}`, `{flags}`の部分がそれぞれclapによって置換される。

# 追記（2020-08-10）
ドキュメントを読むと、`crate_version!`以外にもCargo.tomlの情報を取得するマクロがあった。

```rust
let matches = App::new(crate_name!())
    .version(crate_version!())
    .author(crate_authors!())
    .about(crate_description!())
    .template(USAGE_TEMPLATE.trim())
    .version_short("v")
    .get_matches();
    .get_matches();
```
