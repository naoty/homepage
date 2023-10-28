---
title: ミニマムなwebpack loader
time: 2019-09-18T13:04:00+0900
tags: ["javascript"]
---

webpack loaderを自作したいと思っていろいろ試してみた。以下では、ミニマムにwebpack loaderを自作する手順をまとめてみた。

# 1. webpackのセットアップ
webpackとCLIをインストールする。

```
$ npm install -D webpack webpack-cli
```

エントリーポイントと依存するアセットを`dist/bundle.js`にまとめるように設定する。

```js
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  mode: "development"
};
```

適当なエントリーポイントを用意する。あとでここからMarkdownを`import`していく。

```js
// src/index.js
console.log("Here is entrypoint.");
```

webpackが実行できるか確認する。

```
$ npx webpack
$ node dist/bundle.js
Here is entrypoint.
```

# 2. 何もしないloader
`import`するMarkdownテキストを`src/sample.md`に用意する。

```markdown
# header
Here is sample markdown text.
```

エントリーポイントでこのMarkdownテキストを`import`する。

```diff
// src/index.js
-console.log("Here is entrypoint.");
+import contents from "./sample.md";
+console.log(contents);
```

とりあえず何もしないloaderを作る。

```js
// lib/loader.js
module.exports = function(source) {
  return "";
};
```

このままだと`*.md`をwebpackはビルドできないので、さっき作ったloaderで処理するように設定を追加する。

```diff
// webpack.config.js
 module.exports = {
   entry: "./src/index.js",
   output: {
     path: path.resolve(__dirname, "dist"),
     filename: "bundle.js"
   },
-  mode: "development"
+  mode: "development",
+  module: {
+    rules: [
+      {
+        test: /\.md$/,
+        use: [
+          {
+            loader: path.resolve(__dirname, "lib/loader.js")
+          }
+        ]
+      }
+    ]
+  }
 };
```

何がおきるか確認する。

```
$ npx webpack
$ node dist/bundle.js
{}
```

`import contents from "./sample.md"`の結果、`contents`は`{}`になるということがわかった。

# 3. 何かを返すloader
loaderが返す値はどのように使われるのか確かめるため、適当な文字列を返すようにしてみる。

```diff
// lib/loader.js
 module.exports = function(source) {
-  return "";
+  return "foo";
 };
```

`webpack`を実行して生成されたbundle.jsを確認してみると、以下のようになっていた。

```js
// dist/bundle.js
/***/ (function(module, exports) {

eval("foo\n\n//# sourceURL=webpack:///./src/sample.md?");

/***/ })
```

loaderが返した文字列を`eval`でJavaScriptのコードとして実行しているようだ。また、`eval`内では関数に渡された`module`と`exports`が使えるようになっている。

ということは、この`module`を使うことでloaderから何かを`export`できそう。

```diff
// lib/loader.js
 module.exports = function(source) {
-  return "";
+  return `module.exports = ${JSON.stringify({ source })}`;
 }
```

webpackを実行してbundle.jsを確認してみる。

```js
// dist/bundle.js
eval("module.exports = {\"source\":\"# header\\nHere is sample markdown text.\\n\"}\n\n//# sourceURL=webpack:///./src/sample.md?");
```

`src/sample.md`の中身を`export`する文字列が生成できた。最後に`import`できるかも確認する。

```
$ node dist/bundle.js
{ source: '# header\nHere is sample markdown text.\n' }
```

`import contents from "./sample.md"`で確かに`export`したオブジェクトが`import`できていた。

# まとめ
以下のような関数が、ファイルの中身をオブジェクトとして返す機能をもったミニマムなwebpack loaderと言えそう。

```js
module.exports = function(source) {
  return `module.exports = ${JSON.stringify({ source })}`;
};
```

あとは、Markdownのパースなどの機能をここに実装していけばよさそう。

# 参考
他に留意すべき項目はドキュメントにまとまっている。

* https://webpack.js.org/contribute/writing-a-loader/
* https://github.com/webpack/docs/wiki/how-to-write-a-loader 
