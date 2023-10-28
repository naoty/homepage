---
title: webpackerにjestを導入する
time: 2018-03-20T19:56:00+0900
tags: ["rails"]
---
webpackerを使ったRailsプロジェクトにjestを導入してみた。jestをインストールしてテストを実行してみると、以下のようなエラーがおきた。

```
({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import xxx from './xxx';
                                                                                         ^^^^^^

SyntaxError: Unexpected token import
  at ScriptTransformer._transformAndBuildScript (node_modules/jest-runtime/build/script_transformer.js:316:17)
```

importがコンパイルできていないようだ。webpackerが生成する`.babelrc`では、以下のように設定されている。

```json
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": "> 1%",
        "uglify": true
      },
      "useBuiltIns": true
    }],
    "react"
  ]
}
```

`"modules": false`と設定されているため、`import`の変換が行われないようになっている。これはwebpackによって`import`文を処理するためにbabelでは`import`の変換を行わないようにしているんだと思う。

しかし、jestを実行する場合はwebpackによる処理は行われないため、`import`が変換されずエラーになっていたと考えられそう。

そこで、以下の設定を`.babelrc`に追加したところ直った。

```json
{
  "env": {
    "test": {
      "presets": [
        ["env", { "modules": "commonjs" }]
      ]
    }
  }
}
```

jestは実行時に自動的に`NODE_ENV`を`test`に設定するため、これでうまくいく。


