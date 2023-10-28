---
title: UIViewの位置取得・操作のための便利カテゴリー
time: 2013-02-26 13:45
tags: ['ios']
---

UIViewの位置を操作するとき

```objc
CGRect frame = view.frame;
frame.origin.x = 10;
view.frame = frame;
```

みたいにすると思うのですが、いちいちめんどくさいので、カテゴリーにしてみました。

```objc:UIView+Origin.h
@interface UIView (Origin)

@property (nonatomic) CGFloat top;
@property (nonatomic) CGFloat right;
@property (nonatomic) CGFloat bottom;
@property (nonatomic) CGFloat left;

@end
```

```objc:UIView+Origin.m
@implementation UIView (Origin)

- (CGFloat)top
{
    return self.frame.origin.y;
}

- (void)setTop:(CGFloat)y
{
    CGRect frame = self.frame;
    frame.origin.y = y;
    self.frame = frame;
}

- (CGFloat)right
{
    return self.frame.origin.x + self.frame.size.width;
}

- (void)setRight:(CGFloat)right
{
    CGRect frame = self.frame;
    frame.origin.x = right - self.frame.size.width;
    self.frame = frame;
}

- (CGFloat)bottom
{
    return self.frame.origin.y + self.frame.size.height;
}

- (void)setBottom:(CGFloat)bottom
{
    CGRect frame = self.frame;
    frame.origin.y = bottom - self.frame.size.height;
    self.frame = frame;
}

- (CGFloat)left
{
    return self.frame.origin.x;
}

- (void)setLeft:(CGFloat)x
{
    CGRect frame = self.frame;
    frame.origin.x = x;
    self.frame = frame;
}

@end
```

これを使うと、例えば縦にならぶviewの位置を操作するとき、

```objc
#import "UIView+Origin.h"

viewA.top = 10;
viewB.top = viewA.bottom + 10;
viewC.top = viewB.bottom + 10;
```

なんて書けます。このカテゴリーを使わないとかなりめんどくさいです。
