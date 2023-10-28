---
title: Circle CIからHeroku registryにpushする
time: 2018-12-16T22:44:00+0900
tags: ["circleci"]
---

DockerコンテナをHeroku上で実行したい場合、Heroku registryにDockerイメージをpushすることになる。これをCircle CIで行いたい。

Heroku registryの認証はHeroku CLIか`docker login`コマンドで行うことができるが、Heroku CLIのセットアップを"Docker in Docker"イメージ（ベースがalpine）上で行うのはけっこうたいへんなので、以下のように`docker login`コマンドから行うと良い。

```bash
$ docker login -u _ -p $HEROKU_API_KEY registry.heroku.com
```

`$HEROKU_API_KEY`は`heroku auth:token`コマンドで取得したトークンを環境変数で設定しておく。

`.circle/config.yml`はこんな感じになる。

```yaml
steps:
  # ...
  - deploy:
      name: Push image to Heroku registry
      command: |
        docker login -u _ -p $HEROKU_API_KEY registry.heroku.com
        docker tag myapp registry.heroku.com/$HEROKU_APP/web/myapp
        docker push registry.heroku.com/$HEROKU_APP/web/myapp
```
