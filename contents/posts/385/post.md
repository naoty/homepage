---
title: Nuxtで明示的にルーティングを定義する
time: 2019-10-04 19:10
tags: ["nuxt"]
---

# 背景
このホームページにタグごとの記事一覧ページを追加しようとしている。パスは`/posts/:tag/`にしたい。

```
/
├─ index.html
└─ posts
   ├─ 1.html
   ├─ 2.html
   ├─ 3.html
   ├─ index.html
   ├─ nuxt
   │  └─ index.html
   └─ vue
      └─ index.html
```

ディレクトリ構造でいうと、↑のような感じにしたい。

# 問題
`pages/posts/_tag/index.vue`のようなファイルを作成しても、すでに存在するパス`/posts/:id.html`（記事ページ）とルーティングが衝突してしまう。

Nuxt.jsは暗黙的にルーティングを生成するので、ルーティングの優先度やルートの細かい制約が設定できない。

# 解決策
[@nuxtjs/router](https://github.com/nuxt-community/router-module)を使って明示的にルーティングを設定する。

```javascript
// nuxt.config.js
export default {
  modules: ["@nuxtjs/router"]
}
```

デフォルトの設定では、`pages/`ディレクトリに基づいた暗黙的なルーティングの生成は無効化してくれる。そして`./router.js`で明示的にルーティングを定義する。

```javascript
// router.js
import Vue from "vue";
import Router from "vue-router";

import Index from "./pages/index";
import PostsIndex from "./pages/posts/index";
import PostId from "./pages/posts/_id";
import PostsTagIndex from "./pages/posts/_tag/index";

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      {
        path: "/",
        component: Index
      },
      {
        path: "/posts/",
        component: PostsIndex
      },
      {
        path: "/posts/:id(\\d+)\\.html",
        component: PostId
      },
      {
        path: "/posts/:tag/",
        component: PostsTagIndex
      }
    ]
  });
}
```

必要なのは、vue-routerのインスタンスを返す`createRouter()`という関数を`export`するだけ。あとは、vue-routerでルーティングを定義するだけなので、正規表現を使ったルーティングもできる。
