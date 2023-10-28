---
title: ローカルIPアドレスをtmuxのステータスラインに表示する
time: 2012-08-08 11:42
---

xip.ioを使うときにいちいち`ifconfig`打つのが面倒くさくなってきたので表示してみました。

![tmux_statusline](http://gyazo.com/0508093e26dcd9bc69ed2721f179b0ce.png?1344392749)

```sh:localip
#!/bin/sh

ifconfig en0 inet | sed -e '1d' -e 's/^.*inet //' -e 's/ netmask.*$//'
```

```sh:.tmux.conf
set-option -g status-right '[#(loadavg)][#(localip)][%Y/%m/%d %H:%M]'
set-option -g status-right-length 60
```
