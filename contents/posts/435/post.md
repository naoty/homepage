---
title: カラムを絞ってpreloadする
time: 2021-01-11 22:10
tags: ['rails']
---

# 課題
関連先のテーブルのカラムを絞りつつ、N+1問題を回避するため`preload`したい。

# 解決

`select`で取得するカラムを絞るscopeを用意し、`has_many`の第2引数で指定する。

例として下のようなテーブル定義とモデルがあるとする。

`books`テーブルの`body`カラムはTEXT型でサイズが大きくなりうるため、`body`カラム以外をロードするための`metadata`というscopeを定義し、関連元の`Author`に`metadata`を利用した`books_metadata`という関連を定義しておく。

```ruby
ActiveRecord::Schema.define do
  create_table :authors do |t|
    t.string :name
  end

  create_table :books do |t|
    t.string     :title
    t.text       :body
    t.references :author
  end
end

class Author < ActiveRecord::Base
  has_many :books
  has_many :books_metadata, -> { metadata }, class_name: 'Book'
end

class Book < ActiveRecord::Base
  belongs_to :author

  scope :metadata, -> {
    select(
      :id,
      :author_id,
      :title,
    )
  }
end
```

データを作って`preload`で実行されるSQLを比較すると、確かに`preload(:books_metadata)`をした場合は`SELECT "books".* FROM "books"`としていないことがわかる。

```ruby
irb(main):001:0> author = Author.create(name: 'naoty')
irb(main):002:0> author.books.create(title: 'dummy', body: 'dummy')
irb(main):003:0> Author.preload(:books).first
D, [2021-01-11T22:27:14.445409 #4400] DEBUG -- :   Author Load (0.2ms)  SELECT "authors".* FROM "authors" ORDER BY "authors"."id" ASC LIMIT ?  [["LIMIT", 1]]
D, [2021-01-11T22:27:14.446208 #4400] DEBUG -- :   Book Load (0.1ms)  SELECT "books".* FROM "books" WHERE "books"."author_id" = ?  [["author_id", 1]]
irb(main):004:0> Author.preload(:books_metadata).first
D, [2021-01-11T22:28:47.793620 #4400] DEBUG -- :   Author Load (0.2ms)  SELECT "authors".* FROM "authors" ORDER BY "authors"."id" ASC LIMIT ?  [["LIMIT", 1]]
D, [2021-01-11T22:28:47.794626 #4400] DEBUG -- :   Book Load (0.1ms)  SELECT "books"."id", "books"."author_id", "books"."title" FROM "books" WHERE "books"."author_id" = ?  [["author_id", 1]]
```

だけど、`preload(:books_metadata)`でロードした`Author`に対して`#books`を呼ぶと、`books`テーブルへのSQLが実行されてしまう。なので、N+1クエリが発生することになる。

```ruby
irb(main):004:0> author = Author.preload(:books_metadata).first
irb(main):005:0> author.books_metadata
irb(main):006:0> author.books
D, [2021-01-11T22:38:27.058462 #4400] DEBUG -- :   Book Load (0.3ms)  SELECT "books".* FROM "books" WHERE "books"."author_id" = ? /* loading for inspect */ LIMIT ?  [["author_id", 1], ["LIMIT", 11]]
```

ある`Author`インスタンスが`preload(:books)`されていれば`#books`を呼ぶことでN+1クエリを回避できるし、`preload(:books_metadata)`されていれば`#books_metadata`を呼ぶことでN+1クエリを回避できるということになる。

だけど、どちらで`preload`されているか事前にわからない場合、どうすればいいのか。

`ActiveRecord::Associations::CollectionProxy#loaded?`を使うと、どちらで`preload`されているか判別できる。

```ruby
irb(main):004:0> author = Author.preload(:books_metadata).first
irb(main):005:0> author.association(:books).loaded?
=> false
irb(main):006:0> author.association(:books_metadata).loaded?
=> true
```

そこで、このようなラッパーを用意することで、どの関連が`preload`されているか事前にわからない場合でも対処できるようになる。

```ruby
class Author
  def books
    return association(:books).reader if association(:books).loaded?
    return books_metadata if association(:books_metadata).loaded?
    association(:books).reader
  end
end
```

従来の`books`は`association(:books).reader`と同じなので、無限ループを避けるためにこのような書き方をしている。
