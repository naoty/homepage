---
title: tmuxのlaunchctlエラー対策
time: 2012-09-25 11:51
---

Homebrewでインストールしたあと、自動起動させる設定を`launchctl`でロードしようとすると、tmuxではこんなエラーが出てくる。

```
% launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
Bug: launchctl.c:2425 (25957):13: (dbfd = open(g_job_overrides_db_path, O_RDONLY | O_EXLOCK | O_CREAT, S_IRUSR | S_IWUSR)) != -1
launch_msg(): Socket is not connected
```

この問題、`pbcopy`のときと同じ手法で解決できた。

```sh:.zshrc
if [[ "$TMUX" != "" ]]; then
  alias pbcopy="ssh 127.0.0.1 pbcopy"
  alias launchctl="ssh 127.0.0.1 launchctl"
fi
```
