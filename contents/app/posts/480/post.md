---
title: Production Ready GraphQL
time: 2022-06-14 22:04
tags: ["book", "graphql"]
---

最近、GraphQLのフロントエンドとバックエンドを実装していて、GraphQLのベストプラクティスを学んでみようと思い、[Production Ready GraphQL](https://productionreadygraphql.myshopify.com/)という本をななめ読みした。

# Client First
RESTful APIを設計する際、ドメインからリソースを抽出してCRUDを考えていくことになるけど、GraphQLではそういったリソース中心の設計ではなく、クライアントのユースケースを中心に設計していくことになる。

分かりやすい例が、作成や更新に対する考え方の違いで、RESTful APIであれば、CREATEとUPDATEを同じようなパラメータを受け取るように実装するけど、GraphQLでは

>coarse-grained create mutation and finer-grained mutations to update an entity

と本書で表現されているように、作成時は対象のオブジェクトの属性をまとめて受け取れるようにし、更新時は属性ごとに細かく更新できるようにすることが多い。これは、なにかを更新するときはすべての属性を変更するわけではなく一部の属性だけを更新するユースケースが圧倒的に多いからだ。

# Expressive Schemas
GraphQLはnullability, enum, interface, unionといった静的型付け言語のような型システムを持っていて、表現力の高いスキーマを定義できる。これによって、例えば、不整合なデータを返さないようにスキーマで強制することができたり、クライアントからの入力に制約を設けることで、アプリケーション側で入力のバリデーションを実装する手間を省くことができるなどのメリットがある。

個人的に一番印象的だったのは、mutationの結果をunionで表現する使い方だった。

```graphql
type Mutation {
  signUp(email: String!, password: String!): SignUpPayload!
}

union SignUpPayload = SignUpSuccess | UserNameTaken | PasswordTooWeek
```

`signUp`の結果は`SignUpSuccess`, `UserNameTaken`, `PasswordTooWeek`のいずれかの型で表現できる。このように定義するメリットとしては、nullableなフィールドを用意する必要がないことが挙げられる。

以下のようなスキーマで結果を表現するのがよくある形だが、sign upに失敗した場合には`account`フィールドがnullになるなど、ある程度のnullabilityを許容することになったり、さまざまな種類のエラーを`UserError`という抽象的な型で表現する必要が出てくる。

```graphql
type SignUpPayload {
  userErrors: [UserError!]!
  account: Account
}
```

そうすると、「`account === null`の場合は失敗である」という判断をクライアントアプリケーションに委ねることになる。union型を使うことで、より明確にエラーとその種類をクライアントに返すことができる。

当然、unionを使った表現にもデメリットがあるわけだけど、これ以上は長くなるので、ここまでにする。

# Resolver Design
本書はスキーマのベストプラクティスだけでなく、GraphQLサービスのバックエンドを実装する際の設計についてもある程度触れられている。その中でも、Resolverの設計について触れられている章があった。

>A great resolver often contains very little code. It deals with user input, calls down to our domain layer, and transforms the result into an API result.

Resolverの責務とはこのようなことで、Resolverにドメインロジックを書いてはいけない。

ただ、これはRESTful APIを実装する際にcontrollerにドメインロジックを書かないみたいなことで、さほど驚きはなかった。やっぱりそうだよね、という確認ができてよかった。

---

本書は、これ以外にもセキュリティ、パフォーマンス、バージョニングなど多岐にわたって解説されており、まだすべて目を通せていないものの、現時点でかなり良い本であることは間違いないので、GraphQLとの向き合い方に悩んでいる方にはオススメしたい。
