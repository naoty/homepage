---
title: Instant Railsのrubyコンソールでgitを使う
time: 2010-10-11 21:50
tags: ['git']
---

0.環境

- Windows XP
- Instant Rails 2.0（C:\InstantRails-2.0-win）

1.msysgitをインストール  
　インストールのときに「Adjusting your PATH environment」で2番目の「Run Git from the Windows Command Prompt」を選択。ここでは標準どおり「C:\Program Files」にインストールする。コマンドプロンプトで「git --version」としてみて、バージョンが表示されればOK。これでコマンドプロンプトでgitを使えるようになった。

2.Instant Railsのパスの設定  
　「C:\InstantRails-2.0-win\use\_ruby.cmd」を開く。「PATH」に「C:\Program Files\Git\cmd;」を追加。上書き保存。終了。これでInstant Railsのrubyコンソールからもgitが使えるようになった。

> 参考
> 
> - [Linux、Rails覚書き](http://taka3090.blog88.fc2.com/blog-entry-8.html)
> - [Rails Plugin Updates, SVN, and Piston 2.0.2 on Windows (Facebook）](http://ja-jp.facebook.com/note.php?note_id=80921572086)
