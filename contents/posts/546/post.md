---
title: RemixからFirebase Authenticationで認証する
time: 2024-09-21 12:29
tags: ['remix', 'firebase']
---

RemixからFirebase Authenticationを使って認証する実装をしていたのだけど、少しフローが複雑でドキュメントを読んでも理解に時間がかかったので、ブログに整理しておく。

# 認証フロー
一般的なメールアドレスとパスワードによる認証を前提として進める。

![RemixとFirebase Authの間で認証するフローを表したシーケンス図](/posts/546/remix-and-firebase-auth.svg)

1. ブラウザからメールアドレスとパスワードをFirebase Authenticationに送る。認証に成功すると、ユーザーIDやメールアドレスなどを含むクレデンシャルが返ってくる。サーバーではメールアドレスやパスワードを扱わないようにブラウザから送るようにするのがポイント。
1. 受け取ったクレデンシャルからIDトークンと呼ばれるJWTが得られるので、サーバーに送る。
1. サーバーでは受け取ったIDトークンが不正に改ざんされていないかを検証する必要があるため、Firebase Authencationから公開鍵を取得し、IDトークンの署名を確認する。また、公開鍵のレスポンスには`max-age`がセットされているため、適切にキャッシュする。
1. IDトークンがFirebase Authencationの秘密鍵によって署名されたことが確認できたら、IDトークンからセッションCookieを生成し、レスポンスヘッダーの`Set-Cookie`にセットしてブラウザに返す。
1. 以降はサーバーはリクエストヘッダーの`Cookie`からセッションCookieを取得し、そこに含まれるIDトークンを再度検証することで認証状態を維持する。

# 実装
Remixにおける簡易的な実装例を載せる。

## IDトークンの取得

```tsx
// app/routes/login.tsx
export default function Login() {
  const submit = useSubmit();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // formDataからemailとpasswordを取得

    try {
      const idToken = await loginFirebaseAuth(email, password);
      submit({ idToken }, { method: "post" });
    } catch (error) {
      // ...
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit}>
      {/*  snip */}
    </form>
  );
}
```

- Remixの`Form`コンポーネントを使うと入力した値をそのままサーバーに送ってしまうので、`useSubmit`フックを使ってFirebase Authenticationから受け取ったIDトークンを送るようにする。
- `onSubmit`内でFirebase Authenticationとのやり取りを行う。詳細な実装はコンポーネント内には実装せず別途関数を用意しておく。

```ts
// app/modules/firebase.client.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseApp = initializeApp({
  apiKey: "xxx",
  authDomain: "xxx",
  prejectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx",
});

export async function loginFirebaseAuth(email: string, password: string) {
  const firebaseAuth = getAuth(firebaseApp);
  const userCredential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  return await userCredential.user.getIdToken();
}
```

- クライアントのみで実行する意図があるため`*.client.ts`とsuffixを付ける。
- Firebase SDKを使い、アプリを初期化する。`apiKey`などの値はクライアント側で利用されることを意図して設計されており、公開されてもセキュリティ上は問題ないとされている（[参考](https://firebase.google.com/docs/projects/api-keys)）。
- `loginFirebaseAuth()`でFirebase Authenticationとの認証を行い、成功すればIDトークンを取得して返している。

## IDトークンの検証とセッションCookieの生成

```tsx
// app/routes/login.tsx

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  try {
    const headers = await createSessionCookieHeaders(idToken);
    return redirect("/", { headers });
  } catch (error) {
    // ...
  }
}
```

- ルートコンポーネントの`action()`でサーバー側の実装を書く。受け取ったIDトークンが改ざんされていないかを検証しセッションCookieを生成するため、別ファイルに用意してある関数を使う。
- その後生成されたレスポンスヘッダーを付与してリダイレクトする。


```ts
// app/modules/session.server.ts
import { createSessionCookie, verifySessionCookie } from "./firebase.server";

const sessionCookieName = "secret";

export async function createSessionCookieHeaders(idToken: string) {
  const headers = new Headers();
  const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days
  const sessionCookie = await createSessionCookie(idToken, expiresIn);
  headers.append(
    "Set-Cookie",
    `${sessionCookieName}=${sessionCookie}; Max-Age=${expiresIn}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  );
  return headers;
}
```

- セッションを扱うモジュールをサーバーのみで扱いたいので`session.server.ts`と名付ける。
- セッションCookieを生成する関数はFirebase Admin SDKの機能を利用するため、別モジュールを呼び出すようにしている。このモジュールでは`Set-Cookie`ヘッダーに適切な値を設定して返している。

```ts
// app/modules/firebase.server.ts
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

const firebaseApp = admin.initializeApp(
  {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  },
  "sample-app"
);

export async function createSessionCookie(idToken: string, expiresIn: number) {
  return await getAuth(firebaseApp).createSessionCookie(idToken, {
    expiresIn,
  });
}
```

- 先ほど紹介した`firebase.client.ts`とは異なりサーバー側でのみ実行されることを意図しているため、`*.server.ts`とsuffixをつけている。
- クライアント側ではFirebase SDKを使っていたが、サーバー側ではFirebase Admin SDKを使う。アプリの初期化にはJSONファイルを用いてアプリケーションデフォルト認証による初期化をおこなうこともできるが、Vercelなどのサーバーレス環境ではJSONファイルを扱いにくいため、上記のように環境変数を使った認証にしている。
- Firebase Admin SDKで初期化したアプリを使い`createSessionCookie()`によってIDトークンを検証しつつ、IDトークンからセッションCookieを生成する。IDトークンの検証には`verifyIdToken()`という関数もあるが、`createSessionCookie()`でも内部的にIDトークンを検証する。

## セッションCookieの検証

```tsx
// app/routes/_index.tsx

export async function loader({ request }: LoaderFunctionArgs) {
  const decodedToken = await verifySessionCookieHeaders(request.headers);
  if (decodedToken === null) {
    return redirect("/login");
  }

  // ...
}
```

- 認証が必要なページの`loader()`で必ずセッションCookieを検証するようにする。

```ts
// app/modules/session.server.ts

export async function verifySessionCookieHeaders(headers: Headers) {
  const cookieHeader = headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => cookie.split("=")),
  );
  const sessionCookie = cookies[sessionCookieName];

  try {
    return await verifySessionCookie(sessionCookie);
  } catch (error) {
    return null;
  }
}
```

- `Cookie`ヘッダーからセッションCookieの値を取り出して、別モジュールの関数にわたす。

```ts
// app/modules/firebase.server.ts

export async function verifySessionCookie(sessionCookie: string) {
  return await getAuth(firebaseApp).verifySessionCookie(sessionCookie);
}
```

- Firebase Admin SDKを使いセッションCookieを検証する。
