---
title: CentOSにmysqlを入れて起動するまでのメモ
time: 2011-10-17 21:58
tags: ['mysql']
---

１．rpmでインストール

```
naoty$ yum list | grep mysql-server
mysql-server.x86_64 5.0.77-4.el5_6.6 base
```

- yumだと古いバージョンしかインストールできないみたいです。
- なので、rpmでインストールします。

```
naoty$ mkdir src
naoty$ cd src
naoty$ wget http://dev.mysql.com/get/Downloads/MySQL-5.5/MySQL-server-5.5.16-1.linux2.6.x86_64.rpm/from/http://ftp.iij.ad.jp/pub/db/mysql/
naoty$ sudo rpm -i MySQL-server-5.5.16-1.linux2.6.x86_64.rpm
naoty$ wget http://dev.mysql.com/get/Downloads/MySQL-5.5/MySQL-client-5.5.16-1.linux2.6.x86_64.rpm/from/http://ftp.iij.ad.jp/pub/db/mysql/
naoty$ sudo rpm -i MySQL-client-5.5.16-1.linux2.6.x86_64.rpm
```

- インストールするのは、mysql-serverとmysql-clientです。
- 他にもいろいろあるようですが、いまのところは必要なさそうです。

２．起動

```
naoty$ sudo mysqld_safe > /dev/null &
```

- インストールしたときのメッセージにしたがってmysqld\_safeで起動
- /dev/nullはゴミ箱みたいなものだそうです。ゴミ箱に出力して、&でバックグラウンドで実行です。

３．初期設定

```
naoty$ sudo mysql_secure_installation
...
Set root password? [Y/n] Y
...
Remove anonymous users? [Y/n] Y
...
Disallow root login remotely? [Y/n] Y
...
Remove test database and access to it? [Y/n] Y
...
Reload privilege tables now? [Y/n] Y
...
```

- インストールしたときに強く推奨されたmysql\_secure\_installationで堅牢な初期設定をします。
- 質問にはぜんぶ「Y」

４．クライアント起動

```
naoty$ mysql -u root -p
```

- -

2011.10.18追記

```
naoty$ bundle install --path vendor/bundle
...
Installing mysql2 (0.3.7) with native extensions
Gem::Installer::ExtensionBuildError: ERROR: Failed to build gem native extension.
...
checking for rb_thread_blocking_region()... yes
checking for mysql_query() in -lmysqlclient... no
checking for main() in -lm... yes
checking for mysql_query() in -lmysqlclient... no
checking for main() in -lz... yes
checking for mysql_query() in -lmysqlclient... no
checking for main() in -lsocket... no
checking for mysql_query() in -lmysqlclient... no
checking for main() in -lnsl... yes
checking for mysql_query() in -lmysqlclient... no
checking for main() in -lmygcc... no
checking for mysql_query() in -lmysqlclient... no
...
```

- rails3.1でmysqlアダプターをインストールしようとしたところ上記のようなエラーが発生しました。
- どうやらライブラリが足りないようなので、共有ライブラリをrpmでインストールします。

```
naoty$ cd src
naoty$ wget http://dev.mysql.com/get/Downloads/MySQL-5.5/MySQL-shared-5.5.16-1.linux2.6.x86_64.rpm/from/http://ftp.jaist.ac.jp/pub/mysql/
naoty$ sudo rpm -i MySQL-shared-5.5.16-1.linux2.6.x86_64.rpm
```

```
naoty$ bundle install --path vendor/bundle
...
Installing mysql2 (0.3.7) with native extensions
Gem::Installer::ExtensionBuildError: ERROR: Failed to build gem native extension.
...
checking for rb_thread_blocking_region()... yes
checking for mysql_query() in -lmysqlclient... yes
checking for mysql.h... no
checking for mysql/mysql.h... no
```
