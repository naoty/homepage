---
title: モデルの差分更新
time: 2017-12-01T21:40:00+0900
tags: ["rails"]
---
アプリからデータのバックアップを受け取るときに、サーバー側で差分更新を行う必要がある。全部消去してから全部挿入するという実装も考えられるが、何かの実装ミスの際に全消去してしまうリスクがありそうなので避けたい。

新しいデータと既存のデータを比較して、以下のような操作をする必要がある。

* 新しいデータにも既存のデータにもあるデータを更新する。
* 新しいデータにあるが、既存のデータにないデータを挿入する。
* 新しいデータにないが、既存のデータにあるデータを削除する。

これを実行するロジックをあらためて考えてみた。

```ruby
new_users = [{ id: 1, name: "..." }, { id: 2, name: "..." }]
new_users_index = new_users.index_by { |new_user| new_user[:id] }

User.all.in_batches do |users|
  users.each do |user|
    # インデックスから取得できたデータは取り除いていく
    # 残ったデータはINSERT時に利用する
    new_user = new_users_index.delete(user.id)

    # 新しいデータに含まれているかチェック
    if new_user.nil?
      # 含まれていなければDELETE
      user.destroy
    else
      # 含まれていればUPDATE
      user.update_attributes(new_user)
    end
  end
end

# 残ったデータはすべてINSERTする
new_users_index.values.each do |new_user|
  User.create(new_user)
end
```
