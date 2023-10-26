---
title: 技術メモの管理
time: 2014-06-30 23:55
tags: ['lifehack']
---

今後ちゃんと学んだことをメモに残しておこうと思い直し、メモを管理する仕組みを整理した。

# 保存場所

`Dropbox/Documents/notes/`以下。複数のPC間で簡単に共有したいのでDropboxで管理する。

# メモを書く

まず以下のような関数を用意した。

```
note() {
    local note_path=$HOME/Dropbox/Documents/notes/$1
    if [! -e $note_path]; then
        touch $note_path
    fi
    open $note_path
}
```

`note <ファイル名>`でメモを書き始めることができる。

メモはすべてmarkdown形式で、エディタはvimを使うことにした。[vim-template](https://github.com/thinca/vim-template)というプラグインを使うことで、notes/\*.mdにマッチするファイルを以下のようなテンプレートで開くようにした。

```
---
title: expand('%:t:r') %>
date: strftime('%Y-%m-%d') %>
---
```

`<%=`と`%>`で囲われたコードはVim Scriptとして評価されて展開され、`<+CURSOR+>`の位置をカーソルの初期位置としてファイルが開く。このような設定はvim-templateのヘルプにあるのでそちらを参照してほしい。

# メモの検索

agとpecoを使う。agは高速なgrepということで、任意の文字列を含むファイルを検索する。

```
onote() {
    echo $(ag -l $1 $HOME/Dropbox/Documents/notes/) | peco | xargs open
}
```

template内で日付を必ず入れるようにしているので、日付で検索することもできるようになった。
