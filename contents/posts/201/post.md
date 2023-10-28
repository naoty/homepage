---
title: Unite.vimで.gitignoreで無視したファイルを候補から除外する
time: 2013-08-22 17:34
tags: ['vim']
---

Unite.vimでfile_recとかgrepとかでvendor/bundle以下のgemとかが出てきてウザいときがある。そこで`.gitignore`で無視したファイルを候補から除外するように設定した。

```vim:.vimrc
" .gitignoreで指定したファイルと.git/以下のファイルを候補から除外する
function! s:unite_gitignore_source()
  let sources = []
  if filereadable('./.gitignore')
    for file in readfile('./.gitignore')
      " コメント行と空行は追加しない
      if file !~ "^#\\|^\s\*$"
        call add(sources, file)
      endif
    endfor
  endif
  if isdirectory('./.git')
    call add(sources, '.git')
  endif
  let pattern = escape(join(sources, '|'), './|')
  call unite#custom#source('file_rec', 'ignore_pattern', pattern)
  call unite#custom#source('grep', 'ignore_pattern', pattern)
endfunction
call s:unite_gitignore_source()
```

Vim Scriptはほとんど書いたことがないのでアレかもしれない。ただ`.gitignore`を一行ずつロードしてリストに追加してjoinしてエスケープしてUnite.vimの設定に追加してるだけ。ついでに`.git`以下も除外するようにした。
