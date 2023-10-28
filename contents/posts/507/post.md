---
title: 状態ごとにモデルを分割する
time: 2023-03-11 17:39
tags: ['dart']
---

ドメインモデリングにおいて状態をどのように扱うか考えることが増えてきたので、以下のような状態を持つブログ記事を例にとって、どのような方法がありうるか考えてみる。

- 下書き: まだ公開していないので公開日時がない。
- 公開: 公開しているので公開日時がある。
- アーカイブ: ユーザーが退会しているのでユーザーIDがない。

以下、コンストラクタは省略する。

# フラグ

```dart
class Article {
  final Id id;
  final Id? userId;
  final Title title;
  final DateTime? publishedAt;

  final bool isDraft;
  final bool isPublished;
  final bool isArchived;


  void publish({required DateTime publishedAt}) {
    if (isDraft) {
      isDraft = false;
      isPublished = true;
      this.publishedAt = publishedAt;
    }
  }

  void archive() {
    if (isPublished) {
      isPublished = false;
      isArchived = true;
      userId = null;
    }
  }
}
```

- `isDraft`と`isPublished`と`isArchived`がすべて`true`になることはないし、`isDraft`が`true`なら`publishedAt`は`null`でないといけない。そういった不変条件を常に満たすように実装が必要になる。
- 下書き状態なら公開日時は本来必要ないけど、nullableとして表現するしかない。nulllableなフィールドが増えればそれだけnullチェックも増える。
- `Article`インスタンスを利用する際、フラグをいちいち確認する必要がある。例えば、インスタンスを公開しようとしたとき、その状態をチェックして処理を替えなくてはいけない。

# enum

```dart
class Article {
  final ArticleStatus status;
  final Id id;
  final Id? userId;
  final Title title;
  final DateTime? publishedAt;
}

enum ArticleStatus {
  draft,
  published,
  archived;
}
```

- フラグよりはすっきりしたけど、それ以外は変わっていない。

# 状態ごとにクラスを分割

```dart
class DraftArticle {
  final Id id;
  final Id userId;
  final Title title;

  PublishedArticle publish({required DateTime publishedAt}) {
    return PublishedArticle(
      id: this.id,
      userId: this.userId,
      title: this.title,
      publishedAt: publishedAt,
    );
  }
}
```

```dart
class PublishedArticle {
  final Id id;
  final Id userId;
  final Title title;
  final DateTime publishedAt;

  ArchivedArticle archive() {
    return ArchivedArticle(
      id: this.id,
      title: this.title,
      publishedAt: this.publishedAt,
    );
  }
}
```

```dart
class ArchivedArticle {
  final Id id;
  final Title title;
  final DateTime publishedAt;
}
```

- インスタンスは異なっていても同じ記事であれば`id`は同じものを利用する。
- 上2つと比べて、コード量が増えたけど、不必要でnullableなフィールドはなくなったし、状態に関わる不変条件をチェックする必要もなくなった。
- それぞれの状態に対して可能な処理がコンパイル時には保証されている。例えば、`publish`は下書き状態の記事にしかできなくなっている。
- 状態に関わらずにブログ記事を扱いたい場合、Dartであれば`Article`インターフェイスを定義することになり、ポリモーフィズムを駆使した実装になるだろう。
