---
title: iOS6以降のAVAudioSessionのdelegate設定方法
time: 2013-08-09 18:12
tags: ['ios']
---

iOS 6以降`AVAudioSession`の`delegate`プロパティがdeprecatedになったんだけど、その代わりにどうやって設定するのかあんまり情報がなかった。"notification送る"とは書いてあったんだけど、サンプルコードがなかったので、動作確認したコードを載せておく。

各イベントに対応する通知名があるので、それを`NSNotificationCenter`に登録しておけばいい。

```objc:AppDelegate.m
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)options
{
    AVAudioSession *session = [AVAudioSession sharedInstance];

    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self selector:@selector(sessionDidInterrupt:) name:AVAudioSessionInterruptionNotification object:nil];
    [center addObserver:self selector:@selector(sessionRouteDidChange:) name:AVAudioSessionRouteChangeNotification object:nil];
}

- (void)sessionDidInterrupt:(NSNotification *)notification
{
    switch ([notification.userInfo[AVAudioSessionInterruptionTypeKey] intValue]) {
        case AVAudioSessionInterruptionTypeBegan:
            NSLog(@"Interruption began");
            break;
        case AVAudioSessionInterruptionTypeEnded:
        default:
            NSLog(@"Interruption ended");
            break;
    }
}

- (void)sessionRouteDidChange
{
    NSLog(@"%s", __PRETTY_FUNCTION__);
}
```

---

### 参考

- [AVAudioSession Class Reference](http://developer.apple.com/library/ios/documentation/AVFoundation/Reference/AVAudioSession_ClassReference/Reference/Reference.html)
