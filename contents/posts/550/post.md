---
title: eslintと仲良くなりたい(2)
time: 2024-11-23 13:40
tags: ['javascript']
---

# 前回のおさらい
[前回](/posts/549)、eslintの設定をゼロから書き始めて以下のような設定になった。

```js
import eslint from "@eslint/js";
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
  eslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "no-var": "error",
    },
  },
];
```

サンプルコードはこれ。

```js
var me = 'naoty'
console.log('hello')
```

`recommended`にはクォーテーションや文末のセミコロンの有無などの見た目に関するルールが含まれておらずdeprecatedになっているため、今回はそれをprettierで設定してみたい。

# prettier
eslintがlinterであるのに対して、prettierはformatterということになっている。なので、構文上のエラーを見つけるよりもコードの見た目に関する問題を見つけることが主目的になっている。

prettierはデフォルトで`node_modules`は無視してくれるが、自動生成される`package-lock.json`はフォーマットの対象になってしまうため、`.prettierignore`で無視しておく。

```gitignore
package-lock.json
```

prettierを実行してみる。`--write`をつけないと標準出力に対象のコードをすべて出力してしまうので注意。

```sh
% npx prettier . --write
eslint.config.js 33ms (unchanged)
main.js 3ms
package.json 1ms (unchanged)
README.md 17ms (unchanged)
```

`main.js`だけが変更されたようなので見てみると、確かにダブルクォーテーションに変更され、文末セミコロンがついている。

```diff
-var me = 'naoty'
+var me = "naoty";
-console.log('hello')
+console.log("hello");
```

# eslintとprettierのコンフリクト
eslintにはdeprecatedではあるものの`quotes`や`semi`といった見た目に関するルールが一部存在しており、これらはprettierのルールと重複している。

そこで、あえてeslintの設定とprettierの設定がコンフリクトするようにしてみる。prettierはデフォルトでダブルクォーテーションを適用するため、eslintではシングルクォーテーションを強制させる。

```diff
 import eslint from "@eslint/js";
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
   eslint.configs.recommended,
   {
     rules: {
       "no-unused-vars": "off",
       "no-var": "error",
+      quotes: ["error", "single"],
     },
   },
 ];
```

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:1   error  Unexpected var, use let or const instead  no-var
  1:12  error  Strings must use singlequote              quotes
  2:13  error  Strings must use singlequote              quotes

✖ 3 problems (3 errors, 0 warnings)
  3 errors and 0 warnings potentially fixable with the `--fix` option.
```

さきほどprettierによってダブルクォーテーションに修正されたため、eslintではエラーになってしまう。

これは簡単な例ではあるが、eslintのルールとprettierのルールは非常に多いため、これらがコンフリクトしないように設定するのは難しい。

そこで[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)を使う。[実装](https://github.com/prettier/eslint-config-prettier/blob/main/index.js)を見ると一目瞭然なんだけど、これはprettierと重複するeslintのルールを無効にするだけのパッケージになっている。

さっそくこれを使ってコンフリクトを解消してみる。

```diff
 import eslint from "@eslint/js";
+import prettier from "eslint-config-prettier";
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
   eslint.configs.recommended,
   {
     rules: {
       "no-unused-vars": "off",
       "no-var": "error",
       quotes: ["error", "single"],
     },
   },
+  prettier,
 ];
```

`rules`はあとに設定されたものを優先するため、prettier用のconfigは一番最後にすることで確実にコンフリクトするルールを無効にする。

もう一度eslintを実行すると、コンフリクトが解消されたことがわかる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/main.js
  1:1  error  Unexpected var, use let or const instead  no-var

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

最後にコンフリクトを再現させるために追加したルールを消しておく。

```diff
 import eslint from "@eslint/js";
 import prettier from "eslint-config-prettier";
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
   eslint.configs.recommended,
   {
     rules: {
       "no-unused-vars": "off",
       "no-var": "error",
-      quotes: ["error", "single"],
     },
   },
   prettier,
 ];
```

また、`no-var`のエラーが出ている部分も修正しておく。

```diff
-var me = "naoty";
+const me = "naoty";
 console.log("hello");
```

# 補足：eslint-plugin-prettierについて
eslintとprettierのコンフリクトを解消するためにeslint-config-prettierを使ったが、似たようなパッケージに[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)というものがある。

こちらはeslintの実行中に内部的にprettierを呼び出し、その結果をeslintと同じフォーマットで出力してくれる。また、eslint-config-prettierと同じ設定も適用されるようになっているため、同様にコンフリクトを解消できる。

ただ、prettierの[ドキュメント](https://prettier.io/docs/en/integrating-with-linters)で書いてある通り、内部的にprettierを呼ぶ設計のため直接prettierを実行するよりも遅く、壊れやすいという問題があるため、おすすめされていない。

eslint-config-prettierでコンフリクトする設定を無効化し、eslintとprettierはそれぞれ呼び出すのが推奨されていると理解した。

# To Be Continued...
今回の設定で構文上の問題はeslintでチェックし、フォーマットの問題はprettierでチェックできるようになった。

次はTypeScript用の設定をおこない、より実践的な設定にアップデートしていきたいです。

[その(3)](/posts/551)
