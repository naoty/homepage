---
title: vimperatorで快適ブラウジング
time: 2012-04-09 23:53
---

## vimperatorとは

ブラウザをキーボードのみで操作できるようになるFirefoxのアドオン。vimのように操作できる。

## ダウンロード

https://addons.mozilla.org/ja/firefox/addon/vimperator/

## 設定

以下のテキストをホームディレクトリに`.vimperatorrc`として保存。
Firefoxを再起動。

```vim:.vimperatorrc
map j 5<C-e>
map k 5<C-y>
map h <C-p>
map l <C-n>
map H <A-Left>
map L <A-Right>

set hintchars=asdfjkl
```

## vimperatorの世界にようこそ！

### 基本的なキーボード操作

- `o`でurlを入力して`Enter`で候補のページを開く。
- `t`でurlを入力して`Enter`で候補のページを別タブで開く。
- `d`でタブを閉じ、`u`で閉じたタブを開く
- `j`, `k`で上下に移動
- `h`, `l`でタブを左右に移動
- `H`, `L`でウィンドウの履歴を前後に移動
- `f`でリンクにキーが表示される。どれかのキーを入力するとリンクを開く。
- `F`でリンクにキーが表示される。どれかのキーを入力すると別タブでリンクを開く。
- `/`でページ内を検索する。`n`, `N`で検索結果を移動する。
