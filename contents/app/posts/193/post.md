---
title: カーソル上の単語でvim-refを検索する
time: 2013-06-26 00:42
tags: ['vim']
---

```vim:.vim/after/ftplugin/php.vim
nmap <F4> :execute 'Ref phpmanual ' . expand('<cword>') <CR>
```

```vim:.vim/ftplugin/ruby.vim
nnoremap <F4> :execute 'Ref refe ' . expand('<cword>') <CR>
```

`expand('<cword>')`でカーソル上の単語が取れる。この関数をマッピングで使ううまいやり方わからなかったけど、これでとりあえずいけた。
