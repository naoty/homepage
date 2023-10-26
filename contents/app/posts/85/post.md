---
title: nginx+rvmでPassengerが動いてない？
time: 2011-10-24 13:12
tags: ['rails']
---

- centos 5.5
- nginx
- rvm
- ruby 1.9.2
- passenger

という構成でRailsアプリケーションを動かそうとしたのですが、どうやらpassengerが動いてないみたいで（ずっと403 Forbidden）いろいろ調べてみました。

```
$ ps aux | grep Passenger
root 6819 0.0 0.3 16908 1740 ? Ssl Oct23 0:00 PassengerWatchdog
root 6822 0.0 0.4 32704 2404 ? Sl Oct23 0:00 PassengerHelperAgent
root 6824 0.0 1.6 107472 8172 ? Sl Oct23 0:00 Passenger spawn server

nobody 6845 0.0 0.5 51544 2904 ? Sl Oct23 0:00 PassengerLoggingAgent
naoty 7639 0.0 0.1 6040 568 pts/0 R+ 12:55 0:00 grep Passenger
```

- Passengerのプロセスは4つ起動しているようです。

```
$ rvmsudo passenger-status
[sudo] password for naoty:
```
