---
title: vimでtodoリストを書くためのtips
time: 2013-08-14 00:18
tags: ['vim']
---

vimでmarkdown書ける前提で、以下のような設定を書くと`- [ ]`のようなtodoリスト記法をラクに書いたり、Leader（デフォルトだと`\`）でオン・オフを切り替えられるようになる。

```vim:.vim/ftplugin/markdown.vim
" todoリストを簡単に入力する
abbreviate tl - [ ]

" 入れ子のリストを折りたたむ
setlocal foldmethod=indent

" todoリストのon/offを切り替える
nnoremap <buffer> <Leader><Leader> :call ToggleCheckbox()<CR>
vnoremap <buffer> <Leader><Leader> :call ToggleCheckbox()<CR>

" 選択行のチェックボックスを切り替える
function! ToggleCheckbox()
  let l:line = getline('.')
  if l:line =~ '\-\s\[\s\]'
    let l:result = substitute(l:line, '-\s\[\s\]', '- [x]', '')
    call setline('.', l:result)
  elseif l:line =~ '\-\s\[x\]'
    let l:result = substitute(l:line, '-\s\[x\]', '- [ ]', '')
    call setline('.', l:result)
  end
endfunction
```
