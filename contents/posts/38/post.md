---
title: Aptana Studioの環境構築
time: 2011-03-01 01:34
---

0.　インストールするもの

- Aptana Studio 2.0.5（スタンドアロン版）
- Babel（日本語化パック）
- Aptana XUL Runner（Firefoxプレビュー）
- EGit（gitと連携しgithubに保存したい）

1.　Aptana Studioをインストールする

- [http://www.aptana.com/products/studio2/download](http://www.aptana.com/products/studio2/download)からダウンロード&インストール

2.　Babelをインストールする

- 「Help \> Install New Software」とクリック
- 「Work with:」の欄に「[http://download.eclipse.org/technology/babel/update-site/R0.8.1/helios](http://download.eclipse.org/technology/babel/update-site/R0.8.1/helios)」と入力
- いろいろパッケージが出てくるので、Japaneseを選択しインストール
- インストール後再起動すると、日本語になっている

3.　Aptana XUL Runnerをインストールする

- 「ヘルプ \> 新規ソフトウェアのインストール」をクリック
- 「Work with:」の欄の右端の三角形をクリックし、「Aptana XUL Update Site」を選択
- 「Aptana XUL Runner」が表示されるので、選択してインストール

4.　EGitをインストールする

- 「ヘルプ \> 新規ソフトウェアのインストール」をクリック
- 「Work with:」の欄に「[http://download.eclipse.org/egit/updates](http://download.eclipse.org/egit/updates)」と入力
- いろいろパッケージが出てくるが、「Eclipse EGit (Incubation)」を選択しインストール

5.　EGitからgithubにpushする（ここからが本題）

- 「ウィンドウ \> 設定」をクリックし、設定ダイアログを表示
- 「一般 \> ネットワーク接続 \> SSH2」をクリック
- 「鍵管理」タグの「RSA鍵の生成」をクリックし、鍵を生成する
- githubのアカウントページの「SSH公開鍵」をクリックし、生成された公開鍵をコピペする（ついでにプロジェクトを作成しておく）
- その後、「秘密鍵の保管」をクリック。パスフレーズなしでおｋ
- 適当にプロジェクト（githubに作成したものと同名）を作成し、ルートで「右クリック \> プロジェクトの共用」をクリック
- プロジェクト名をクリックし、「Create Repository」をクリックし、「終了」をクリックする。ローカルリポジトリが作成される
- aptana studioに戻り適当にファイル（READMEファイルなど）を作成する
- プロジェクトのルートディレクトリで「右クリック \> 追加」「右クリック \> コミット」「右クリック \> remote \> push」の順に実行
- githubのプロジェクトページの「ssh」のURIをコピペ、あとは適当に従う
