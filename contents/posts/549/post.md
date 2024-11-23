---
title: eslintと仲良くなりたい(1)
time: 2024-11-23 09:32
tags: ['javascript']
---

どうにもeslintに苦手意識があって眠れない夜を過ごしているので、手を動かしながらステップバイステップでeslintを理解していく試みです。長編になりそうなので、何回かに分けて書きます。

以下はeslint v9、Flat configを前提にします。

# 最初の設定
エラーになりそうなサンプルのコードを用意する。

```js
var name = 'naoty'
console.log('hello')
```

シンプルな設定を書く。`rules`以下にルール名をキー、severityを値にわたす。

- `off`または`0`: 無効
- `warn`または`1`: warnにする
- `error`または`2`: errorにする

```diff
+export default [
+  {
+    rules: {
+      "no-unused-vars": "error",
+    },
+  },
+];
```

実行は単に`eslint`を実行すればいい。npm scriptは設定してないので、以降は`npx`コマンドを経由して実行する。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:5  error  'name' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

確かにエラーになった。

# ルールを調べる
https://eslint.org/docs/latest/rules/ にルールがまとまっている。ダブルクォーテーションに統一したいので、[quotes](https://eslint.org/docs/latest/rules/quotes)というルールを適用したい。

ルールによってはオプションを指定することができ、値に配列をわたし、第1要素にseverity、第2要素以降にオプションを指定する。

```diff
 export default [
   {
     rules: {
       "no-unused-vars": "error",
+      quotes: ["error", "double"],
     },
   },
 ];
```

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:5   error  'name' is assigned a value but never used  no-unused-vars
  1:12  error  Strings must use doublequote               quotes
  2:13  error  Strings must use doublequote               quotes

✖ 3 problems (3 errors, 0 warnings)
  2 errors and 0 warnings potentially fixable with the `--fix` option.
```

シングルクォーテーションがエラーになった。エラーメッセージに`--fix`オプションで修正可能と書いてあるので修正してみる。

```sh
% npx eslint --fix
/home/naoty/repos/localhost/hello-eslint/main.js
  1:5  error  'name' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

修正可能なエラーは出なくなり、確かにコードがダブルクォーテーションを使うように修正された。

# 推奨設定をつかう
ルールは膨大にあるのでひとつずつ調べて設定するのは大変。なので、eslintには推奨された設定をまとめたものが用意されている。

```diff
+import js from "@eslint/js";

 export default [
+  js.configs.recommended,
-  {
-    rules: {
-      "no-unused-vars": "error",
-      quotes: ["error", "double"],
-    },
-  },
 ];
```

推奨設定に含まれているものは https://eslint.org/docs/latest/rules/ のなかのrecommendedマークがついているもので、[実装](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js)を確認すると、`recommended`は単に`rules`を含むオブジェクトに過ぎないことがわかる。

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:5  error  'name' is assigned a value but never used  no-unused-vars
  2:1  error  'console' is not defined                   no-undef

✖ 2 problems (2 errors, 0 warnings)
```

新しいエラーが出るようになった。

# グローバル変数の設定
`console`や`window`などのグローバル変数は定義していないので、なにも設定しないと未定義エラーとしてみなされてしまう。

こうしたグローバル変数は`languageOptions.globals`という項目で設定できる。キーにはグローバル変数、値には以下のいずれかを設定する。

- `writable`または`true`: 読み書き可
- `readonly`または`false`: 読み取りのみ

```diff
 import js from "@eslint/js";
 
 export default [
+  {
+    languageOptions: {
+      globals: {
+        console: "readonly",
+      },
+    },
+  },
   js.configs.recommended,
 ];
```

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:5  error  'name' is assigned a value but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

未定義エラーは出なくなった。

`console`や`window`といったグローバル変数を調べ上げるのも大変なので、[globals](https://github.com/sindresorhus/globals)というパッケージを使うのが一般的みたいだ。

```diff
 import js from "@eslint/js";
+import globals from "globals";
 
 export default [
   {
     languageOptions: {
       globals: {
-        console: "readonly",
+        ...globals.browser,
+        ...globals.node,
       },
     },
   },
   js.configs.recommended,
 ];
```

`globals`の中身はでかい[JSONファイル](https://github.com/sindresorhus/globals/blob/main/globals.json)になっていて、ここで各環境のグローバル変数が定義されている。

# 推奨設定のカスタマイズ
運用をはじめると、`recommended`で追加したルールを上書きしたり、新しいルールを追加したりしたくなってくる。そんなときは、`rules`はあとに設定されたものを優先するため、`recommended`よりあとにルールを追加するだけでいい。`recommended`の中身は単なる`rules`なので。

`recommended`ではエラーになっていた未使用の変数を無視するようにし、`recommended`では特に触れてなかった`var`の使用を禁止するようにする。

```diff
 import js from "@eslint/js";
 import globals from "globals";
 
 export default [
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   js.configs.recommended,
+  {
+    rules: {
+      "no-unused-vars": "off",
+      "no-var": "error",
+    },
+  },
 ];
```

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:1  error  Unexpected var, use let or const instead  no-var

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

未使用の変数は無視され、`var`の使用だけがエラーになった。

# To Be Continued...
ここまではなんとなくわかっている範囲だったので、次回以降いよいよ謎が深まってくるTypeScriptやPrettierをはじめとしたプラグインの設定について書きたいです。

[その(2)](/posts/550)
