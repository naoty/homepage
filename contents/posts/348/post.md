---
title: 非効率なメモ化の改善
time: 2018-10-09T22:52:00+0900
---

Railsでは、よく以下のようなコードを書いたり見たりする。メモ化って言うらしい。

```ruby
def current_user
  @current_user ||= User.find_by(cookies.signed[:user_id])
end
```

`#current_user`が呼ばれるまではDBへのアクセスは発生しない。そして、アクセスした結果を`@current_user`に代入しておくことで、2回目以降の呼び出しではDBへのアクセスが発生しないようになっている。

割とよく書きがちなこのコードだけど、非効率なケースがある。DBから取得した結果が`nil`のケースだ。このケースだと、`@current_user`は`nil`のままなので`#current_user`が呼び出されるたびにDBに再度アクセスすることになる。

DBにアクセスした結果`nil`だとわかっているなら、2回目以降はDBにアクセスしなくていいだろう。というわけで、こんな感じで直す。

```ruby
def current_user
  return nil if @current_user_exists == false
  @current_user ||= User.find_by(cookies.signed[:user_id])
  @current_user_exists ||= !@current_user.nil?
  @current_user
end
```

以前のものとは見栄えが悪くなったけど、より効率的になった。もっとシンプルに書けそうな気はしている。
