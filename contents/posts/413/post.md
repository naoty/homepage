---
title: spf13/pflagの使い方
description: GoでCLIツールを作るときにいつも使っているspf13/pflagの使い方のメモ
time: 2020-04-29 22:25
tags: ["go"]
---

GoでCLIツールを作るとき、いつも[spf13/pflag](https://github.com/spf13/pflag)を使ってオプションを実装している。

spf13/pflagは標準パッケージの[flag](https://golang.org/pkg/flag/)と同じインターフェイスを持ちつつ、`-h`と`--help`のようなよくある形式のオプションを簡単に実装できる。標準パッケージのflagでは、`-help`のような形式になってしまう。

# 使い方

```go
func main() {
  version := pflag.BoolP("version", "v", false, "show version")
  pflag.Parse()

  if pflag.NArg() == 0 {
    pflag.Usage()
    os.Exit(1)
  }

  if *version {
    fmt.Println("1.0.0")
    return
  }

  switch pflag.Arg(0) {
  case "list":
    // snip
  default:
    fmt.Fprintf(os.Stderr, "subcommand not found: %s\n", pflag.Arg(0))
    os.Exit(1)
  }
}
```

```bash
% sample
Usage of sample:
  -v, --version   show version
```

* `pflag.BoolP`のようにflagパッケージの関数名に`P`がついた関数をつかうと、よくある形式のオプションを追加できる。
* `pflag.Usage()`でヘルプメッセージを生成する。
* `NArg()`や`Arg()`などの関数はflagパッケージにあるものと同じなので、覚えていることをそのまま使える。
