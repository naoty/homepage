---
title: .vimrc整理術
time: 2013-05-22 11:46
tags: ['vim']
---

.vimrcが400行近くになり見づらくなってきたので見やすくしてみた。markerは使ってる人おおい感じがするけど、modelineと組み合わせたらかなり見やすくなったのでメモ。

## 1. 各種設定をmarkerで囲む

markerで囲まれた部分は折りたためるので見やすくなる。基本的な設定やマッピングの設定、プラグインを入れてる人はプラグインの設定、あとカラースキームの設定など、おおざっぱに設定をまとめてmarkerで囲む。

```vim:.vimrc
" 基本設定 {{{1

set nocompatible
set number

" マッピング {{{1

nnoremap H b
nnoremap J }
nnoremap K {
nnoremap L w

" カラースキーム {{{1

syntax on
colorscheme hybrid

" プラグイン {{{1

" neobundle {{{2

...

" unite.vim {{{2

...

" neocomplcache {{{2

...
```

プラグインの設定のなかでプラグイン毎の設定もまとめたいので、折り畳みレベルを設定する。こうすると、折り畳みが入れ子になる。

## 2. modelineを有効にする

.vimrcのための設定を書きたいのでmodelineを有効にする。modelineの詳細は`:h modeline`を参照。

```vim:.vimrc
" モードラインを有効にする
set modeline

" 3行目までをモードラインとして検索する
set modelines=3
```

## 3. modelineで.vimrc用の設定をする

ファイルの最後（最初でもいいけど）に以下を追加する。

```vim:.vimrc
" vim: foldmethod=marker
" vim: foldcolumn=3
" vim: foldlevel=0
```

- markerで折りたたむようにする。
- 行番号の左に折りたたまれてる箇所が表示されてわかりやすくなる。
- デフォルトで折りたたんで表示する。（`foldlevel`より`foldlevelstart`の方が適切だと思ったけど、なんかうまくいかないのでとりあえず`foldlevel`を使ってます）

## スクリーンショット

以上の設定をすると、.vimrcはこんな感じで表示されるようになるはず。

![fold.png](https://qiita-image-store.s3.amazonaws.com/0/1044/80b00f4c-6c5f-5dc2-912c-4fcc212c5f90.png)

---

参考までに拙者の.vimrcのリンクも載せておく。

[dotfiles/.vimrc at master · naoty/dotfiles · GitHub](https://github.com/naoty/dotfiles/blob/master/.vimrc)

これと同じことを.zshrcでもやってるので、.vimrcにかぎらず設定ファイル全般で使えるテクニックだと思う。
