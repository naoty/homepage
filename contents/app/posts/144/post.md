---
title: __FILE__と$0の違い
time: 2012-09-18 16:20
tags: ['ruby']
---

ググればいろんなところで解説されているけど、実際にコード書いて確かめてみた。

```ruby:filename.rb
puts "__FILE__: #{__FILE__}"
puts "$0: #{$0}"
```

```ruby:require_filename.rb
require_relative filename
```

```shell
% ruby filename.rb
__FILE__: filename.rb
$0: filename.rb
% ruby require_filename.rb
__FILE__: /Users/naoty/workspace/ruby/filename.rb
$0: require_filename.rb
```

- `__FILE__`は実行中のプログラムのファイル名（[リファレンス](http://miyamae.github.com/rubydoc-ja/1.9.3/#!/doc/spec=2fvariables.html?pseudo)によると、フルパスとは限らないみたい）
- `$0`は実行時に指定されたファイル名（相対パス）
- 以下のようなコードを見かけるのだけど、相対パスと絶対パスで一致しない場合は考慮されていないような気がする。。。

```ruby
if __FILE__ == $0
  # hogehoge
end
```
