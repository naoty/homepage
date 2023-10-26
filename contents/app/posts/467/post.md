---
title: ミニマムなgradleプロジェクト
time: 2022-01-25 23:39
tags: ["gradle"]
---

なにかを理解するときにミニマムな単位から一つずつステップアップして理解していきたいんだけど、gradleの場合、`gradle init`で対話型のセットアップを求められてしまうため、ミニマムなプロジェクト構成を探ってみた。

# 起動
無から始める。まずは作業用ディレクトリを作る。

```
$ mkdir hello-gradle
$ cd hello-gradle
```

まだ何もないけど、タスクのリストを出すコマンドを実行してみる。

```
$ gradle tasks

FAILURE: Build failed with an exception.

* What went wrong:
Directory '/Users/naoty/src/github.com/naoty/hello-gradle' does not contain a Gradle build.

A Gradle build should contain a 'settings.gradle' or 'settings.gradle.kts' file in its root directory. It may also contain a 'build.gradle' or 'build.gradle.kts' file.

To create a new Gradle build in this directory run 'gradle init'

(snip)
```

`gradle init`を実行してくれ、と言われるけどいろいろできてしまうので無視する。メッセージによると`settings.gradle`があるとよさそうなので、作る。

```
$ touch settings.gradle
$ gradle tasks

> Task :tasks

------------------------------------------------------------
Tasks runnable from root project 'hello-gradle'
------------------------------------------------------------

Build Setup tasks
-----------------
init - Initializes a new Gradle build.
wrapper - Generates Gradle wrapper files.

Help tasks
----------

(snip)
```

タスクのリストが表示された。

# ビルド
次にJavaのソースコードをクラスファイルにコンパイルしたい。

「gradle java」で検索するとJavaプラグインというものがあると知る。[公式ドキュメント](https://docs.gradle.org/current/userguide/java_plugin.html)に目を通す。`build.gradle`を作って次のように書くとよさそう。

```diff
+plugins {
+  id 'java'
+}
```

タスクのリストを表示してみる。

```
$ gradle tasks

> Task :tasks

------------------------------------------------------------
Tasks runnable from root project 'hello-gradle'
------------------------------------------------------------

Build tasks
-----------
assemble - Assembles the outputs of this project.
build - Assembles and tests this project.
buildDependents - Assembles and tests this project and all projects that depend on it.
buildNeeded - Assembles and tests this project and all projects it depends on.
classes - Assembles main classes.
clean - Deletes the build directory.
jar - Assembles a jar archive containing the main classes.
testClasses - Assembles test classes.

Build Setup tasks
-----------------
init - Initializes a new Gradle build.
wrapper - Generates Gradle wrapper files.

(snip)
```

ビルド用のタスクが追加された。さっそく実行してみる。

```
$ gradle build

BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
$ tree .
.
├── build
│   ├── libs
│   │   └── hello-gradle.jar
│   └── tmp
│       └── jar
│           └── MANIFEST.MF
├── build.gradle
└── settings.gradle

4 directories, 4 files
```

`build`ディレクトリにjarファイルが作られている。jarの中身はマニフェストファイルのみだった。

もう少しドキュメントを見ていると[Project layout](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_project_layout)という章があるので、これを参考にビルドしたいソースコードを置いてみる。

```
$ mkdir -p src/main/java/hello
$ touch src/main/java/hello/App.java
$ gradle build

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
$ tree .
.
├── build
│   ├── classes
│   │   └── java
│   │       └── main
│   ├── generated
│   │   └── sources
│   │       ├── annotationProcessor
│   │       │   └── java
│   │       │       └── main
│   │       └── headers
│   │           └── java
│   │               └── main
│   ├── libs
│   │   └── hello-gradle.jar
│   └── tmp
│       ├── compileJava
│       │   └── previous-compilation-data.bin
│       └── jar
│           └── MANIFEST.MF
├── build.gradle
├── settings.gradle
└── src
    └── main
        └── java
            └── hello
                └── App.java

19 directories, 6 files
```

いろいろなファイルが生成されるようになった。

# 実行
次に実行可能ファイルを生成して実行できるようにしたい。まずは空の`src/main/java/hello/App.java`を編集して`main`を実装しておく。

```diff
+package hello;
+
+public class App {
+    public static void main(String[] args) {
+        System.out.println("Hello, gradle!");
+    }
+}
```

gradleで実行可能ファイルを生成するにはApplicationプラグインというものを使うといいらしい。[公式ドキュメント](https://docs.gradle.org/current/userguide/application_plugin.html)によると、ApplicationプラグインはJavaプラグインを内包しているようなので、これまでの設定をそのまま使うことができる。

公式ドキュメントに沿ってbuild.gradleに必要最小限の設定を追加する。

```diff
 plugins {
-  id 'java'
+  id 'application'
 }
+
+application {
+  mainClass = 'hello.App'
+}
```

タスクのリストを確認すると、確かにこれまでのタスクに加えて`run`が追加されている。

```
$ gradle tasks

> Task :tasks

------------------------------------------------------------
Tasks runnable from root project 'hello-gradle'
------------------------------------------------------------

Application tasks
-----------------
run - Runs this project as a JVM application

Build tasks
-----------
(snip)
```

では、実行してみる。

```
$ gradle run

> Task :run
Hello, gradle!

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

# 依存ライブラリ
次に依存するライブラリを追加したい。依存ライブラリの追加はJavaプラグインの機能なので、Applicationプラグインでも利用できる。Apache Commons Lang 3を追加してみる。

依存関係の設定を[公式ドキュメント](https://docs.gradle.org/current/userguide/dependency_management_for_java_projects.html)を見ながら書いてみる。

```diff
 plugins {
     id 'application'
 }
 
 application {
     mainClass = 'hello.App'
 }
+
+repositories {
+    mavenCentral()
+}
+
+dependencies {
+    implementation 'org.apache.commons:commons-lang3:3.12.0'
+}
```

そして、ソースコードから利用する。

```diff
 package hello;

+import org.apache.commons.lang3.StringUtils;
+
 public class App {
     public static void main(String[] args) {
-        System.out.println("Hello, gradle!");
+        String text = null;
+        if (StringUtils.isEmpty(text)) {
+            System.out.println("text is empty!");
+        } else {
+            System.out.println("text is not empty!");
+        }
+    }
 }
```

実行してみる。

```
$ gradle run

> Task :run
text is empty!

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

無からライブラリを使ったコードを実行できるところまで構築できた。他にもテストのための設定も必要になるだろうけど、Javaプラグインや依存関係の設定方法をもう少し調べれば難しくないだろう。

# まとめ
ここまでで学んだことを整理する。

* ルートディレクトリに`build.gradle`があればgradleはとりあえず動く。
* JavaプラグインでJavaのソースコードのビルドや依存関係に関するタスクが使えるようになる。`src/{main,text}/java/`以下にソースコードを置くことでビルドできる。
* さらに、Javaプラグインを内包するApplicationプラグインを使うことで実行できるようになる。
