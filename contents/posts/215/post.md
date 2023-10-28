---
title: CoreDataに簡単に初期データを追加する
time: 2014-04-20 13:12
tags: ['oss']
---


[NTYPopulator](https://github.com/naoty/NTYPopulator)というライブラリで簡単に初期データを追加できる。CocoaPodsからインストールできる。

```rb:Podfile
pod "NTYPopulator"
```

```sh
$ pod install
```

使い方は`AppDelegate.m`に一行加えるだけ。

```objective-c:AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	[[NTYPopulator new] run];
	return YES;
}
```

リソースバンドル内にある`seeds/*.csv`を探しだして、ファイル名と同名のEntityにデータを追加する。例えば、`seeds/user.csv`のデータは`User`というEntityに追加される。

デフォルトではモデルファイルとして`Model.momd`が参照され、SQLiteファイルとして`$(CFBundleName).sqlite`が参照される。これを変更することも可能。

```objective-c:AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSURL *modelURL = [[NSBundle mainBundle] URLForResource:@"MyModel" withExtension:@"momd"];
    NSURL *documentDirectoryURL = [[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];
    NSURL *sqliteURL = [documentDirectoryURL URLByAppendingPathComponent:@"MySQLite.sqlite"];
    
    NTYPopulator *populator = [[NTYPopulator alloc] initWithModelURL:modelURL sqliteURL:sqliteURL];
    [populator run];
    
    return YES;
}
```

---

以上、ステマでした。

---
### 追記

NTYPopulatorで想定していたユースケースは開発時に初期データをさくっと入れたいというものなので、リリース時には作成済みのSQLiteファイルを使った方がいいと思う。
