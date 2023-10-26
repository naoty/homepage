---
title: VimによるRails開発環境の構築　ver.1
time: 2010-09-24 02:04
tags: ['rails', 'vim']
---

　これから本格的に開発を進めていくため、そろそろ開発環境を整えていこうと思っている。だが、いろいろ見ながらやっても、ぜんぜんうまくいかない。

環境

- Windows XP

導入したい開発環境

- [Vim 7.2-20100510 for Windows](http://www.kaoriya.net/#VIM72)
- [rails.vim](http://www.vim.org/scripts/script.php?script_id=1567)
- [project.vim](http://www.vim.org/scripts/script.php?script_id=69)

トライして失敗した手順

1. vimを上記リンクからダウンロードし、「C:\Program Files\vim」直下に配置。
2. rails.vimを上記リンクからダウンロードし、「rails.vim」を「C:\Program Files\vim\runtime\plugin」直下に、「rails.txt」を「C:\Program Files\vim\runtime\doc」直下に配置。
3. project.vimを上記リンクからダウンロードし、「project.vim」を「C:\Program Files\vim\runtime\plugin」直下に、「project.txt」を「C:\Program Files\vim\runtime\doc」直下に配置。
4. 「\_vimrc」を以下のように記述し、「C:\Program Files\vim」直下に配置。

```
" rails.vim
let g:rails_level=4
let g:rails_default_file="app/controllers/application.rb"
let g:rails_default_database="sqlite3"

" rubycomplete.vim
autocmd FileType ruby,eruby set omnifunc=rubycomplete#Complete
autocmd FileType ruby,eruby let g:rubycomplete_buffer_loading = 1
autocmd FileType ruby,eruby let g:rubycomplete_rails = 1
autocmd FileType ruby,eruby let g:rubycomplete_classes_in_global = 1
```

何も変化なし・・・。  
rails.vimとかディレクトリに入れておくだけじゃだめなんだろうか・・・。
