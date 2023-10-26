---
title: VimによるRails開発環境の構築　ver.2
time: 2010-09-25 19:35
tags: ['rails', 'vim']
---

　ver.1で失敗した方法とは別の方法で再挑戦したところ、成功したっぽいです。ただ、ところどころ不安な点は残っています。

環境

- Windows XP

導入したい開発環境

- [Vim 7.2-20100510 for Windows](http://www.kaoriya.net/#VIM72)
- [rails.vim](http://www.vim.org/scripts/script.php?script_id=1567)
- [project.vim](http://www.vim.org/scripts/script.php?script_id=69)

成功したっぽい手順

- こちらの記事どおりにやったら、成功したっぽいです。感謝！

> [VimでRailsを快適に開発する（設定編）](http://silentpower2.blogspot.com/2009/07/vimrails.html)

スクリーンショット  
[![f:id:naotoknk:20100925193128j:image](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naotoknk/20100925/20100925193128.jpg "f:id:naotoknk:20100925193128j:image")](http://f.hatena.ne.jp/naotoknk/20100925193128)

今のところ不安が残るポイント

- 「Rserver」コマンドがエラーになる。
- FuzzyfinderというCommand+tでファイルを簡単に検索できる機能がついているらしいが、windowsに対応してなさそう・・・。Ctrl+tではタブができるだけです。
- rails.vimのAbbreviationが上書きされていて、tabキーを押すとキーワード補完になる。

とりあえず、何かの参考になれば、さいわいです。
