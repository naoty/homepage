---
title: iOS 6とiOS 5でFacebook SDK使おうとしたらハマった
time: 2012-11-05 17:34
tags: ['ios']
---

## versions

- Xcode (4.5.1)
- Facebook SDK for iOS (3.1)

## SDKインストール

- [ここ](https://developers.facebook.com/ios/)からインストーラをダウンロードしてインストール。`~/Documents`にSDKが入る。
- [チュートリアル](http://developers.facebook.com/docs/getting-started/getting-started-with-the-ios-sdk/jp/)に沿って進める。

## チュートリアル通りにやったのにエラる

```
Undefined symbols for architecture armv7:
  "_OBJC_CLASS_$_ACAccountStore", referenced from:
      objc-class-ref in FacebookSDK(FBSession.o)
  "_ACFacebookAudienceFriends", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
  "_ACFacebookAppIdKey", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
  "_ACAccountTypeIdentifierFacebook", referenced from:
      +[FBSession renewSystemAuthorization] in FacebookSDK(FBSession.o)
  "_ACFacebookAudienceKey", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
  "_ACFacebookAudienceOnlyMe", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
  "_ACFacebookPermissionsKey", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
  "_OBJC_CLASS_$_ASIdentifierManager", referenced from:
      objc-class-ref in FacebookSDK(FBSettings.o)
  "_ACFacebookAudienceEveryone", referenced from:
      -[FBSession authorizeUsingSystemAccountStore:accountType:permissions:defaultAudience:isReauthorize:] in FacebookSDK(FBSession.o)
ld: symbol(s) not found for architecture armv7
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```

などとエラーが出てくる。

## 解決策

`Accounts.framework`と`AdSupport.framework`を追加する。これでiOS 6は動くのだけど、iOS 5では…

```
dyld: Library not loaded: /System/Library/Frameworks/AdSupport.framework/AdSupport
```

や

```
dyld: Symbol not found: _ACFacebookAppIdKey
```

のようなエラーがおきる。

なので、`Accounts.framework`と`AdSupport.framework`を`optional`で追加する。

これでうまくいった。
