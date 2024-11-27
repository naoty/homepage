---
title: eslintと仲良くなりたい(4)
time: 2024-11-26 21:50
tags: ['javascript']
---

# 前回のおさらい
[前回](/posts/551)、TypeScript向けの設定を追加し、TypeScriptのコードもeslintでチェックできるようになった。

```js
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,ts}"],
    extends: [eslint.configs.recommended],
    rules: {
      "no-var": "error",
    },
  },
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
  prettier,
);
```

今回はいよいよ実践的なReactアプリケーションのための設定を追加していく。

# 事前準備
Reactのコードが必要になるので、Reactコンポーネントが動作できるようにセットアップしておく。サンプルコードはこんな感じ。

```jsx
export function Hello() {
  const people = ["naoty", "naoty", "naoty"];
  var unused = "naoty";

  return (
    <ul>
      {people.map((person) => (
        <li>{person}</li>
      ))}
    </ul>
  );
}
```

未使用の変数などエラーになりそうだけど、まだ`*.tsx`のための設定は入っていないため、何もエラーは検出しない。

```sh
% npx eslint
```

# JSXを対象にする
`*.jsx`や`*.tsx`は`files`では対象にしていなかったので、対象に追加する。

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
   {
-    files: ["**/*.{js,ts}"],
+    files: ["**/*.{js,jsx,ts,tsx}"],
     extends: [eslint.configs.recommended],
     rules: {
       "no-var": "error",
     },
   },
   {
-    files: ["**/*.ts"],
+    files: ["**/*.{ts,tsx}"],
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
   prettier,
 );
```

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/src/hello.tsx
  3:3  error  Unexpected var, use let or const instead  no-var

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

従来通り、ルールが適用されてエラーになった。

# eslint-plugin-react
JSXをeslintの対象にできたものの、Reactアプリケーションのためのルールはいっさいないので、[eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)を入れる。

```diff
 import eslint from "@eslint/js";
 import prettier from "eslint-config-prettier";
+import react from "eslint-plugin-react";
 import globals from "globals";
 import tseslint from "typescript-eslint";
 
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   {
     files: ["**/*.{js,jsx,ts,tsx}"],
     extends: [eslint.configs.recommended],
     rules: {
       "no-var": "error",
     },
   },
   {
     files: ["**/*.{ts,tsx}"],
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
+  {
+    files: ["**/*.{jsx,tsx}"],
+    extends: [
+      react.configs.flat.recommended,
+      react.configs.flat["jsx-runtime"],
+    ],
+  },
   prettier,
 );
```

`*.jsx`または`*.tsx`についてはeslint-plugin-reactが提供するルールを適用するようにした。

`react.configs.flat.recommended`には`react/jsx-runtime`のimport文がないとエラーにするルールが含まれているのだけど、React v17以降はimport文が必要なくなったため、このルールを無効にする`react.configs.flat["jsx-runtime"]`を追加する必要がある。

なお、eslintには`languageOptions.parserOptions.ecmaFeatures.jsx`というオプションがあり、パーサーがJSXをサポートするようになるらしいのだけど、この設定は`react.configs.flat.recommended`に[含まれている](https://github.com/jsx-eslint/eslint-plugin-react/blob/4ef92b49ab70eacb913afa394209ac5a24522fad/index.js#L35-L66)ため自分で設定する必要はない。

実行してみる。

```sh
% npx eslint
Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .

/home/naoty/repos/localhost/hello-eslint/src/hello.tsx
  3:3  error  Unexpected var, use let or const instead    no-var
  8:9  error  Missing "key" prop for element in iterator  react/jsx-key

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

`key`プロパティがないというエラーが出るようになり、Reactのルールが適用されていることがわかる。

Reactのバージョンが指定されていないというwarningが出ているので、設定する。

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
   {
     files: ["**/*.{js,jsx,ts,tsx}"],
     extends: [eslint.configs.recommended],
     rules: {
       "no-var": "error",
     },
   },
   {
     files: ["**/*.{ts,tsx}"],
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
   {
     files: ["**/*.{jsx,tsx}"],
     extends: [
       react.configs.flat.recommended,
       react.configs.flat["jsx-runtime"],
     ],
+    settings: {
+      react: { version: "detect" },
+    },
   },
   prettier,
 );
```

`"detect"`という値にしておくとインストールしたReactのバージョンを使ってくれるらしい。

実行してみるとwarningが出なくなった。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/src/hello.tsx
  3:3  error  Unexpected var, use let or const instead    no-var
  8:9  error  Missing "key" prop for element in iterator  react/jsx-key

✖ 2 problems (2 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

# eslint-plugin-react-hooks
ここでサンプルコードをひとつ増やす。

```jsx
import { useState } from "react";

