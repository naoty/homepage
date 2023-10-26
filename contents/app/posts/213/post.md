---
title: tmux 1.9でもウィンドウ作成時にパスを引き継ぐ
time: 2014-03-17 13:02
---

tmuxを1.9aにアップデートしたら、ウィンドウを作成したり分割したときにパスを引き継がなくなってしまった。[ChangeLog](http://sourceforge.net/p/tmux/tmux-code/ci/master/tree/CHANGES)を見てみると、default pathというものを廃止したとのことだった。元の挙動に戻すための設定も書いてあったので、`.tmux.conf`を以下のように修正した。

```conf:.tmux.conf
bind-key    c     new-window -c "#{pane_current_path}"
bind-key    v     split-window -h -c "#{pane_current_path}"
bind-key    C-v   split-window -h -c "#{pane_current_path}"
bind-key    s     split-window -v -c "#{pane_current_path}"
bind-key    C-s   split-window -v -c "#{pane_current_path}"
```

`new-window`や`split-window`のオプションに`-c "#{pane_current_path}"`を付けてあげるとパスを引き継ぐようになった。
