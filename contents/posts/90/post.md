---
title: rvm installでyamlがmakeできない件
time: 2011-11-05 18:42
tags: ['ruby']
---

> - CentOS 5.5 x86\_64

```
naoty$ sudo bash < curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer )
naoty$ su -
root# usermod -G wheel,rvm naoty
root# exit
naoty$ exit
local$ ssh
naoty$ sudo yum install -y gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison
naoty$ rvm install 1.9.3
...
Compiling yaml in /usr/local/rvm/src/yaml-0.1.4.
ERROR: Error running 'make ', please read /usr/local/rvm/log/ruby-1.9.3-p0/yaml/make.log
Installing yaml to /usr/local/rvm/usr
ERROR: Error running 'make install', please read /usr/local/rvm/log/ruby-1.9.3-p0/yaml/make.install.log
...
Install of ruby-1.9.3-p0 - #complete
```

```
naoty$ less /usr/local/rvm/log/ruby-1.9.3-p0/yaml/make.log
[2011-11-05 18:32:56] make 
make all-recursive
make[1]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4' に入ります
Making all in include
make[2]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4/include' に入ります
make[2]: `all' に対して行うべき事はありません.
make[2]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4/include' から出ます
Making all in src
make[2]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4/src' に入ります
if /bin/sh ../libtool --tag=CC --mode=compile gcc -DHAVE_CONFIG_H -I. -I. -I.. -I../include -g -O2 -MT api.lo -MD -MP -MF ".deps/api.Tpo" -c -o api.lo api.c; \
        then mv -f ".deps/api.Tpo" ".deps/api.Plo"; else rm -f ".deps/api.Tpo"; exit 1; fi
../libtool: line 466: CDPATH: command not found
../libtool: line 1144: func_opt_split: command not found
libtool: Version mismatch error. This is libtool 2.2.6b Debian-2.2.6b-2ubuntu1, but the
libtool: definition of this LT_INIT comes from an older release.
libtool: You should recreate aclocal.m4 with macros from libtool 2.2.6b Debian-2.2.6b-2ubuntu1
libtool: and run autoconf again.
make[2]: *** [api.lo] エラー 1
make[2]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4/src' から出ます
make[1]: *** [all-recursive] エラー 1
make[1]: ディレクトリ `/usr/local/rvm/src/yaml-0.1.4' から出ます
make: *** [all] エラー 2
```

なにこれ？(´･ω･`)