export function Button({ title }: { title?: string }) {
  if (title == undefined) {
    return <a></a>;
  }

  const [count, setCount] = useState(0);
  return (
    <a onClick={() => setCount(count + 1)}>
      {title} {count}
    </a>
  );
}
```

このコードは条件次第では`useState`が呼ばれないことがあり、hooksの使い方としては誤っているんだけど、eslintでは検知できない。

こうしたhooksのルールをeslintの設定として設定するには[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)を使う。

```diff
 import eslint from "@eslint/js";
 import prettier from "eslint-config-prettier";
 import react from "eslint-plugin-react";
+import reactHooks from "eslint-plugin-react-hooks";
 import globals from "globals";
 import tseslint from "typescript-eslint";
 
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   {
     files: ["**/*.{js,jsx,ts,tsx}"],
     extends: [eslint.configs.recommended],
     rules: {
       "no-var": "error",
     },
   },
   {
     files: ["**/*.{ts,tsx}"],
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
   {
     files: ["**/*.{jsx,tsx}"],
     extends: [
       react.configs.flat.recommended,
       react.configs.flat["jsx-runtime"],
     ],
+    plugins: {
+      "react-hooks": reactHooks,
+    },
+    rules: {
+      ...reactHooks.configs.recommended.rules,
+    },
     settings: {
       react: { version: "detect" },
     },
   },
   prettier,
 );
```

`extends`に渡せるのはflat configの形式のオブジェクトなのだけど、eslint-plugin-react-hooksの[実装](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/index.js)を見ると微妙に異なるため、設定の仕方を工夫する必要がある。

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/src/button.tsx
  8:29  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?  react-hooks/rules-of-hooks

/home/naoty/repos/localhost/hello-eslint/src/hello.tsx
   5:3   error  Unexpected var, use let or const instead    no-var
  11:11  error  Missing "key" prop for element in iterator  react/jsx-key

✖ 3 problems (3 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

`useState`の使い方についてエラーメッセージが出るようになった。

# eslint-plugin-jsx-a11y
先のサンプルコードではボタンとして`<a>`タグを使っており、アクセシビリティの観点では不十分なマークアップになっているのだけど、そういったアクセシビリティ上の問題もeslintで検出するには[eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)を使うといい。

```diff
 import eslint from "@eslint/js";
 import prettier from "eslint-config-prettier";
+import jsxA11y from "eslint-plugin-jsx-a11y";
 import react from "eslint-plugin-react";
 import reactHooks from "eslint-plugin-react-hooks";
 import globals from "globals";
 import tseslint from "typescript-eslint";
 
 export default tseslint.config(
   {
     languageOptions: {
       globals: {
         ...globals.browser,
         ...globals.node,
       },
     },
   },
   {
     files: ["**/*.{js,jsx,ts,tsx}"],
     extends: [eslint.configs.recommended],
     rules: {
       "no-var": "error",
     },
   },
   {
     files: ["**/*.{ts,tsx}"],
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
   {
     files: ["**/*.{jsx,tsx}"],
     extends: [
       react.configs.flat.recommended,
       react.configs.flat["jsx-runtime"],
+      jsxA11y.flatConfigs.recommended,
     ],
     plugins: {
       "react-hooks": reactHooks,
     },
     rules: {
       ...reactHooks.configs.recommended.rules,
     },
     settings: {
       react: { version: "detect" },
     },
   },
   prettier,
 );
```

`eslint-plugin-jsx-a11y`はflat configに対応しているため、そのまま`extends`にわたすだけで設定ができる。

実行してみる。

```sh
% npx eslint
/home/naoty/repos/localhost/hello-eslint/src/button.tsx
   5:12  error  Anchors must have content and the content must be accessible by a screen reader                                                                                                                                                                                                                                                                                           jsx-a11y/anchor-has-content
   5:12  error  The href attribute is required for an anchor to be keyboard accessible. Provide a valid, navigable address as the href value. If you cannot provide an href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid
   8:29  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?                                                                                                                                                                                react-hooks/rules-of-hooks
  10:5   error  Anchor used as a button. Anchors are primarily expected to navigate. Use the button element instead. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md                                                                                                                                                             jsx-a11y/anchor-is-valid
  10:5   error  Visible, non-interactive elements with click handlers must have at least one keyboard listener                                                                                                                                                                                                                                                                            jsx-a11y/click-events-have-key-events
  10:5   error  Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element                                                                                                                                                                         jsx-a11y/no-static-element-interactions

/home/naoty/repos/localhost/hello-eslint/src/hello.tsx
   5:3   error  Unexpected var, use let or const instead    no-var
  11:11  error  Missing "key" prop for element in iterator  react/jsx-key

✖ 8 problems (8 errors, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

アクセシビリティ上の問題がたくさんエラーとして検出されるようになった。

# To Be Continued...
今回はReact向けのeslintの設定をいくつか見てきた。これでReactの開発も安心して進められそう。

ここまでeslintの設定をゼロから始めて、Prettierとの共存のための設定や、TypeScript、React向けの設定をステップバイステップで進めてきたのだけど、次は鬼門ともいえそうなimport文まわりの設定をいよいよ見ていきたいと思います。
