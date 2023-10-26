---
title: Vagrant rsync + Railsでコードの変更が反映されない件
time: 2015-10-08 00:12
tags: ['rails']
---


# 問題
Vagrantの共有フォルダでVM上とコードをrsync経由で同期させているとき、なぜかローカルで編集した変更がVM上のRailsサーバーに反映されないことがある。Railsサーバーを再起動すれば、ちゃんと反映される。

# 原因
VM上の変更したファイルのmtimeが更新されていないため、Railsのautoloadが実行されなかった。

Railsのautoloadは`ActiveSupport::FileUpdateChecker`を使って以下のようにファイルのmtimeを見て変更されたかどうかを判定している。

```rb:lib/active_support/file_update_checker.rb
def updated?
  current_watched = watched
  if @last_watched.size != current_watched.size
    @watched = current_watched
    true
  else
    current_updated_at = updated_at(current_watched)
    if @last_update_at < current_updated_at
      @watched    = current_watched
      @updated_at = current_updated_at
      true
    else
      false
    end
  end
end

# ...

def updated_at(paths)
  @updated_at || max_mtime(paths) || Time.at(0)
end

# ...

def max_mtime(paths)
  time_now = Time.now
  paths.map {|path| File.mtime(path)}.reject {|mtime| time_now < mtime}.max
end
```

変更したファイルのmtimeをローカルとVMで比べてみると、下のようになった。

```bash:local
$ stat -x app/controllers/accounts_controller.rb
  File: "app/controllers/accounts_controller.rb"
  Size: 117          FileType: Regular File
  Mode: (0644/-rw-r--r--)         Uid: (  501/   naoty)  Gid: (   20/   staff)
Device: 1,4   Inode: 17448444    Links: 1
Access: Wed Oct  7 23:17:24 2015
Modify: Wed Oct  7 23:17:21 2015
Change: Wed Oct  7 23:17:21 2015
```

```bash:vm
$ stat app/controllers/accounts_controller.rb
  File: `app/controllers/accounts_controller.rb'
  Size: 117             Blocks: 8          IO Block: 4096   通常ファイル
Device: fd00h/64768d    Inode: 2331313     Links: 1
Access: (0644/-rw-r--r--)  Uid: ( 1000/ vagrant)   Gid: ( 1000/ vagrant)
Context: unconfined_u:object_r:default_t:s0
Access: 2015-10-06 17:47:42.590929945 +0000
Modify: 2015-10-07 14:17:21.000000000 +0000
Change: 2015-10-06 17:47:43.386929905 +0000
```

確かにVM上のmtimeはぜんぜん更新されてない…。

# 解決
rsyncの`--times`オプションをVagrantのrsyncオプションに渡すことで、ファイルのmtimeも転送されるようにする。

```ruby:Vagrantfile
config.vm.synced_folder ".", "/vagrant", type: "rsync",
  rsync__args: %w(--verbose --archive --delete -z --copy-links --times),
  rsync__exclude: %w(.git/ log/ tmp/ vendor/)
```

`rsync__args`で`rsync`に渡す引数を指定できる。ここでは、デフォルトで渡される引数に加えて`--times`オプションを指定している。
