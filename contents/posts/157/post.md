---
title: ちょっとしたiPadアプリを作った話
time: 2012-11-26 00:08
tags: ['ios']
---

> シンプルなBGMアプリほしい
> 
> — なおてぃーさん (@naoty\_k) [11月 23, 2012](https://twitter.com/naoty_k/status/271989557321420800)

<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

> 好きな曲のyoutubeのリンクをHerokuとかにアップしておいて、iPadでそれらをリストを取得してエンドレスで聞けるようにしたい
> 
> — なおてぃーさん (@naoty\_k) [11月 23, 2012](https://twitter.com/naoty_k/status/271989962881265664)

<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

↑というのを思いつき、2日間でプロトタイプを作ってみた。

![http://distilleryimage9.s3.amazonaws.com/25d59dd6361c11e2b3e122000a1f9a4f_7.jpg](http://distilleryimage9.s3.amazonaws.com/25d59dd6361c11e2b3e122000a1f9a4f_7.jpg)

ジョジョOPでテンション上げながら。

![http://distilleryimage10.s3.amazonaws.com/5837a310363e11e28ed022000a1fbc58_7.jpg](http://distilleryimage10.s3.amazonaws.com/5837a310363e11e28ed022000a1fbc58_7.jpg)

サーバー側をRails on Herokuで作って、そっからデータを取得までできた。

アプリとサーバーのコードはこちらで公開してます。

- [https://github.com/naoty/RemoteTrack](https://github.com/naoty/RemoteTrack)
- [https://github.com/naoty/RemoteTrack-server](https://github.com/naoty/RemoteTrack-server)

## YouTube再生プレイヤー

YouTubeの再生プレイヤーは`UIWebView`にiframeを埋め込んで実装した。`MPMoviePlayerController`というのでもできそうな感じがするけど、時間かかりそうなので、とりあえず`UIWebView`を選択。

iframeはYoutubeの動画の下のところから取ってこれるものを使う。↓こんなの。

```
<iframe width="560" height="315" src="http://www.youtube.com/embed/UqFvrjhbO8c?rel=0" frameborder="0" allowfullscreen></iframe>
```

あとは、`UITableView`で選択した動画のIDを`UIWebView`に渡してリロードすることで、動画を切り替える。

## サーバーとの通信

サーバーとの通信は`AFNetworking`という便利ライブラリを使って実装した。外部ライブラリのインストールには`CocoaPods`を初めて使ってみた。RailsのBundlerに慣れると、iOSの外部ライブラリの管理がしんどく感じるけど、これでだいぶ楽になれる。

```
platform :ios, '6.0'
pod 'AFNetworking'
```

↑のようなファイルを`Podfile`という名前でプロジェクトのルートディレクトリに置いて（`Gemfile`っぽい）

```
$ pod install
```

して、できた`*.xcworkspace`を方を使うと簡単に外部ライブラリを使えるようになる。

## 自動再生

ここまではそんなに時間がかからなかったけど、ここから

- HTMLがロードされたら自動で動画を再生する
- 動画が終了したら自動で次の曲に移る

の2つを実装するのに、相当手こずってる（現在進行形）。

YouTubeのiFrameプレイヤーをJavaScriptで制御する[YouTube Player API](https://developers.google.com/youtube/iframe_api_reference?hl=ja)というものがあるので、これを使ってプレイヤーのロード時、動画再生終了時のイベントを受け取る。詳しい実装方法はリンク先のとおりだけど、ポイントは以下のところ。

```
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        document.location = "api://didEndedMovie";
    }
}
```

これで再生終了時のイベントを受け取って、`api://didEndedMovie`をロードすることができる。

`UIWebView`でのロードは`UIWebViewDelegate`でキャッチすることができるので、これをうまく使うことでJSからアプリ側への通知を実装する。

```
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSString *requestString = [[request URL] absoluteString];

    if ([requestString isEqualToString:@"api:didEndedMovie"]) {
        // 再生終了時の処理をここに実装する

        return NO;
    }

    return YES;
}
```

このデリゲートメソッドの返り値を`YES`にすると`UIWebView`はページ遷移するが、`NO`にするとページ遷移しない。リクエスト先を見て`api://didEndedMovie`であれば、再生終了時の処理を実行し`NO`を返す。

これで再生終了時に次の動画に自動的に移すことが可能

…かと思いきや、なぜかうまくいかないorz

デバッグをしてみると、どうやらJSの`onPlayerStateChange`が呼ばれていないっぽい。ブラウザではうまくいっていたので、`UIWebView`のみで起きる現象のようだけど、原因がよくわからない…。というところで、今週の土日が終わりました。

* * *

以下のページを参考にさせていただきました。ありがとうございました。

- [http://qiita.com/items/66457a0d5fe55877dea1](http://qiita.com/items/66457a0d5fe55877dea1)
- [http://d.hatena.ne.jp/ntaku/20111103/1320288456](http://d.hatena.ne.jp/ntaku/20111103/1320288456)
- [https://developers.google.com/youtube/iframe\_api\_reference?hl=ja](https://developers.google.com/youtube/iframe_api_reference?hl=ja)
