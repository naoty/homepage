---
title: quickrun.vimでC++11をコンパイルする
time: 2013-08-21 11:36
tags: ['vim']
---

```vim
let g:quickrun_config.cpp = {
\   'command': 'g++',
\   'cmdopt': '-std=c++11'
\ }
```

- Mac OS X 10.8
- gcc 4.9（Homebrewで最新版をインストールした）
