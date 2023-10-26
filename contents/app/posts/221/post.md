---
title: pecoでハッカーを検索
time: 2014-07-04 18:00
---

かなり前に[cui-about.me](http://cui-about.me)というサービスを作ったんだけど、[peco](http://peco.github.io/)と相性がいいことに気づいたので組み合わせてみた。

![f:id:naoty_k:20140704175901g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140704/20140704175901.gif "f:id:naoty\_k:20140704175901g:plain")

```
about() {
    if [$# -eq 0]; then
        local name=$(curl -s cui-about.me/users | peco)
    else
        local name=$1
    fi
    curl cui-about.me/$name
}
```
