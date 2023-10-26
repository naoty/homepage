---
title: vimの便利機能
time: 2013-04-10 00:46
tags: ['vim']
---

## 入力補完

- インサートモードで`<C-n>`または`<C-p>`と打つと、補完候補が出てきます。

## バッファ

- 新しいファイルを開くと、バッファという領域にその中身が読み込まれます。過去に開いたファイルをまた開くときに便利です。
- 直前に開いたファイルに戻りたい場合によく使います。
- 個人的には、前後のバッファに移動したりバッファから履歴を削除するために以下のようなマッピングを設定しています。

```
nnoremap <Tab> :bnext<CR>
nnoremap <S-Tab> :bprevious<CR>
nnoremap <Leader>d :bdelete<CR>
```

- これでTabやShift+Tabで前後のバッファに移動できます。

## タブ

- vimにもブラウザのようなタブがあります。同時に多くのファイルを開きたいときによく使います。
- デスクトップPCであまり画面が大きくない場合、分割して複数のファイルを開くよりタブの方が出番が多いような気がします。
- 個人的には、前後のタブに移動したり新しいタブを開くために以下のようなマッピングを設定しています。

```
nnoremap <Leader>t :tabnew<CR>
nnoremap <Leader>n :tabnext<CR>
nnoremap <Leader>p :tabprev<CR>
```

## コマンド定義

- 文字コードを変換したりインデント量を変更する操作はけっこうやるので、自分でコマンドを定義して一発で操作できるようにするとラクですね。

```
command! Indent2 :setlocal tabstop=2 shiftwidth=2
command! Indent4 :setlocal tabstop=4 shiftwidth=4
command! ToSjis :e ++enc=sjis<CR>
```

- これで普通に`:Intent2`と打てばインデント量が2になります。
- 基本は`command! <Command name> <command>`です。コマンド名は大文字から始めなくちゃいけないようです。あとはいろいろオプションがあるので、詳しくは`:help command-nargs`を見てください。

## abbreviate

- abbreviateは長くてめんどくさい表記に略を設定できる機能です。

```
abbreviate #i #include
```

- 例えば上のように設定すると、"#i[space]"と入力すると勝手に"#import[space]"と変換してくれます。あとはコメントブロックを入力するのによく使われるみたいです。

```
abbreviate #b / ****************************
```

- abbreviateは応用としてtypoを修正するのにも便利です。"abbreviate"っていう単語がもうtypoしそうですね。あと、個人的に"receive"を"recieve"と書いてしまうことが多いので以下のように設定します。

```
" abbreviate <誤> <正>
abbreviate abbriviate abbreviate
abbreviate recieve receive
```

- abbreviateの設定をそのまま.vimrcに書くと、ハードコーディング感があって個人的に気持ち悪いので、.vim/abbreviate.vimという別ファイルに分けて書いてます。

```
" .vim/abbreviate.vim
abbreviate abbriviate abbreviate
abbreviate recieve receive

" .vimrc
source ~/.vim/abbreviate.vim
```

## filetype毎の設定ファイル

- 言語によってインデント量を変えたいってケースはほとんどのvimmerにあると思うんですが、そういうときに僕はfiletype毎の設定ファイルを用意しています。
- インデント量だけなら`autocmd`を使うのもアリだと思うのですが、上のabbreviateで設定したコメントブロックのように言語によって細かく設定を変えたいケースが地味にあるので、設定ファイルを用意する方法を採っています。

```
.vim
|- ftdetect
    |- filetype.vim
|- ftplugin
    |- javascript.vim
    |- make.vim
    |- ruby.vim
.vimrc
```

- 上のようなディレクトリ構造にしておくと、各filetypeごとに設定ファイルが読み込まれるようになります。詳しくは`:help filetype-plugin`らへんを見てください。
- 例えばMakefileを書く場合、インデントはspaceではなくtabしか使えないので、expandtabを無効にしたいところです。そこで、以下のようなファイルを用意します。

```
" .vim/ftplugin/make.vim
setlocal noexpandtab
setlocal tabstop=8
setlocal shiftwidth=8
```

## filetypeの指定

- Gemfileなど拡張子では判別できないファイルのfiletypeを指定したい場合、ftdetectが便利です。

```
.vim
|- ftdetect
    |- filetype.vim
.vimrc
```

```
" .vim/ftdetect/filetype.vim

autocmd BufRead,BufNewFile Gemfile setfiletype ruby
autocmd BufRead,BufNewFile Guardfile setfiletype ruby
autocmd BufRead,BufNewFile *.rabl setfiletype ruby
autocmd BufRead,BufNewFile *.jbuilder setfiletype ruby
autocmd BufRead,BufNewFile *.ru setfiletype ruby
```

- 上のように設定ファイルを用意すると、指定したファイルを自動的にrubyをfiletypeとして開いてくれます。

* * *

以上の設定はすべて僕の[dotfiles](https://github.com/naoty/dotfiles)に書いてあるので参考にしてみてください。

読み返してみると、その筋の方に怒られそうな気がしてきた…(´･ω･`)
