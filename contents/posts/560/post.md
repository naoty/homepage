---
title: React Routerでパンくずリスト
time: 2025-03-21 10:09
tags: ['react-router']
---

Remix時代の情報でだいたい実装できるけど、細かい工夫が必要になったので、もう少し踏み込んだ記事を書きたい。

# handle
各ルートモジュールの `handle` を使い、ルートが持つメタデータをexportする。あとでパンくずリストで使う。

```ts
export const handle: Handle = {
  breadcrumb: {
    title: "一覧画面",
    path: () => "/users",
  },
};
```

```ts
export const handle: Handle = {
  breadcrumb: {
    title: "詳細画面",
    path: (params) => `/users/${params.id}`,
  },
};
```

`loader` のように `handle` に型が生成されるわけではないので、定義しておくといい。

```ts
export interface Handle {
  breadcrumb: {
    title: string;
    path: (params?: Params) => string | null;
  };
}
```

`Params` 型はReact Routerが公開している型で任意の `string` 型のプロパティに対して `string` 型の値を返す。

# useMatches
パンくずリストのコンポーネント内では `useMatches` を使い、URLにマッチしているルートモジュール `handle` を参照する。この際、 `handle` は `unknown` 型なので、型ガード関数を使う。

```ts
function isHandle(handle: unknown): handle is Handle {
  return (
    typeof handle === "object" && handle !== null && "breadcrumb" in handle
  );
}
```

`useMatches` を使って各ルートモジュールの `handle` からパンくずリストで使うデータを収集する。 `match.params` が `Params` 型になっているため、これでパスパラメータを含むパスを生成できる。

```ts
const items = useMatches()
  .map((match) =>
    isHandle(match.handle)
      ? {
          title: match.handle.breadcrumb.title,
          path: match.handle.breadcrumb.path(match.params),
        }
      : null,
  )
  .filter((match) => match !== null);
```

要件次第ではあるけど、現在のURLにマッチするリンクはリンクにしないなどの処理が必要になると思うので、 `useLocation` でURLを参照することもあるだろう。

# 感想
各ルートモジュールから生成される型情報をもう少し活用できたらよかったけど、いったんこれでよしとした。 `handle` で定義するよりもこういったメタデータも生成してほしい気がする。
