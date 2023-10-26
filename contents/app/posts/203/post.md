---
title: ChefでRaspberry Piをセットアップする
time: 2013-10-20 17:16
tags: ['chef']
---

[![](http://instagram.com/p/er08ccqmqe/media/?size=l)](http://instagram.com/p/er08ccqmqe/)

仕事で複数台のRaspberry Piをセットアップすることになったので、Chefを使ってセットアップを自動化することにした。Chef、Vagrant、Serverspecなどいろいろな周辺ツールの全体像を整理したり、それらを使ったワークフローを体験できてよかったので、ブログとして残しておく。

また、セットアップに使ったChefのレポジトリはgithubにホストしてあるので参考にどうぞ。

[https://github.com/naoty/chef-repo](https://github.com/naoty/chef-repo)

今回、Chefで自動化したのは以下の通り。

- apt-getの更新
- gitのインストール
- rbenvを使ってRuby 2.0.0-p247をインストール
- nodebrewを使って最新安定版のnode.jsをインストール
- Wiringpi（GPIOを簡単に操作するためのライブラリ）のインストール
- mjpg-streamer（Webカメラを使ったストリーミングのためのライブラリ）のインストール

## 1. Vagrantで仮想環境を用意する

いきなりRaspberry PiにChefを使って環境構築を行うのは失敗したときにやり直すのが大変。なので、Raspberry Piに近い仮想環境を用意して、そこでChefを使ったセットアップを試行錯誤したい。そういうときに便利なのがVagrant。Vagrantを使えば簡単に仮想環境を作ったり壊したりできるので、失敗してもすぐにやり直せる。

今回、重要だったのがRaspberry Piに近い仮想環境を用意することだった。Vagrantにはboxという仕組みがあって、CentOSとかUbuntuとかいろんなOS、CPUに合わせたひな形がたくさん用意されている。通常は[ここ](http://www.vagrantbox.es/)にあるboxを使えばいいんだろうけど、Raspberry Piに近いboxがなかった。Raspberry Piに近いboxを探したところ、[これ](https://github.com/nickhutchinson/raspberry-devbox)がよさそうだったので使うことにした。

```
$ git clone https://github.com/nickhutchinson/raspberry-devbox raspberry_pi
$ cd rasbperry_pi
$ vagrant up
```

以上、これだけでRaspberry Piに近い仮想環境を用意することができた。

## 2. Chefのセットアップ

ここはいろんなところで解説されてる通りに行っただけ。

```
$ vagrant ssh-config --host vm-raspberry_pi >> ~/.ssh/config
$ knife solo init chef-repo
$ knife solo prepare vm-raspberry_pi
```

## 3. クックブックの作成とテスト

ここから環境構築の手順をコードとして記述していく。クックブックの書き方については「入門ChefSolo」やOpscodeの[公式ドキュメント](http://docs.opscode.com/chef/resources.html)を参考にした。このときの注意点としては、Raspberry PiはRubyやnode.jsのインストールに非常に時間がかかるため、timeoutをとても長くする必要がある。数時間はかかると考えた方がいい。

書いたクックブックを実行する前にVagrantをサンドボックスモードにしておく。こうすると、失敗したときに実行した部分だけやり直すこと（ロールバック）ができる。サンドボックスモードにするためにはsaharaというVagrantのプラグインが必要なのでインストールしておく。

サンドボックスモードをオンにしてクックブックを実行したあと、本当に期待した通りに環境構築できたかどうかをServerspecを使ってテストする。Serverspecにはいくつかテストを実行する方法があるようだけど、今回はSSHでログインしてテストを実行する形式を採った。テストを通らなかった場合は、saharaを使ってロールバックしてやり直す。テストが通った場合は、saharaを使って変更を確定させる（コミット）。

これをサイクルさせながら、どんどんクックブックを追加していく。以上をコマンドで表すとこんな感じ。

```
$ knife cookbook create ruby -o site-cookbooks
$ vi site-cookbooks/ruby/recipes/default.rb
$ vi nodes/vm-raspberry_pi.json
$ vi spec/vm-raspberry_pi/ruby_spec.rb
$ vagrant sandbox on
$ knife solo cook vm-raspberry_pi
$ rspec
$ vagrant sandbox commit
```

## 4. Raspberry PiをChefで環境構築する

仮想環境での環境構築が完了したら、いよいよ本物のRaspberry Piにクックブックを適用する。そのためにはnodes以下に本物用の設定を追加するだけでいい。

```
$ vi nodes/raspberry_pi.json
$ knife solo cook raspberry_pi
```
