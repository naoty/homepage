---
title: コミット毎に実行環境をビルドするoasisを書いた
time: 2015-04-09 23:24
tags: ['oss']
---

Dockerの理解を深めるため、またGo言語の経験を積むためにoasisというツールを書いた。「とりあえず動いた」レベルの完成度であり、実用で使うにはもっと時間をかけて改善していく必要がある。

[naoty/oasis](https://github.com/naoty/oasis)

これはコミット毎の実行環境をdockerのコンテナとして提供するリバースプロキシだ。例えば、以下のようにoasisを起動する。

```
% oasis start \
    --proxy master.oasis.local:8080 \
    --container-host 192.168.99.100 \
    --repository github.com/naoty/sample_rails_app
```

このとき`http://master.oasis.local:8080`にアクセスすると、oasisは以下のようなことを行う。

1. `--repository`で指定されたリポジトリを`git clone`する。
2. サブドメインで指定されたリビジョン、ここでは`master`に`git checkout`する。
3. リポジトリに含まれるDockerfileを使って`docker build`する。
4. ビルドしたイメージを`docker run -P -d`して、コンテナを起動する。
5. コンテナのホスト側ポート（例: `49154`）を調べて、oasisへのアクセスを`--container-host`で指定されたホスト上のコンテナ（例: `192.168.99.100:49154`）にリダイレクトする。

![f:id:naoty_k:20150409225939p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20150409/20150409225939.png "f:id:naoty\_k:20150409225939p:plain")

実際にOSXで試す場合は、`--proxy 127.0.0.1:8080`のようなオプションで起動して、サブドメインの解決を[Pow](http://pow.cx/manual.html)に任せるといいと思う。

```
% cd ~/.pow
% echo 8080 > oasis
```

上のようにすると、`http://*.oasis.dev`のように任意のサブドメインにアクセスできるようになり、`8080`ポートのoasisにポートフォワーディングされる。

# 所感

もともとは同僚の方が開発に携わっている[mookjp/pool](https://github.com/mookjp/pool)を見て、もうちょっとシンプルにセットアップできるようにしたいと思ったのがきっかけだった。実行ファイルをダウンロードして即実行できるようなものが理想だったので、Go言語を勉強しはじめこんなものを作ってみた。名前の「oasis」は最近ハマっているドミニオン・異郷に出てくるアクションカードであること、コンセプトのオリジナル実装であるpoolに雰囲気が似ていることから採った。

Go言語はとてもシンプルですんなり理解できたし、標準パッケージでリバースプロキシを簡単に実装できたため、短時間でここまで作ることができた。ちょっとしたツールを作るとき、これまではRubyでrubygemを書くようなことをしていたが、Go言語であればrubygemを書くほどのハードルの高さもなく、シンプルで生産性の高いコードを書いてそのまま配布することができていい感じだなと思った。

また、DockerについてもDocker Remote APIを触ってみたり、`docker run`の`-p`と`-P`の違いを理解できたり、理解が深まったと思う。あんまり関係ないけど、サンプルアプリで使ったDockerfileはDocker Hubで配布された公式のrails用イメージを使ってるだけで、何も考えなくてよくて便利だった。
