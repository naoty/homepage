---
title: MBAに入れてるアプリと作業環境
time: 2012-04-24 13:52
---

MBAが故障して新しいMBAに引っ越しししてるので、Android SDKをインストール中（長い…）ヒマなので作業環境をメモる。

## 各種アプリケーション

- ブラウザ：Firefox（アドオン：vimperator、Firebug、はてブ）
- 通知：Growl
- Twitter：Twitter for Mac
- メーラー：sparrow
- チャット：skype
- メモ：[Mou](http://mouapp.com/)（マークダウンエディター）
- ウィンドウ最前面化：[afloat](http://infinite-labs.net/afloat/)（`[Command][Ctrl]a`でウィンドウを最前面）
- ランチャー：[spark](http://www.shadowlab.org/Software/spark.php)（`C-0`でFirefox、`C-9`でiTermを起動/移動などショートカットキーを設定する）
- バックアップ：dropbox
- IME：Google IME
- マシン情報：[menu meters](http://www.ragingmenace.com/software/menumeters/index.html)

「キーボードだけで作業の9割をこなせる環境」を目指してる。

Sparkでアプリケーション間を移動を簡略化し、ブラウザもvimpでキーボードのみで操作してる。twitterやsparrowもhjklで移動できるなど慣れたキーバインドで操作できるから使ってる。また、afloatを使うと、ターミナルを最前面に置きつつブラウザを操作するとかできて便利。

スタイルを編集できて、dropboxで同期できるようになればMouからKobitoに移行します。

---
### 追記

- Todoリスト：[fruid](http://fluidapp.com/) + Google Tasks

Todoリストは数多あるけど、一番シンプルかつ使い勝手がいいのがGoogle Tasksだった。ただ、webアプリだと消しちゃうので、fruidでデスクトップアプリにする。fruidはwebアプリをデスクトップアプリにするツール。デスクトップアプリ化したGoogle Tasksはafloatで常にウィンドウの最前面において使ってる。

## 開発環境

- iTerm2
- Command Line Tools
- Homebrew
- tmux
- git + tig

Xcodeはいまのところ使わないしインストールに時間がかかるので、Command Line Toolsだけ使う。tig便利。
vimとかzshは入ってるものをそのまま使う。dotfilesは[github](https://github.com/naoty/dotfiles)で管理してるので、それをcloneして使う。

### Rails開発

- rvm
- Ruby 1.9.3, 1.9.2
- bundler
- mongodb
- imagemagic

gemにはbundlerだけ入れて、プロジェクトに必要なgemsはすべてbundleで管理する系男子。

### Android開発

- Android SDK 2.3.2, 2.2
- Eclipse（日本語化、vrapper、Eclipse Color Scheme）

vrapperでEclipseでもvimのキーバインドをある程度使えるようになる。
