---
title: Rails4から--binstubsが使えなくなる件
time: 2013-01-26 16:33
tags: ['rails']
---

Rails4を試そうと思って、いつもどおり`bundle install --binstubs`したら`rails s`が`rails new`扱いされてうまくいかなかった。

## 原因

[ここ](https://github.com/rails/rails/commit/009873aec89a4b843b41accf616b42b7a9917ba8)によると、以前の`scripts/rails`が`bin/rails`に移動したみたいです。

新`bin/rails`で`rails s`とか`rails c`とかのコマンドができるようになったため、いつものノリで`--binstubs`すると新`bin/rails`が上書きされてしまい、`rails s`などがうまくいかなくなるようです。

## 対策

とはいえ、`bundle exec rails s`と打つのがめんどくさいので、RVMの`after_cd_bundler`フックを活用できるように`.bundle/config`に以下の設定を追加します。

```sh:.bundle/config
BUNDLE_BIN: bin
```

これ`bin/`以下に自動でパスが通るようになりますので、`rails s`でちゃんとうごくようになります。

RVMの`after_cd_bundler`については[昔の投稿](http://qiita.com/items/a1fbac19686a8fcd2e34)を参照してください。

Rails以外のgemについては最新のBundlerを使うことで`bin/`以下に実行スクリプトを生成できるようになります。

```
$ gem install bundler --pre
$ bundle --version
Bundler version 1.3.0.pre.7
$ bundle binstubs puma
```

`bundle binstubs puma`で`bin/puma`が生成されます。
