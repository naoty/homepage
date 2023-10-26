---
title: vim高速移動
time: 2013-05-22 00:13
tags: ['vim']
---

下を.vimrcに書くと、`H`, `J`, `K`, `L`で高速移動できる。

```vim:.vimrc
noremap H b
noremap J }
noremap K {
noremap L w
```
