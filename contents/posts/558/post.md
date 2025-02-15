---
title: React RouterでStrict CSPに対応する
time: 2025-02-15 13:28
tags: ['react-router']
---

React Router v7でドメインではなくノンスを使った[Strict CSP](https://web.dev/articles/strict-csp?hl=ja)を実装した。

ReactおよびReact Routerが生成する`<script>`タグに対して`nonce`属性を付与するには、以下の4箇所に`nonce`を指定する必要があった。

- `<ScrollRestoration />`
- `<Scripts />`
- `<ServerRouter />`
- `renderToPipeableStream()`

これらに付与しつつ、`Content-Security-Policy`ヘッダーにノンスを設定する必要があった。

# root.tsx

```tsx
export function Layout({ children }) {
  const nonce = useContext(NonceContext);

  return (
    <html lang="ja">
      <head>
        {/* snip */}
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
```

- root.tsxにある`<ScrollRestoration />`と`<Scripts />`はReact Routerが提供する`<script>`タグを生成しているが、これらのコンポーネントには`nonce`を渡せるようになっており、渡すとレンダリングされた`<script>`タグに`nonce`属性が設定される。
- ノンスは下で見るようにentry.server.tsxで生成する必要があるため、コンポーネントで受け取るために`useContext`を利用している。

# entry.server.tsx

```tsx
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  // ...

  const nonce = generateNonce();
  responseHeaders.set("Content-Security-Policy", [
    "default-src 'self';",
    `script-src 'nonce-${nonce}' 'strict-dynamic';`,
    "style-src 'self' 'unsafe-inline';",
    "object-src 'none';",
    "base-uri 'none';",
  ].join(""));

  const { pipe, abort } = renderToPipeableStream(
    <NonceContext.Provider value={nonce}>
      <ServerRouter
        context={routerContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceContext.Provider>,
    {
      // ...
      nonce,
    },
  );

  setTimeout(abort, streamTimeout + 1000);
}
```

- `<ServerRouter />`はコンポーネントをサーバーでレンダリングする際のエントリーポイントになっているコンポーネント。ドキュメントには記載がないが、実はここにも`nonce`を渡せるようになっており、渡さないとエラーが出る。
- `renderToPipeableStream()`はReactが提供するAPIで、ReactがHTMLをストリーミングするために使う。`<Suspense>`の`fallback`属性で指定したコンポーネントを本来のコンポーネントに置き換えるためにインラインの`<script>`タグが使われる（[参考](https://ja.react.dev/reference/react-dom/server/renderToPipeableStream#streaming-more-content-as-it-loads)）ため、ここにも`nonce`属性が必要になるが、引数に`nonce`を渡すことで解決する。
- `Content-Security-Policy`ヘッダーに`nonce`を設定することでStrict CSPが有効になる。
