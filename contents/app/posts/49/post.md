---
title: さくらVPSに最新版GNU screenをインストールする
time: 2011-04-08 04:14
---

0.　環境

- CentOS（さくらVPS標準のもの）

1.　gitをインストールする

```
sudo vi /etc/yum/repos.d/CentOS-Base.repo
```

```
[dag]
name=Dag RPM Repository for Redhat EL5
baseurl=http://apt.sw.be/redhat/el$releasever/en/$basearch/dag
gpgcheck=1
enabled=0
gpgkey=http://dag.wieers.com/packages/RPM-GPG-KEY.dag.txt
```

```
sudo yum --enablerepo=dag -y install git
```

> 参考：[http://www.yuyak.com/585](http://www.yuyak.com/585)

2.　emacsをインストールする

```
sudo yum install emacs
```

> 参考：[http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html](http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html)

3.　m4をインストールする

```
cd
mkdir download
wget ftp://ftp.riken.go.jp/Linux/fedora/releases/11/Fedora/source/SRPMS/m4-1.4.12-2.fc11.src.rpm
sudo rpm -ivh --nomd5 m4-1.4.12-2.fc11.src.rpm
cd /usr/src/redhat/SPECS
sudo rpmbuild -ba m4.spec
cd ../RPMS/x86_64
rpm -Uvh m4-1.4.12-2.x86_64.rpm
```

> 参考：[http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html](http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html)

4.　autoconfをインストールする

```
cd ~/download
wget ftp://ftp.riken.go.jp/Linux/fedora/releases/11/Fedora/source/SRPMS/autoconf-2.63-2.fc11.src.rpm
sudo rpm -ivh --nomd5 autoconf-2.63-2.fc11.src.rpm
cd /usr/src/redhat/SPECS
sudo rpmbuild -ba autoconf.spec
cd ../RPMS/noarch
sudo rpm -Uvh autoconf-2.63-2.noarch.rpm
```

> 参考：[http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html](http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html)

5.　ncurses-develをインストールする

```
sudo yum install ncurses-devel.x86_64
```

> 参考：[http://cknbstr.tumblr.com/post/1154650974/tscreen-configure-error-no-tgetent-no](http://cknbstr.tumblr.com/post/1154650974/tscreen-configure-error-no-tgetent-no)

6.　GNU screenをインストールする

```
cd ~/screen/src
autoconf
autoheader
./configure
make
sudo make install
```

> 参考：  
> [http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html](http://blog.remora.cx/2010/04/gnu-screen-on-centos-54.html)

7.　インストールを確認する

```
screen --version
Screen version 4.01.00devel (GNU8cf5efc) 2-May-06
```
