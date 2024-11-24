---
title: eslintと仲良くなりたい(3)
time: 2024-11-23 22:28
tags: ['javascript']
---

# 前回のおさらい
[前回](/posts/550)、prettierとのコンフリクトを解消するための設定を追加しコードスタイルについてはprettierでフォーマットするようにできた。

```js
import js from "@eslint/js";
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
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "no-var": "error",
    },
  },
  prettier,
];
```

サンプルコードはこれ。

```ts
const me = "naoty";
console.log("hello");
```

今回はTypeScriptのための設定を追加していく。

# 事前準備
TypeScriptの環境を簡単にセットアップするためviteを使い、今まで使っていたサンプルコードも拡張子を`*.ts`に変更する。

この時点でeslintを実行するとwarningになる。

```sh
% npx eslint src/main.ts
/home/naoty/repos/localhost/hello-eslint/src/main.ts
  0:0  warning  File ignored because no matching configuration was supplied

✖ 1 problem (0 errors, 1 warning)
```

TypeScriptのための設定がないため、無視されてしまうようだ。

# typescript-eslint
[typescript-eslint](https://typescript-eslint.io/)を使うとTypeScriptのコードに対してeslintを実行できるようになる。

```diff
 import eslint from "@eslint/js";
 import prettier from "eslint-config-prettier";
 import globals from "globals";
+import tseslint from "typescript-eslint";
 
-export default [
+export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   eslint.configs.recommended,
+  tseslint.configs.recommended,
   {
     rules: {
       "no-unused-vars": "off",
       "no-var": "error",
     },
   },
   prettier,
-];
+); 
```

`config`関数はflat configに型情報を付与するためのユーティリティ関数であり、実行結果は変わらないとのこと。typescript-eslintが提供するルールセットにもeslintと同じく推奨設定があるため、これを追加した。

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/src/main.ts
  1:7  error  'me' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)
```

今度は無視されずにエラーが出るようになった。`no-unused-vars`は無効にしていたが、typescript-eslint版のルールが別にあるようなので、同じく無効にしてみる。

```diff
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   js.configs.recommended,
   tseslint.configs.recommended,
   {
     rules: {
-      "no-unused-vars": "off",
+      "@typescript-eslint/no-unused-vars": "off",
       "no-var": "error",
     },
   },
   prettier
 );
```

```sh
% npx eslint
```

エラーがなくなった。

# 他の推奨設定
typescript-eslintには`recommended`以外にもいくつか推奨設定のルールセットがある。[ここ](https://typescript-eslint.io/users/configs/#recommended-configurations)に整理されている。

## recommended-type-checked
`recommended`と[この設定](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/typescript-eslint/src/configs/recommended-type-checked-only.ts)を追加したもの。

追加された設定をいくつか見てみる。

- [`await-thenable`](https://typescript-eslint.io/rules/await-thenable/): `Promise`のような`then`メソッドを持つオブジェクト以外に対して`await`を呼び出そうとしたらエラーにする。
- [`no-unsafe-return`](https://typescript-eslint.io/rules/no-unsafe-return/)などの`no-unsafe-*`: `any`型を許可しないルールたち
- [`only-throw-error`](https://typescript-eslint.io/rules/only-throw-error/): `Error`オブジェクトのみ`throw`を許可する。Remixだと`Response`を`throw`することがあるので、オプションで一部許容したいかも。

こう見ると、追加してよさそうなルールなので、使ってみたい。

```diff
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   js.configs.recommended,
-  tseslint.configs.recommended,
+  tseslint.configs.recommendedTypeChecked,
   {
     rules: {
       "@typescript-eslint/no-unused-vars": "off",
       "no-var": "error",
     },
   },
   prettier
 );
```

実行してみる。

```sh
Oops! Something went wrong! :(

ESLint: 9.15.0

Error: Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires type information, but don't have parserOptions set to generate type information for this file. See https://typescript-eslint.io/getting-started/typed-linting for enabling linting with type information.
Parser: typescript-eslint/parser
```

エラーになってしまった。メッセージを読むと、型情報を生成するために必要なパーサーのオプションが設定されていないとのことだった。リンク先を読んで設定を追加する。

```diff
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
+      parserOptions: {
+        projectService: true,
+        tsconfigRootDir: import.meta.dirname,
+      },
     },
   },
   js.configs.recommended,
   tseslint.configs.recommendedTypeChecked,
   {
     rules: {
       "@typescript-eslint/no-unused-vars": "off",
       "no-var": "error",
     },
   },
   prettier
 );
```

また`tsconfig.json`も必要になるので追加する。[@tsconfig/node22](https://www.npmjs.com/package/@tsconfig/node22)を使って楽をする。

```diff
+{
+  "extends": "@tsconfig/node22/tsconfig.json",
+  "compilerOptions": {
+    "lib": ["es2023", "dom"],
+  }
+}
```

`console`に型情報を付与するため`lib`に`dom`を追加してある。

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/eslint.config.js
  0:0  error  Parsing error: /home/naoty/repos/localhost/hello-eslint/eslint.config.js was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject

✖ 1 problems (1 errors, 0 warnings)
```

`eslint.config.js`のような`*.js`のファイルについてパースに失敗している。`*.ts`のファイルにのみ`recommended-type-checked`のルールを適用したいので、`files`を使って適用するファイルを絞る。

```diff
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
-      parserOptions: {
-        projectService: true,
-        tsconfigRootDir: import.meta.dirname,
-      },
     },
   },
   js.configs.recommended,
-  tseslint.configs.recommendedTypeChecked,
   {
     rules: {
-      "@typescript-eslint/no-unused-vars": "off",
       "no-var": "error",
     },
   },
+  {
+    files: ["**/*.ts"],
+    languageOptions: {
+      parserOptions: {
+        projectService: true,
+        tsconfigRootDir: import.meta.dirname,
+      },
+    },
+    extends: [tseslint.configs.recommendedTypeChecked],
+    rules: {
+      "@typescript-eslint/no-unused-vars": "off",
+    },
+  },
   prettier
 );
```

`files`でTypeScriptのファイルにのみrecommended-type-checkedや`parserOptions`を適用している。[`extends`](https://typescript-eslint.io/packages/typescript-eslint/#flat-config-extends)はtypescript-eslintの`config()`関数によって追加されているプロパティで、これにより定義済みの設定を`rules`で上書きする設定が書きやすくなっている。

実行すると失敗しなくなった。

```sh
% npx eslint
```

## strict, strict-type-checked
`recommended`に加えて厳しいルールを追加したルールセットで、TypeScriptに自信のあるチームには推奨とのことだった。

自信ないのでいったん見送る。

# To Be Continued...
最後にeslintの設定も`files`を使った書き方に体裁をそろえる。

```diff
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
-  js.configs.recommended,
-  {
-    rules: {
-      "no-var": "error",
-    },
-  },
+  {
+   files: ["**/*.{js,ts}"],
+   extends: [eslint.configs.recommended],
+   rules: {
+     "no-var": "error",
+   },
+  },
   {
     files: ["**/*.ts"],
     languageOptions: {
       parserOptions: {
         projectService: true,
         tsconfigRootDir: import.meta.dirname,
       },
     },
     extends: [tseslint.configs.recommendedTypeChecked],
     rules: {
       "@typescript-eslint/no-unused-vars": "off",
     },
   },
   prettier
 );
```

今回はTypeScript向けにeslintを設定しつつ、その中で`files`によって特定のファイルのみに設定を適用する書き方についても見ることができた。

次回はReactの開発で便利なeslintの設定を見ていきたいです。
