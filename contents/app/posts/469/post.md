---
title: macOSにJavaをインストールする
time: 2022-02-15 21:47
tags: ["java"]
---

Javaを使った開発を初めてしていくことになりそうなので、Javaの開発環境をセットアップするにあたって調べたことを整理した。初めてのJavaなので、間違った内容もあるかもしれない。

まずはデフォルトでインストールされているJavaを確認する。

```
% /usr/libexec/java_home -V
Matching Java Virtual Machines (2):
    1.8.202.08 (x86_64) "Oracle Corporation" - "Java" /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
    1.8.0_202 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home
/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
```

OracleのJDK 8（1.8）がデフォルトではインストールされているようだ。Oracle版OpenJDKビルド済みバイナリではなく、Oracle JDKと思われる。

Oracle JDKは現在は無償での利用に制限があるようなので、使わないようにしたい。その代わり、OpenJDKを使うようにする。OpenJDKのビルド済みバイナリにはさまざまなディストリビューションがあるが、[Adoptium](https://adoptium.net/)（旧AdoptOpenJDK）が配布しているTemurinを使ってみる。

```
% brew install --cask temurin 
% /usr/libexec/java_home -V
Matching Java Virtual Machines (3):
    17.0.2 (x86_64) "Eclipse Temurin" - "Eclipse Temurin 17" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
    1.8.202.08 (x86_64) "Oracle Corporation" - "Java" /Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
    1.8.0_202 (x86_64) "Oracle Corporation" - "Java SE 8" /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

`java_home 17`でインストールしたTemurinのホームディレクトリが返るため、`JAVA_HOME`にセットする。

```bash
export JAVA_HOME=`/usr/libexec/java_home 17`
```

```
% java -version
openjdk version "17.0.2" 2022-01-18
OpenJDK Runtime Environment Temurin-17.0.2+8 (build 17.0.2+8)
OpenJDK 64-Bit Server VM Temurin-17.0.2+8 (build 17.0.2+8, mixed mode, sharing)
```

Temurinが使われるようになった。

IntelliJ IDEAで利用する場合にはプロジェクト設定からSDKをTemurinに設定する。

![IntelliJ IDEA](./intellij-idea.png "プロジェクト設定")
