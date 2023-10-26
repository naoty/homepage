---
title: mrubyの初手
time: 2019-08-07T12:06:00+0900
tags: ["mruby"]
---

環境構築からmrubyを実行するCのコードをビルドするまで。

# 環境構築

```bash
$ mkdir hello-mruby
$ cd hello-mruby
$ vi Dockerfile
```

```diff
+FROM ruby:1.9
+RUN apt update && \
+  apt install -y bison --no-install-recommends && \
+  git clone https://github.com/mruby/mruby && \
+  cd mruby && \
+  ./minirake
+ENV PATH /mruby/bin:$PATH
+CMD ["bash"]
```

* [ドキュメント](https://github.com/mruby/mruby/blob/master/doc/guides/compile.md#prerequisites)を読むと、mrubyのビルドにはRuby 1.8か1.9、gcc、ar、bisonが必要とのことだった。`ruby:1.9`のイメージをベースにして、入ってなかったbisonだけインストールした。
* `./minirake`でmrubyがビルドされる。`bin/`以下にmrbcなどがあるので`PATH`に追加しておく。

```bash
$ docker build . -t naoty/hello-mruby
$ docker run -it --rm naoty/hello-mruby
% mirb
mirb - Embeddable Interactive Ruby Shell

> MRUBY_VERSION
 => "2.0.1"
> exit
% exit
```

* Dockerでmrubyをビルドできたことを確認した。

# サンプルコードを追加する

```bash
$ vi Dockerfile
```

```diff
 FROM ruby:1.9
 RUN apt update && \
   apt install -y bison --no-install-recommends && \
   git clone https://github.com/mruby/mruby && \
   cd mruby && \
   ./minirake
 ENV PATH /mruby/bin:$PATH
+WORKDIR /hello-mruby
+COPY . /hello-mruby/
 CMD ["bash"]
```

* サンプルコードを用意していくので`WORKDIR`を用意する。

```bash
$ vi hello.rb
```

```diff
+puts "Hello, mruby!"
```

```bash
$ docker build . -t naoty/hello-mruby
```

* サンプルコードを追加してDockerイメージに追加する。

```bash
$ docker run -it --rm -v $(pwd):/hello-mruby naoty/hello-mruby
% mrbc hello.rb
% exit
```

* カレントディレクトリをマウントしてイメージを起動する。
* mrbcで`hello.rb`から`hello.mrb`を生成する。マウントしているので、ホストにも`hello.mrb`が追加されている。

# Cからmrubyを実行する

```bash
$ vi hello.c
```

```diff
+#include <mruby.h>
+#include <mruby/dump.h>
+#include <stdio.h>
+
+int main() {
+  mrb_state *mrb = mrb_open();
+
+  FILE *fd = fopen("hello.mrb", "r");
+  mrb_load_irep_file(mrb, fd);
+
+  mrb_close(mrb);
+
+  return 0;
+}
```

* 生成した`hello.mrb`を実行するCのコードを書く。
* Cのコードは雰囲気で書いてるけど、`mrb_open`と`mrb_close`はお約束みたいで、`mrb_load_irep_file`によってmrbファイルを`load`するっぽい。

```bash
$ docker run -it --rm -v $(pwd):/hello-mruby naoty/hello-mruby
% gcc hello.c -I/mruby/include -L/mruby/build/host/lib -lmruby -lm -o hello
% ./hello
Hello, mruby!
```

* 書いたCのコードをビルドするため、もう一度Dockerイメージを起動する。
* `hello.c`を`gcc`でビルドするには、まずヘッダーファイル`mruby.h`のパスを指定する必要がある。mrubyのヘッダーファイルは`/mruby/include/`以下にあるので、`-I`オプションで指定している。
* 次に、mruby本体のソースコードとともに`hello.c`をビルドする必要がある。mrubyのライブラリは`/mruby/build/host/lib/libmruby.a`なので、`-L`オプションにパスを指定し、`-l`オプションで`mruby`を指定している。
* また、ビルドすると`/mruby/src/numeric.c:321: undefined reference to 'round'`のようなエラーが出てしまう。Mathのライブラリが足りなさそうなので、`-lm`オプションをつけて`libm.so`をリンクしている。
* 無事にビルドできた実行可能ファイルを実行してみると、`hello.rb`で書いたコードが実行された。

---

# 追記
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Rubyは最新で問題ないです！問題があれば直すべきなので1.9はやめましょう… / 1件のコメント <a href="https://t.co/uu6C7Y3g0k">https://t.co/uu6C7Y3g0k</a> “mrubyの初手” (1 user) <a href="https://t.co/2bFP5uPQAu">https://t.co/2bFP5uPQAu</a></p>&mdash; Uchio KONDO 🔫 (@udzura) <a href="https://twitter.com/udzura/status/1158943027215253510?ref_src=twsrc%5Etfw">August 7, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-conversation="none"><p lang="ja" dir="ltr">ドキュメント(docs/guides/compile.md) を「2.0 or later」にアップデートします</p>&mdash; Yukihiro Matsumoto (@yukihiro_matz) <a href="https://twitter.com/yukihiro_matz/status/1159001970536923137?ref_src=twsrc%5Etfw">August 7, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

とのことなので、ベースイメージを`ruby:2.6`にしてみたけど問題なく上記の手順ができた。
