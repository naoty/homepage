---
title: ブログをReact Router v7で作り直した
time: 2024-10-14 18:00
tags: ['meta', 'remix']
---

11ヶ月ぶりにホームページおよびブログを作り直した。今回でv7となる。Next.jsで作ったv6は短命だった。

| バージョン | 期間 | フレームワーク | 記録 |
| --- | --- | --- | --- |
| v1 | 2017 ~ 2018 | gulp | [304](/posts/304) |
| v2 | 2018 ~ 2019 | Gatsby.js | [342](/posts/342) |
| v3 | 2019 ~ 2020 | Nuxt.js | [384](/posts/384) |
| v4 | 2020 ~ 2021 | Gatsby.js | [401](/posts/401) |
| v5 | 2021 ~ 2023 | Ruby（フルスクラッチ） | [434](/posts/434) |
| v6 | 2023 ~ 2024 | Next.js | [528](/posts/528) |
| v7 | 2024 ~ | React Router v7 | 547 |

# React Router v7
最近、Remixをさわるようになり、技術書を写経したり、家族で使うための簡単なWebサービスを作ったりしていた。

そんななか、Remix v3あらためReact Router v7のpre release版がリリースされ、pre-renderingがサポートされたと聞いたので、さっそくブログを作ってみることにした。

## pre-render
pre-renderのためには、vite.config.tsで以下のようにpre-renderしたいパスを返す関数を定義すればいい。

```ts
export default defineConfig({
  plugins: [
    reactRouter({
      async prerender() {
        const postFilePaths = await glob("./contents/posts/**/post.md");
        const postPaths = postFilePaths
          .map((path) => dirname(path).split("/").pop())
          .map((id) => `/posts/${id}`);
        return ["/", "/posts", ...postPaths];
      },
    }),
  ],
});
```

## 型定義ファイルの生成
React Router v7から`loader()`やコンポーネントなどに渡される引数に型がつくようになった。

```tsx
import type * as Route from "./+types.post";

export async function loader({ params }: Route.LoaderArgs) {
  //
}
```

この`./+types.post`のような型定義ファイルはどのように生成すればいいのか、少し調べるのに手間取ったけど、以下のようなコマンドを実行してやればいいことがわかった。

```shell
react-router typegen
```

# markdownファイルのHMR
ブログ記事の作成中にpreviewサーバーに即座に変更を反映させるため、変更を検知してHMRを実行する仕組みが必要になる。v6ではNext.jsと併用して[Contentlayer](https://contentlayer.dev/)を使っていた。

今回はViteのエコシステムに乗っかることで実現した。ご存知の通りViteはHMRサーバーを提供しており、`import`先のファイルが変更されれば依存するツリーをすべてHMRで置き換えてくれる。Vite単独ではmarkdownファイルの`import`はおこなえないため、[vite-plugin-markdown](https://github.com/hmsk/vite-plugin-markdown)を使わせていただいた。これによりmarkdownファイルを`import`することが可能になり、markdownファイルの変更が即座に反映されるようになった。

記事一覧画面についてもViteが提供する`import.meta.glob()`を使うことでディレクトリ以下のすべてのmarkdownファイルの変更を検知し、変更が反映されるようになった。

以前はContentlayerのような別のツールを用意する必要があったが、React Routerが使っているViteにそのままpluginを追加するだけで実現できて、とても快適になった。

# スタイル
これまでのブログではミニマルで余計な装飾をつけないスタイルを好んで実装していたけど、今回は趣向を変えて自分にとってのレトロなWebサイトを意識してスタイルを実装した。
