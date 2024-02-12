---
title: build_runnerから実行できるミニマムなBuilder
time: 2024-02-11 19:46
tags: ['dart']
---

Dartを使った開発では自動生成されたコードを利用することが多い。[freezed](https://pub.dev/packages/freezed)や[json_serializable](https://pub.dev/packages/json_serializable)などのパッケージでは、以下のように[build_runner](https://pub.dev/packages/build_runner)を使ってコードを自動生成する。

```bash
$ dart run build_runner build
```

build_runnerはbuild.yamlによって定義されたbuilderを使ってビルドを行い、Dartのコードを生成する。ビルドに関わるいくつかのパッケージがDart開発チームによって提供されている。

- build: コード生成を実際に行うBuilderのためのインターフェイスを提供する
- build_runner: ビルドを実行するCLIを提供する
- build_config: build.yamlをパースすることで得られるビルド設定を提供する

なので、buildが提供する`Builder`インターフェイスを実装すれば、build_runnerからコード生成を行うパッケージが自分でも作れるようになる。

# ミニマムなBuilder

最小構成のBuilderを実装するため、まずはパッケージを作る。

```bash
$ dart create minimum_builder
$ cd minimum_builder
```

`dart create`で作られたダミーのコードを消す。

```bash
$ code . # remove dummy codes
```

buildなどの依存するパッケージをインストールする。buildのみが必要な依存関係で、build_runnerとbuild_configは開発のみに必要な依存関係となる。

```bash
$ dart pub add build dev:build_runner dev:build_config
```

## build.yaml

build.yamlにビルドのための設定を書く。

```bash
$ code build.yaml
```

それぞれの設定項目の詳細については[公式ドキュメント](https://github.com/dart-lang/build/blob/master/docs/build_yaml_format.md)に書かれている。

```yaml
targets:
  $default:
    builders:
      minimum_builder|todo_builder:
        generate_for:
          - example/*
        enabled: True

builders:
  todo_builder:
    import: 'package:minimum_builder/minimum_builder.dart'
    builder_factories: ['todoBuilder']
    build_extensions:
      .dart:
        - .g.dart
    build_to: source
    auto_apply: dependents
```

- `generate_for`: マッチするファイルがビルダーの入力として渡される。
- `builder_factories`: `BuilderOptions`を受け取って`Builder`を返す関数を指定する。ここで自分が実装するビルダーを返すようにする。
- `build_extensions`: ビルドの入力となるファイルの拡張子とその出力のマップ。

## builderの実装

`Builder`インターフェイスを実装するクラスにコードの生成処理を実装する。

```bash
$ code lib/src/todo_builder.dart
```

```dart
import 'dart:async';

import 'package:build/build.dart';

class TodoBuilder implements Builder {
  @override
  FutureOr<void> build(BuildStep buildStep) async {
    final newInputId = buildStep.inputId.changeExtension('.g.dart');
    await buildStep.writeAsString(newInputId, '// TODO: implement');
  }

  @override
  Map<String, List<String>> get buildExtensions => {
      '.dart': ['.g.dart'],
    };
}
```

`Builder`インターフェイスが実装を要求するメソッドが2つある。

- `build()`: 引数に渡される`BuildStep`を利用して、コード生成を行う。`inputId`が入力となるファイルを表している。`BuildStep.writeAsString()`を使うことでファイルに生成したコードを書き込める。ここではコメントを書いているだけだけど、入力したファイルを使って処理した結果を書き込むことになる。
- `buildExtensions`: build.yamlでも指定したマップをここでも指定する必要がありそう。

## build_factoriesの実装

build.yamlの`build_factories`で指定した関数で実装したビルダーを返すようにする。

```bash
$ code lib/minimum_builder.dart
```

```dart
import 'package:build/build.dart';
import 'src/todo_builder.dart';

Builder todoBuilder(BuilderOptions options) => TodoBuilder();
```

# 試してみる

build.yamlで`generate_for`に`example/*`と指定したので、ダミーのコードを置いて試してみる。

```bash
$ mkdir example
$ touch example/example.dart
$ dart run build_runner run
```

`example/example.g.dart`が生成されていることがわかる。

```dart
// TODO: implement
```

# まとめ
ほぼなにもしないビルダーを作ってみて、build_runnerによって実行可能なビルダーを実装する方法を理解できた。あとは、`Builder`を実装するクラスで入力として受け取ったファイルを元にコードを生成する実装を書いていけば、自分オリジナルのビルダーを実装できるだろう。

今回は触れなかったけど、[source_gen](https://pub.dev/packages/source_gen)という別のパッケージを使うことでビルダーをより簡単に実装できるようになるため、機会があれば別の記事に使い方をまとめてみたいと思う。
