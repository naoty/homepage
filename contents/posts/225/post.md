---
title: SinatraでJSONを受け取る
time: 2014-07-17 09:12
tags: ['sinatra']
---

```rb:Gemfile
gem "rack-contrib", require: ["rack/contrib/post_body_content_type_parser"], github: "rack/rack-contrib"
```

```rb:config.ru
use Rack::PostBodyContentTypeParser
run YourApplication
```

これだけ。

---

`Rack::PostBodyContentTypeParser`はその名の通りContentTypeを見てbodyをパースするmiddlewareで、実装を見ると実体は`application/json`のときは`JSON.parse(body)`みたいなことをしているだけ。

現在リリースされているバージョンだと正常に動かないので、開発版をgithubから取得している。
