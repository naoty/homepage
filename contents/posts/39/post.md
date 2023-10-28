---
title: Mac OS XにおけるJavaのバージョン変更
time: 2011-03-02 17:12
---

0.　環境

- Mac OS X 10.5.8
- Java 1.5.0\_26-b03（Before）
- Java 1.6.0\_22-b04-307（After）

※「ソフトウェア・アップデート」で最新版のJavaを取得できるので、事前に済ませておく

  

1.　Javaのバージョンの確認

```
$ java -version
```

2.　Java Preferences

- 「Finder \> アプリケーション \> ユーティリティ \> Java Preferences」にアクセス
- 有効にするJavaのバージョンをチェック
- 実行するJavaのバージョンをドラッグアンドドロップで優先順に上から並べる。一番上のバージョンが最優先に実行される。

※これでOKと思っていたら、アカウントによって優先的に実行されるバージョンが異なっていることが発覚。別の方法を模索。

  

3.　シンボリックリンクの張り替え

- 現在有効になっているJDKのバージョンは以下の「CurrentJDK」のシンボリックリンク先となる。

```
$ ls -la /System/Library/Frameworks/JavaVM.framework/Versions/
total 64
drwxr-xr-x 14 root wheel 476 2 23 16:39 ./
drwxr-xr-x 12 root wheel 408 2 23 16:39 ../
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.3@ -> 1.3.1
drwxr-xr-x 3 root wheel 102 9 29 2007 1.3.1/
lrwxr-xr-x 1 root wheel 5 2 17 14:14 1.4@ -> 1.4.2
lrwxr-xr-x 1 root wheel 3 11 15 13:08 1.4.1@ -> 1.4
drwxr-xr-x 8 root wheel 272 11 15 12:36 1.4.2/
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.5@ -> 1.5.0
drwxr-xr-x 9 root wheel 306 3 2 16:54 1.5.0/
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.6@ -> 1.6.0
lrwxr-xr-x 1 root wheel 59 2 23 16:39 1.6.0@ -> /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents
drwxr-xr-x 10 root wheel 340 2 23 16:39 A/
lrwxr-xr-x 1 root wheel 1 2 23 16:39 Current@ -> A
lrwxr-xr-x 1 root wheel 3 2 23 16:39 CurrentJDK@ -> 1.5
```

- 1.5のままじゃん（苦笑）
- ということで、シンボリックリンクを1.6に張り替える。

```
$ sudo ln -fsh 1.6 /System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK
```

- 再度、確認してみると確かにバージョンが切り替わった。これでOK。

```
$ ls -la /System/Library/Frameworks/JavaVM.framework/Versions/
total 64
drwxr-xr-x 14 root wheel 476 3 2 16:54 ./
drwxr-xr-x 12 root wheel 408 2 23 16:39 ../
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.3@ -> 1.3.1
drwxr-xr-x 3 root wheel 102 9 29 2007 1.3.1/
lrwxr-xr-x 1 root wheel 5 2 17 14:14 1.4@ -> 1.4.2
lrwxr-xr-x 1 root wheel 3 11 15 13:08 1.4.1@ -> 1.4
drwxr-xr-x 8 root wheel 272 11 15 12:36 1.4.2/
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.5@ -> 1.5.0
drwxr-xr-x 9 root wheel 306 3 2 16:54 1.5.0/
lrwxr-xr-x 1 root wheel 5 2 23 16:39 1.6@ -> 1.6.0
lrwxr-xr-x 1 root wheel 59 2 23 16:39 1.6.0@ -> /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents
drwxr-xr-x 10 root wheel 340 2 23 16:39 A/
lrwxr-xr-x 1 root wheel 1 2 23 16:39 Current@ -> A
lrwxr-xr-x 1 root wheel 3 3 2 16:54 CurrentJDK@ -> 1.6
```

```
$ java -version
java version "1.6.0_22"
Java(TM) SE Runtime Environment (build 1.6.0_22-b04-307-9M3263)
Java HotSpot(TM) 64-Bit Server VM (build 17.1-b03-307, mixed mode)
```
