---
title: RubyのWebSocketサーバー「pingpong」を作った
time: 2013-10-11 02:25
tags: ['book', 'oss', 'ruby']
---

最近、「[Working with TCP Sockets](http://www.jstorimer.com/products/working-with-tcp-sockets)」って本を読んだ。Rubyでソケットと戯れつつ、7つくらいのWebサーバーのアーキテクチャを概観できるいい本だった。で、その中にイベント駆動モデルの実装とかノンブロッキングIOの実装について紹介されてて面白かったので、練習がてらWebSocketサーバーを作ることにした。

## PingPong

![f:id:naoty_k:20131011013521g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20131011/20131011013521.gif "f:id:naoty\_k:20131011013521g:plain")

[https://github.com/naoty/pingpong](https://github.com/naoty/pingpong)

卓球ハウスっぽい名前にした。数日で作ったので、他のクライアントへpush通知を行うことしかできない。たぶん大きいデータも送れない気がする。

## WebSocketサーバーの実装とは

まずは[RFC 6455](http://tools.ietf.org/html/rfc6455)のサーバーに関する部分を読んだ。最低限必要な部分をRubyで実装していった。例えば、以下のコードはHandshake（websocket接続の確立）の際にサーバーがクライアントに返すレスポンスヘッダーを作っている。

```
def response_headers
  [
    ["Upgrade", "websocket"],
    ["Connection", "Upgrade"],
    ["Sec-WebSocket-Accept", signature]
  ]
end

def signature
  value = @header["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
  hash = Digest::SHA1.digest(value)
  Base64.strict_encode64(hash)
end
```

ご覧のとおりハードコーディングがたくさん出てくる。RFCを読むと、このヘッダーにはこの値を入れなさいって書いてあることが多い。なので、それぞれの値の意味はわからないけどとりあえずRFCに従ってハードコーディングしている。`signature`というメソッドはあるヘッダーの値をRFCで以下のように定められた形式で生成している。（余談だけど、ここで`Base64.encode64`を使って小1時間ハマった。これは改行コードを入れるためここでは使えない。）

> A |Sec-WebSocket-Accept| header field. The value of this header field is constructed by concatenating /key/, defined above in step 4 in Section 4.2.2, with the string "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", taking the SHA-1 hash of this concatenated value to obtain a 20-byte value and base64-encoding (see Section 4 of [RFC4648]) this 20-byte hash.

## イベント駆動モデルとノンブロッキングIO

push通知はイベント駆動モデルというアーキテクチャを使って実装した。イベント駆動モデルはマルチプロセスやマルチスレッドとは違ってシングルスレッドで多数のリクエストを並行処理する。具体的には、websocket接続の確立に成功したソケットを配列に入れておき、ループ内でそれらのソケットにread/writeしていく。このとき、read/writeがブロッキングしてしまうとすべての処理がそこで止まってしまうので、read/writeの前に`select(2)`等を使ってread/write可能なソケットだけ選択してread/writeを行う。これがノンブロッキングIOだと思う（だよね…？）。

実際のコードは以下の通り。

```
def start
  @sockets = {}
  @message_queue = []

  loop do
    to_read = @sockets.values << @server
    to_write = @sockets.values
    readables, writables, _ = IO.select(to_read, to_write)

    readables.each do |socket|
      if socket == @server
        establish_connection
      else
        begin
          request = socket.read_nonblock(CHUNK_SIZE)
          message = Frame::Request.new(request).message
          # the message may be passed to a web application.
          @message_queue << Message.new(socket.fileno, message)
        rescue EOFError
          @sockets.delete(socket.fileno)
        end
      end
    end

    message = @message_queue.shift
    next if message.nil? || message.empty?

    writables.each do |socket|
      if socket.fileno != message.from
        data = Frame::Response.new(message.body).data
        socket.write_nonblock(data)
      end
    end
  end
end
```

## 感想

WebSocket、イベント駆動モデル、ノンブロッキングIO…という言葉はよく耳にしてきたけど理解したとは言えなかった。実際にWebSocketサーバーを書いてみると、コードに基づいて何が行われているのか正確に理解することができた。push通知も何やら凄そうな響きがするけど、実際に実装してみると特に難しいことはしていなかった。また、websocketの弱点と言われている、CPUヘビーな処理がなぜ弱点なのかも合点がいった。シングルスレッドで処理しているので、例えばレンダリングのような重い処理がひとつでも走ると、全体に悪影響が出るということだと理解した。
