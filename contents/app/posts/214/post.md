---
title: Xcodeでビルドした実行ファイルを自動的にプロジェクトにコピーする
time: 2014-04-14 01:07
tags: ['ios']
---

XcodeでCommand Line Toolを作るときビルドした実行ファイルは、デフォルトでは`$HOME/Library/Developer/Xcode/DerivedData/<アプリケーション固有ID>/Build/Products/<Build Configuration>/`以下に保存されます。実行ファイルをGitで管理したい場合など何らかの理由でプロジェクト内に置きたいとき、Build Phasesに設定を追加することで実行ファイルをプロジェクトにコピーする作業を自動化できます。

![スクリーンショット 2014-04-14 0.59.33.png](https://qiita-image-store.s3.amazonaws.com/0/1044/f6e02520-a8b0-295a-bc78-07666f6d79a0.png)

プロジェクトの設定画面からスクリーンショットのようにBuild PhasesにRun Scriptを追加して以下のようなシェルスクリプトを入力します。

```bash
cp $BUILT_PRODUCTS_DIR/your_executable $SRCROOT/bin/your_executable
```

`$BUILT_PRODUCTS_DIR`という環境変数は上の`$HOME/Library/Developer/Xcode/DerivedData/<アプリケーション固有ID>/Build/Products/<Build Configuration>/`を指し、`$SRCROOT`はプロジェクトルートを指します。これでビルドする毎にプロジェクト内に実行ファイルがコピーされます。
