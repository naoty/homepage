---
title: ruby-2.0.0-preview1をインストールしてみた
time: 2012-11-09 00:05
tags: ['ruby']
---

## 環境
- Mountain Lion
- rvm
- Homebrew

## 作業メモ

```sh
$ rvm get stable
```
- RVMをアップデートしておく。

```sh
$ rvm install ruby-2.0.0-preview1
No binary rubies available for: osx/10.8/x86_64/ruby-2.0.0-preview1.
Continuing with compilation. Please read 'rvm mount' to get more information on binary rubies.
Building 'ruby-2.0.0-preview1' using clang - but it's not (fully) supported, expect errors.
Installing Ruby from source to: /Users/naoty/.rvm/rubies/ruby-2.0.0-preview1, this may take a while depending on your cpu(s)...
ruby-2.0.0-preview1 - #downloading ruby-2.0.0-preview1, this may take a while depending on your connection...
ruby-2.0.0-preview1 - #extracting ruby-2.0.0-preview1 to /Users/naoty/.rvm/src/ruby-2.0.0-preview1
ruby-2.0.0-preview1 - #extracted to /Users/naoty/.rvm/src/ruby-2.0.0-preview1
ruby-2.0.0-preview1 - #configuring
ruby-2.0.0-preview1 - #compiling
ruby-2.0.0-preview1 - #installing 
Removing old Rubygems files...
Installing rubygems-1.8.24 for ruby-2.0.0-preview1 ...
Error running 'env GEM_PATH=/Users/naoty/.rvm/gems/ruby-2.0.0-preview1:/Users/naoty/.rvm/gems/ruby-2.0.0-preview1@global:/Users/naoty/.rvm/gems/ruby-2.0.0-preview1:/Users/naoty/.rvm/gems/ruby-2.0.0-preview1@global GEM_HOME=/Users/naoty/.rvm/gems/ruby-2.0.0-preview1 /Users/naoty/.rvm/rubies/ruby-2.0.0-preview1/bin/ruby /Users/naoty/.rvm/src/rubygems-1.8.24/setup.rb', please read /Users/naoty/.rvm/log/ruby-2.0.0-preview1/rubygems.install.log
Installation of rubygems did not complete successfully.
Ruby 'ruby-2.0.0-preview1' was built using clang - but it's not (fully) supported, expect errors.
```

- `ruby-2.0.0-preview1`とちゃんと入れないとダメだった。
- なんかエラーが出たので、`~/.rvm/log/ruby-2.0.0=preview1/rubygems.install.log`を読む。

```sh
$ less .rvm/log/ruby-2.0.0-preview1/rubygems.install.log
…
It seems your ruby installation is missing psych (for YAML output).
To eliminate this warning, please install libyaml and reinstall your ruby.
```

- `libyaml`というものを入れる必要があるっぽい。
- Homebrewで見つけたので入れる。

```sh
$ brew install libyaml
```

リトライ！

```sh
$ rvm reinstall ruby-2.0.0-preview1
Removing /Users/naoty/.rvm/src/ruby-2.0.0-preview1...
Removing /Users/naoty/.rvm/rubies/ruby-2.0.0-preview1...
No binary rubies available for: osx/10.8/x86_64/ruby-2.0.0-preview1.
Continuing with compilation. Please read 'rvm mount' to get more information on binary rubies.
Building 'ruby-2.0.0-preview1' using clang - but it's not (fully) supported, expect errors.
Installing Ruby from source to: /Users/naoty/.rvm/rubies/ruby-2.0.0-preview1, this may take a while depending on your cpu(s)...
ruby-2.0.0-preview1 - #downloading ruby-2.0.0-preview1, this may take a while depending on your connection...
ruby-2.0.0-preview1 - #extracting ruby-2.0.0-preview1 to /Users/naoty/.rvm/src/ruby-2.0.0-preview1
ruby-2.0.0-preview1 - #extracted to /Users/naoty/.rvm/src/ruby-2.0.0-preview1
ruby-2.0.0-preview1 - #configuring
ruby-2.0.0-preview1 - #compiling
ruby-2.0.0-preview1 - #installing 
Removing old Rubygems files...
Installing rubygems-1.8.24 for ruby-2.0.0-preview1 ...
Installation of rubygems completed successfully.
Saving wrappers to '/Users/naoty/.rvm/bin'.
ruby-2.0.0-preview1 - #adjusting #shebangs for (gem irb erb ri rdoc testrb rake).
ruby-2.0.0-preview1 - #importing default gemsets (/Users/naoty/.rvm/gemsets/)
Install of ruby-2.0.0-preview1 - #complete 
Ruby 'ruby-2.0.0-preview1' was built using clang - but it's not (fully) supported, expect errors.
Making gemset ruby-2.0.0-preview1 pristine.
Making gemset ruby-2.0.0-preview1@global pristine.
% rvm list
rvm rubies

=* ruby-1.9.3-p194 [ x86_64 ]
   ruby-2.0.0-preview1 [ x86_64 ]

# => - current
# =* - current && default
#  * - default
```

- 警告出てるけど、一応インストールできた〜
- 当面は`.rvmrc`を使って、特定のプロジェクトだけ2.0で開発してみようと思います。
