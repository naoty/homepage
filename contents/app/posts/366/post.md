---
title: normalizrの使い方
time: 2019-04-12T20:23:00+0900
tags: ["javascript"]
---

最近、Nuxt.jsでカンバンアプリを作る練習をしていて、そこで[normalizr](https://github.com/paularmstrong/normalizr)を使っている。GraphQLのレスポンスをnormalizrで正規化してVuexのStoreに保存している。normalizrを使って正規化されたデータは、特にネストしたデータをループしたい場合、Vueコンポーネント内で扱いやすいので、重宝している。

normalizrの使い方を理解するのに少し手間取ったので、自分のためにメモしておきたい。

# オブジェクト

```js
const { normalize, schema } = require("normalizr");
const data = {
  id: 1,
  name: "TODO"
};
const status = new schema.Entity("statuses");
normalize(data, status);
// {
//   entities: {
//     statuses: {
//       "1": {
//         id: 1,
//         name: "TODO"
//       }
//     }
//   },
//   result: 1
// }
```

* `normalize(<正規化したいデータ>, <スキーマ>)`という使い方をする。
* `new schema.Entity(<キー>)`でスキーマを初期化する。キーは正規化したデータのプロパティ名に使われる。
* 正規化されたデータは`id`の値をキーとしたオブジェクトになっている。デフォルトでは`id`プロパティをキーに使うけど、`idAttribute`オプションで`id`以外のプロパティをキーに使うことができる。

# 配列

```js
const { normalize, schema } = require("normalizr");
const data = [
  {
    id: 1,
    name: "TODO"
  }
];
const status = new schema.Entity("statuses");
const statuses = new schema.Array(status);
normalize(data, statuses);
// {
//   entities: {
//     statuses: {
//       "1": {
//         id: 1,
//         name: "TODO"
//       }
//     }
//   },
//   result: 1
// }
```

* 正規化したいデータが配列の場合、`schema.Array`を`normalize`に渡す。

# 名前つきの配列

```js
const { normalize, schema } = require("normalizr");
const data = {
  statuses: [
    {
      id: 1,
      name: "TODO"
    }
  ]
};
const status = new schema.Entity("statuses");
const statuses = new schema.Array(status);
const root = new schema.Object({ statuses });
normalize(data, root);
// {
//   entities: {
//     statuses: {
//       "1": {
//         id: 1,
//         name: "TODO"
//       }
//     }
//   },
//   result: {
//     statuses: [1]
//   }
// }
```

* `statuses: [...]`のような名前がついた配列の場合、`schema.Object`を使ってどのプロパティに対してどのスキーマを使うかをマッピングすることで正規化できるようになる。

# ネストしたオブジェクト

```js
const { normalize, schema } = require("normalizr");
const data = {
  statuses: [
    {
      id: 1,
      name: "TODO",
      tasks: [
        {
          id: 1,
          title: "normalizrの使い方を理解する"
        }
      ]
    }
  ]
};
const task = new schema.Entity("tasks");
const tasks = new schema.Array(task);
const status = new schema.Entity("statuses", { tasks });
const statuses = new schema.Array(status);
const root = new schema.Object({ statuses });
normalize(data, root);
// {
//   entities: {
//     tasks: {
//       "1": {
//         id: 1,
//         title: "normalizrの使い方を理解する"
//       }
//     }
//     statuses: {
//       "1": {
//         id: 1,
//         name: "TODO",
//         tasks: [1]
//       }
//     }
//   },
//   result: {
//     statuses: [1]
//   }
// }
```

* ネストしたオブジェクトをnormalizrで正規化すると、フラットな構造に変換される。
* task用のスキーマを用意し、status用のスキーマに渡すことで、ネストしたtaskの配列を正規化している。
