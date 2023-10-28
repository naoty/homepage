---
title: HTMLやCSSの変更を自動でブラウザに反映させる
time: 2012-05-03 21:31
tags: ['rails']
---

## 概要
- LiveReloadをguardで起動する。
- すると、guardがHTMLやCSSの変更をキャッチしてLiveReloadでブラウザが自動でリロードされる。
- [これ](http://youtu.be/EZ8vy_cNMVQ)を見た方がはやい。
- サブディスプレイに複数のブラウザを立ちあげてLiveReloadをオンにして、ファイルの変更がいっぺんにそれらのブラウザに反映されるのが感動。鳥肌もの。

## 手順
1. `guard-livereload`をbundleでいれる
2. `guard init livereload`で`Guardfile`を設定する。
3. `guard`でファイルの変更のウォッチをスタート。
4. ブラウザのアドオンでLiveReloadをオンにする

## Rails
```ruby:Gemfile
group :development, :test do
  gem 'rb-fsevent' if RUBY_PLATFORM =~ /darwin/i
  gem 'guard-livereload'
end
```

```
$ bundle install
$ guard init livereload
$ guard
```

## アドオンたち
- Firefox：[https://addons.mozilla.org/ja/firefox/addon/livereload/](https://addons.mozilla.org/ja/firefox/addon/livereload/)、最新版（v12）ではうまく動かなかったので、これのためだけにv5までダウングレードしてる。
- Chrome：[https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei)
- Safariもあるらしい。
- IEにもほしいけど、どうなんだろう。
