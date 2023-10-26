---
title: vimでTodoリスト
time: 2013-04-28 00:29
tags: ['vim']
---

今までいろんなTodo管理アプリを試してきたけど、「GUIアプリほど高機能はいらない」「ターミナル上でtodoを確認したい」という理由でvimでTodoリストを書くようになった。[これ](https://github.com/blog/1375-task-lists-in-gfm-issues-pulls-comments)によるとGithubがGithub Flavored MarkdownにTodoリスト記法を実装したようなので、これに倣ってmarkdownでTodoリストを書くことにした。

## todoコマンド

まず、Todoリストを開くコマンドをaliasで定義してみた。これで`todo`でTodoリストを確認できる。さらに、Dropbox上にファイルを置けば複数PCで共有できるので、オフィスのPCとプライベートPCでTodoリストを共用できる。

```
# .zshrc

if [-e "$HOME/Dropbox"]; then
  alias todo="$EDITOR $HOME/Dropbox/.todo.md"
else
  alias todo="$EDITOR $HOME/.todo.md"
end
```

## vimでmarkdownを書く準備

次に、vimでmarkdownを書く準備をする。普通に\*.mdを開くとmodula2というfiletypeで認識されてしまい、markdownファイルとして見なされないので、便利プラグインをインストールする。

```
" .vimrc

NeoBundle 'tpope/vim-markdown'
```

## 折り返しを有効にする

これだけでも十分なんだけど、より使いやすくするための設定を自分なりに考えてみた。まず、一行が長くなるとリストとしては見づらいので、普段は折り返さないけどmarkdownのときだけ折り返すようにしてみた。

```
" .vim/ftplugin/markdown.vim

" 折り返しを有効にする
set wrap

" 80文字で折り返す
set textwidth=80

" マルチバイト文字の場合も折り返しを有効にする
set formatoptions+=m
```

## Todoリストを簡単に書く

上でふれたGithubが実装したTodoリスト記法`- []`, `- [x]`を簡単に入力するための設定も書いた。abbreviateを使うと略記を登録することができる。下の設定では`tl<space>`と入力すると`- []`と自動的に変換される。さらに、Todoリストのある行の上で`<Leader>`を2回おすと（僕は`<Leader>`を`<space>`にしてる）、チェックをon/off切り替えられる。

```
" .vim/ftplugin/markdown.vim

" todoリストを簡単に入力する
abbreviate tl - []

" todoリストのon/offを切り替える
nnoremap <buffer> <Leader><Leader> :call ToggleCheckbox()<CR>

function! ToggleCheckbox()
  let l:line = getline('.')
  if l:line =~ '^\-\s\[\s\]'
    let l:result = substitute(l:line, '^-\s\[\s\]', '- [x]', '')
    call setline('.', l:result)
  elseif l:line =~ '^\-\s\[x\]'
    let l:result = substitute(l:line, '^-\s\[x\]', '- []', '')
    call setline('.', l:result)
  end
endfunction
```

## スクリーンショット

普段は下のようにtmuxで画面を分割して小さいウィンドウ（右上）にTodoリストを表示しながら開発している。

![f:id:naoty_k:20130428002301p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130428/20130428002301.png "f:id:naoty\_k:20130428002301p:plain")
