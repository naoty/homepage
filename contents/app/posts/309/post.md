---
title: ActiveRecordのattributeメソッド
time: 2017-12-08T23:00:00+0900
description: ActiveRecordのattributeは
tags: ["rails"]
---

```ruby
class User
  attribute :unencrypted_password, :string
end
```

* `attribute`メソッドはモデルに属性を追加する。
* DBのカラムがなくても追加できる。
* DBのカラムのアクセサをoverrideすることもできる。

# 例：パスワードのvalidation
パスワードのvalidationを実装する場合を考える。パスワードのvalidationというのは、暗号化される前の値に対して行われる。生パスワードはDBに保存しないが、アクセサがあると便利なので`attribute`メソッドで追加する。`attribute`メソッドで追加した仮想的なカラムにはvalidationが使える。

```ruby
class User
  attribute :unencrypted_password, :string

  before_save :encrypt_password, if: unencrypted_password_changed?

  validates :unencrypted_password,
    format: { with: /\A[0-9a-zA-Z]\z/ },
    length: { minimum: 8, maximum: 36 },
    presence: true

  private

  def encrypt_password
    cost = BCrypt::Engine.cost
    self.password = BCrypt::Password.create(unencrypted_password, cost)
  end
end
```
