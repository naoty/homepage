---
title: React RouterにおけるPending UIの実装方針
time: 2025-02-02 20:32
tags: ['react', 'react-router']
---

React Routerでアプリを作る際にload中のUIやsubmit中のUI（以下まとめてPending UI）を表示する実装にはだいたい2種類ある。

1. `useNavigation()`を使ってナビゲーションの状態に応じてUIを出し分ける
1. `Suspense`を使って表示するデータがresolveされるまで`fallback`属性のUIを出す

# useNavigation

```tsx
export default function Index() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <main>
      {isLoading ? <Skeleton /> : <Content>}
    </main>
  );
}
```

- `loader`や`action`が実行中であるかどうかを参照できる。
- 同時に実行される`loader`のうち、ひとつでも実行中であれば`"loading"`のまま。

# Suspense

```tsx
export function loader() {
  const usersPromise = fetch("https://example.com/users");
  return { usersPromise };
}

export default function Index({ loaderData }: Route.LoaderArgs) {
  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
          </tr>
        </thead>
        <Suspense fallback={<UserRowsSkeleton />}>
          <UserRows users={loaderData.usersPromise} />
        </Suspense>
      </table>
    </main>
  );
}

function UserRows({ users }: { users: Promise<User[]> }) {
  const resolved = use(users);

  return (
    <tbody>
      {resolved.map((user) => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </tbody>
  );
}
```

- `loader`からコンポーネントのpropsに`Promise`を渡している。Single Fetchという仕組みでサーバーからクライアントに`Promise`をシリアライズして送信できる。
- クライアントに渡った`Promise`は`use`を使って値を取り出せる。`use`を使うコンポーネントを`Suspense`でラップすると、`Promise`がresolveされるまでの間に`Suspense`の`fallback`で指定したコンポーネントを表示できる。

# 比較

## useNavigation

- pros: 即座にPending UIを表示できる。
- pros: submit時にも使える。
- cons: どれかひとつでも`loader`が実行中だとローディング中になるため、細やかなUIには向いていない。

## Suspense

- pros: データの取得に時間がかかる部分だけローディングUIを出すといったことができる。
- cons: `Promise`が返す値やthrowする値がSingle Fetchによってシリアライズできないケースでは使えない。特に`Response`をthrowするケースではエラーになることを確認した。

## 使い分け
- `useNavigation()`でレイアウトでページ全体のPending UIを表示しつつ、特に取得に時間がかかる箇所に`Suspense`で個別のPending UIを表示する。
- submit中のPending UIには`useNavigation()`を使う。
