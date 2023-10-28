---
title: Vagrantfileを分割する
time: 2015-10-03 15:12
---

自分の環境固有の設定や自分しか使わないであろうプラグインの設定などは、Vagrantfileに書いてgitで管理したくないので、別の設定ファイルに分けてignoreしておきたい。そういうときに以下のようにしておくと便利。

```rb:Vagrantfile
Vagrant.configure(2) do |config|
  # ...
end

# Load local configurations
load "./Vagrantfile.local" if File.exist?("./Vagrantfile.local")
```

```rb:Vagrantfile.local
Vagrant.configure(2) do |config|
  # ...
end
```
