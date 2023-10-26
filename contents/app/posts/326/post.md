---
title: Assets precompileに必要最小限のファイル
time: 2018-03-09T20:55:00+0900
tags: ["rails", "docker"]
---

Dockerfileで`rails assets:precompile`を実行する前に`COPY`するファイルを必要最小限にしておけると、キャッシュを有効活用できてビルド時間を短縮できる。

```docker
WORKDIR /myapp

COPY app/assets /myapp/
COPY bin/rails /myapp/bin/
COPY config/environments /myapp/config/environments/
COPY config/initializers /myapp/config/initializers/
COPY config/application.rb /myapp/config/application.rb
COPY config/boot.rb /myapp/config/boot.rb
COPY config/environment.rb /myapp/config/environment.rb
COPY config/secrets.yml.enc /myapp/config/secrets.yml.enc
COPY lib/assets /myapp/lib/assets/
COPY vendor/assets /myapp/vendor/assets/
COPY Rakefile /myapp/
RUN bin/rails assets:precompile
```

とりあえずこれだけで動いた。`config/initializers/`以下も削れそうな気がするけど、プロジェクトによってケースバイケースだと思うので、これで十分だとおもう。
