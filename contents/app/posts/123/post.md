---
title: command line toolsのみインストールしたときのpathの設定
time: 2012-05-22 10:13
---

command line toolsのみ入れてXcode入れないとき、`brew doctor`すると、以下のような警告が出ます。

```
$ brew doctor
Error: Your Xcode is configured with an invalid path.
You should change it to the correct path. Please note that there is no correct
path at this time if you have *only* installed the Command Line Tools for Xcode.
If your Xcode is pre-4.3 or you installed the whole of Xcode 4.3 then one of
these is (probably) what you want:

    sudo xcode-select -switch /Developer
    sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer

DO NOT SET / OR EVERYTHING BREAKS!
```

これまでdoctorの忠告は無視してたのですが、Homebrewでmacvimを入れようとしたとき、「xcodebuildが見つからない」エラーに直面したので、とりかかることに。

とりあえずこうしたら、doctorがOK出してくれた。

```
$ sudo xcode-select -switch /
$ brew doctor
Your system is raring to brew.
```

「あなたのシステムはbrewしたくてウズウズしている！」だってさ。
でも、これでいいのかちょっと微妙…(´･ω･`)
