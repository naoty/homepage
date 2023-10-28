---
title: MacPortsでMySQLをインストールしてからログインまで
time: 2011-02-22 16:45
tags: ['mysql']
---

1.MacPortsからmysql5とmysql5-serverをインストール。かなり時間がかかります。

```
$ sudo port install mysql5-server
---> Computing dependencies for mysql5-server
---> Dependencies to be installed: mysql5
---> Fetching mysql5
---> Verifying checksum(s) for mysql5
---> Extracting mysql5
---> Applying patches to mysql5
---> Configuring mysql5
---> Building mysql5
---> Staging mysql5 into destroot
---> Installing mysql5 @5.1.55_0
The MySQL client has been installed.
If you also want a MySQL server, install the mysql5-server port.
---> Activating mysql5 @5.1.55_0
---> Cleaning mysql5
---> Fetching mysql5-server
---> Verifying checksum(s) for mysql5-server
---> Extracting mysql5-server
---> Configuring mysql5-server
---> Building mysql5-server
---> Staging mysql5-server into destroot
---> Creating launchd control script
###########################################################
# A startup item has been generated that will aid in
# starting mysql5-server with launchd. It is disabled
# by default. Execute the following command to start it,
# and to cause it to launch at startup:
#
# sudo port load mysql5-server
###########################################################
---> Installing mysql5-server @5.1.55_0
******************************************************
* In order to setup the database, you might want to run
* sudo -u _mysql mysql_install_db5
* if this is a new install
******************************************************
---> Activating mysql5-server @5.1.55_0
---> Cleaning mysql5-server
```

2.所有者の変更。これをしないと、次の初期化でエラーが発生します。

```
$ sudo chown -R _mysql:_mysql /opt/local/var/db/mysql5
```

3.初期化。

```
$ sudo -u _mysql mysql_install_db5
Installing MySQL system tables...
110222 16:22:37 [Warning] '--skip-locking' is deprecated and will be removed in a future release. Please use '--skip-external-locking' instead.
110222 16:22:37 [Warning] '--default-character-set' is deprecated and will be removed in a future release. Please use '--character-set-server' instead.
110222 16:22:37 [Warning] '--log' is deprecated and will be removed in a future release. Please use ''--general_log'/'--general_log_file'' instead.
OK
Filling help tables...
110222 16:22:37 [Warning] '--skip-locking' is deprecated and will be removed in a future release. Please use '--skip-external-locking' instead.
110222 16:22:37 [Warning] '--default-character-set' is deprecated and will be removed in a future release. Please use '--character-set-server' instead.
110222 16:22:37 [Warning] '--log' is deprecated and will be removed in a future release. Please use ''--general_log'/'--general_log_file'' instead.
OK

To start mysqld at boot time you have to copy
support-files/mysql.server to the right place for your system

PLEASE REMEMBER TO SET A PASSWORD FOR THE MySQL root USER !
To do so, start the server, then issue the following commands:

/opt/local/lib/mysql5/bin/mysqladmin -u root password 'new-password'
/opt/local/lib/mysql5/bin/mysqladmin -u root -h nkaneko.reji password 'new-password'

Alternatively you can run:
/opt/local/lib/mysql5/bin/mysql_secure_installation

which will also give you the option of removing the test
databases and anonymous user created by default. This is
strongly recommended for production servers.

See the manual for more instructions.

You can start the MySQL daemon with:
cd /opt/local ; /opt/local/lib/mysql5/bin/mysqld_safe &

You can test the MySQL daemon with mysql-test-run.pl
cd /opt/local/mysql-test ; perl mysql-test-run.pl

Please report any problems with the /opt/local/lib/mysql5/bin/mysqlbug script!
```

4.設定ファイルを作成。

```
$ sudo cp /opt/local/share/mysql5/mysql/my-small.cnf /opt/local/share/mysql5/my.cnf
```

5.起動。初期化しないとエラーが発生します。

```
$ sudo /opt/local/share/mysql5/mysql/mysql.server start
Password:
Starting MySQL
.. SUCCESS!
```

6.ログイン。

```
$ mysql5 -u root
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.1.55-log Source distribution

Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
This software comes with ABSOLUTELY NO WARRANTY. This is free software,
and you are welcome to modify and redistribute it under the GPL v2 license

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

7..bashrcにalias設定

```
alias mysql='/opt/local/bin/mysql5'
```

参考

> [MySQLをインストール/設定](http://www.pleiades.or.jp/misc/mac/MySQL.html)  
> [Tips A La Carte - MacPortsでMySQLを初期化する際のエラー](http://pmoon.bbsnow.net/cgi-bin/tipsalac/?date=20090127)

- -

2011.6.17加筆  
転職先でセットアップした際にもこの手順で成功しました。環境は以下のとおりです。

- Mac OS X 10.6
