---
title: MDCSwipeToChooseを読んだ
time: 2014-11-23 16:27
tags: ['ios']
---

[前回](http://naoty.hatenablog.com/entry/2014/11/18/212355)に引き続き、UI周りのテクニックを学ぶため[https://github.com/modocache/MDCSwipeToChoose](https://github.com/modocache/MDCSwipeToChoose)を読む。海外で話題のTinder風のアプリを簡単に開発することができる。

まず使い方を簡単に見ていく。

```
override func viewDidLoad() {
    let options = MDCSwipeToChooseViewOptions()
    options.delegate = self
    options.likedText = "Like"
    options.likedColor = UIColor.blueColor()
    options.nopeText = "Nope"
    options.nopeColor = UIColor.redColor()
    options.onPan = { state in NSLog("Panning") }

    let swipableView = MDCSwipeToChooseView(frame: view.frame, options: options)
    view.addSubview(swipableview)
}

func viewDidCancelSwipe(view: UIView!) {
    NSLog("Cancel to choose")
}

func view(view: UIView!, wasChoosenWithDirection direction: MDCSwipeDirection) }
    NSLog("Choose to \(direction == .Left ? "Left" : "Right")")
}
```

- `MDCSwipeToChooseViewOptions`オブジェクトにスワイプするViewの設定をまとめて初期化時に渡している。
  - `delegate`は`MDCSwipeToChooseDelegate`を実装するオブジェクトである必要がある。
  - `likedText`とか`nopeText`というのは、右もしくは左にスワイプされるときにView上に表示されるテキストのこと。
  - `onPan`はスワイプされているときに呼ばれる処理。
- `MDCSwipeToChooseDelegate`のメソッドとして`viewDidCancelSwipe()`と`view(view:wasChoosenWithDirection:)`がある。前者はスワイプを途中でやめたとき、後者はスワイプしてViewをどちらかに選んだときに呼ばれる。

さらに、`MDCSwipeToChooseView`だけではなく、`UIView`をスワイプできるようにするカテゴリも用意されているため、より柔軟に実装できるようになっている。

今回、重点的に読んでいきたいのは以下のポイントだ。

- ライブラリの設計。カテゴリも含めた柔軟な実装を可能にするのは優れた設計があるからだと思うので参考にしたい。
- スワイプに合わせたViewの動き。

# ライブラリの設計

このライブラリの作者の書いた[iOS UI Component API Design](http://modocache.svbtle.com/ios-ui-component-api-design)という記事によると、設計において2点考慮されているようだ。

1. 継承よりカテゴリーによるコンポジションを選ぶ。
2. デリゲートメソッドやブロックの引数にパラメータオブジェクトを使う。

## 継承よりカテゴリーによるコンポジション

`MDCSwipeToChooseView`に機能を追加したい場合、サブクラスを定義する必要がある。しかし、この方法では別のライブラリが提供するViewのもつ機能を組み込むことができない。そこで、カテゴリーで`UIView`に機能を拡張することで、他のライブラリとも組み合わせることができる。

カテゴリーによる拡張の欠点はインスタンス変数を追加することができないことだ。そのため、プロパティをカテゴリーによって拡張する場合は、`<objc/runtime.h>`の`objc_setAssociatedObject()`を使ったトリッキーな実装が必要になる。

より簡単に実装するには、カスタマイズ用のパラメータを束ねる設定オブジェクトを使うのがよさそう。この設定オブジェクトのプロパティだけは上記のトリッキーな手法で拡張するしかないが、Viewをカスタマイズする変数はすべてのこの設定オブジェクトに隠ぺいする。このライブラリでの設定オブジェクトは`MDCSwipeOptions`と`MDCSwipeToChooseViewOptions`だった。

## パラメータオブジェクト

デリゲートメソッドや`onPan`などのブロックのシグネチャがバージョンアップデートで変更されてしまうと互換性がなくなってしまう。そこで、複数の引数をまとめたパラメータオブジェクトというのを用意し、引数の変更をすべてパラメータオブジェクト内の変更で吸収することで、メソッドのシグネチャを変更せずに互換性を保つことができる。このライブラリでは`MDCPanState`がパラメータオブジェクトの役割を果たしている。

```
typedef void (^MDCSwipeToChooseOnPanBlock)(MDCPanState *state);

@interface MDCSwipeOptions : NSObject

// ...

@property (nonatomic, copy) MDCSwipeToChooseOnPanBlock onPan;

// ...

@end
```

```
@interface MDCPanState : NSObject

@property (nonatomic, strong) UIView *view;
@property (nonatomic, assign) MDCSwipeDirection direction;
@property (nonatomic, assign) CGFloat thresholdRatio;

@end
```

# 初期化から表示まで

設計について確認したので、初期化から表示されるまでの流れからソースコードを読んでいく。

## MDCSwipeToChooseView.m:44

```
- (instancetype)initWithFrame:(CGRect)frame options:(MDCSwipeToChooseViewOptions *)options {
    self = [super initWithFrame:frame];
    if (self) {
        _options = options ? options : [MDCSwipeToChooseViewOptions new];
        [self setupView];
        [self constructImageView];
        [self constructLikedView];
        [self constructNopeImageView];
        [self setupSwipeToChoose];
    }
    return self;
}
```

- まずこのクラスのスーパークラスは`UIView`なので、普通の初期化処理をしたあとにセットアップ処理を実行している。
- いくつかのセットアップ処理を順に見ていく。

## MDCSwipeToChooseView.m:59

```
- (void)setupView {
    self.backgroundColor = [UIColor clearColor];
    self.layer.cornerRadius = 5.f;
    self.layer.borderWidth = 2.f;
    self.layer.borderColor = [UIColor colorWith8BitRed:220.f
                                                 green:220.f
                                                  blue:220.f
                                                 alpha:1.f].CGColor;
}
```

- `self`の見た目に関する設定をしている。
- 背景色が透明で、角丸で、枠線の太さと色を指定しているだけのようだ。

## MDCSwipeToChooseView.m:69

```
- (void)constructImageView {
    _imageView = [[UIImageView alloc] initWithFrame:self.bounds];
    _imageView.clipsToBounds = YES;
    [self addSubview:_imageView];
}
```

- `self`と同じ大きさの`_imageView`を作ってサブビューに追加している。
- `-[UIView clipsToBounds]`はサブビューを自分の`bounds`のサイズで切り抜く設定だ。`YES`を指定すると、サブビューの自分からはみ出た部分は表示されなくなる。

## MDCSwipeToChooseView.m:75

```
- (void)constructLikedView {
    CGRect frame = CGRectMake(MDCSwipeToChooseViewHorizontalPadding,
                              MDCSwipeToChooseViewTopPadding,
                              CGRectGetMidX(_imageView.bounds),
                              MDCSwipeToChooseViewLabelWidth);
    self.likedView = [[UIView alloc] initWithFrame:frame];
    [self.likedView constructBorderedLabelWithText:self.options.likedText
                                             color:self.options.likedColor
                                             angle:self.options.likedRotationAngle];
    self.likedView.alpha = 0.f;
    [self.imageView addSubview:self.likedView];
}
```

- `likedView`というのは右にスワイプしたときに浮かび上がるテキストのためのビュー。
- 最初は非表示になっているので`alpha`が`0`になっている。
- `-[UIView constructBorderedLabelWithText:color:angle]`というメソッドは`UIView+MDCBorderedLabel.m`で定義されている拡張。

## UIView+MDCBorderedLabel.m:31

```
- (void)constructBorderedLabelWithText:(NSString *)text
                                 color:(UIColor *)color
                                 angle:(CGFloat)angle {
    self.layer.borderColor = color.CGColor;
    self.layer.borderWidth = 5.f;
    self.layer.cornerRadius = 10.f;

    UILabel *label = [[UILabel alloc] initWithFrame:self.bounds];
    label.text = [text uppercaseString];
    label.textAlignment = NSTextAlignmentCenter;
    label.font = [UIFont fontWithName:@"HelveticaNeue-CondensedBlack"
                                 size:48.f];
    label.textColor = color;
    [self addSubview:label];

    self.transform = CGAffineTransformRotate(CGAffineTransformIdentity,
                                             MDCDegreesToRadians(angle));
}
```

- 角丸や枠線の設定をして、`UILabel`をサブビューに追加している。
- `-[UIView transform]`は`center`または`anchorPoint`を基準とした変換値を表す。これを設定するとその変換が適用される。`CGAffineTransformRotate()`は回転のためのアフィン変換行列を返す。第1引数に既存のアフィン変換、第2引数に回転角度を指定する。

## MDCSwipeToChooseView.m:88

```
- (void)constructNopeImageView {
    CGFloat width = CGRectGetMidX(self.imageView.bounds);
    CGFloat xOrigin = CGRectGetMaxX(_imageView.bounds) - width - MDCSwipeToChooseViewHorizontalPadding;
    self.nopeView = [[UIImageView alloc] initWithFrame:CGRectMake(xOrigin,
                                                                  MDCSwipeToChooseViewTopPadding,
                                                                  width,
                                                                  MDCSwipeToChooseViewLabelWidth)];
    [self.nopeView constructBorderedLabelWithText:self.options.nopeText
                                            color:self.options.nopeColor
                                            angle:self.options.nopeRotationAngle];
    self.nopeView.alpha = 0.f;
    [self.imageView addSubview:self.nopeView];
}
```

- こちらは左にスワイプしたときに浮かび上がるテキストのビュー。
- `_likedView`と大差ない。

## MDCSwipeToChooseView.m:102

```
- (void)setupSwipeToChoose {
    MDCSwipeOptions *options = [MDCSwipeOptions new];
    options.delegate = self.options.delegate;
    options.threshold = self.options.threshold;

    __block UIView *likedImageView = self.likedView;
    __block UIView *nopeImageView = self.nopeView;
    __weak MDCSwipeToChooseView *weakself = self;
    options.onPan = ^(MDCPanState *state) {
        if (state.direction == MDCSwipeDirectionNone) {
            likedImageView.alpha = 0.f;
            nopeImageView.alpha = 0.f;
        } else if (state.direction == MDCSwipeDirectionLeft) {
            likedImageView.alpha = 0.f;
            nopeImageView.alpha = state.thresholdRatio;
        } else if (state.direction == MDCSwipeDirectionRight) {
            likedImageView.alpha = state.thresholdRatio;
            nopeImageView.alpha = 0.f;
        }

        if (weakself.options.onPan) {
            weakself.options.onPan(state);
        }
    };

    [self mdc_swipeToChooseSetup:options];
}
```

- `MDCSwipeOptions`オブジェクトを生成して、初期化時に渡された`self.options`のプロパティをコピーしている。`onPan`ブロック内で最後に初期化時に渡された`self.options.onPan`が実行されるようになっている。
- `__block`属性はブロック内で変更する場合に変数につける必要がある。
- `onPan`内の処理を詳しく見ていく。
  - ブロックの引数に渡される`state`の`direction`プロパティは`MDCSwipeDirection`型の値で、`None`, `Left`, `Right`のいずれかだ。`Left`なら``nopeImageView`のアルファ値を変更し表示されるようにしている。逆に`Right`なら`likedImageView`を同様にして表示されるようにしている。
  - `state`の`thresholdRatio`プロパティはコメントによると、ある閾値にどれだけ近づいているかを表す、`0`から`1`までの値だ。`1`のとき閾値に達したことを意味する。よって、ある閾値に達したとき`thresholdRatio`が`1`になり、`likedImageView`または`nopeImageView`のアルファ値が`1`になって完全に表示されるようになる。
- `-[UIView mdc_swipeToChooseSetup:]`は`UIView+MDCSwipeToChoose.m`で定義されたカテゴリーによって拡張されたメソッドだ。このライブラリは`MDCSwipeToChooseView`という専用のクラスだけでなく、`UIView`のカテゴリーを提供することでより柔軟に実装できるようになっているが、その中心部分はこのカテゴリー内で実装しているようだ。

## UIView+MDCSwipeToChoose.m:38

```
- (void)mdc_swipeToChooseSetup:(MDCSwipeOptions *)options {
    self.mdc_options = options ? options : [MDCSwipeOptions new];
    self.mdc_viewState = [MDCViewState new];
    self.mdc_viewState.originalCenter = self.center;

    [self mdc_setupPanGestureRecognizer];
}
```

- `self.mdc_options`と`self.mdc_viewState`を初期化している。
- `-[UIView mdc_setupPanGestureRecognizer]`でジェスチャーのイベントハンドリングを実装しているのだろう。

# スワイプに合わせたViewの動き

これまで`MDCSwipeToChooseView`および`UIView+MDCSwipeToChoose`による拡張部分の初期化について見てきた。これからスワイプに合わせてViewをどのように動かしているのかについて詳細に見ていく。

## UIView+MDCSwipeToChoose.m:104

```
- (void)mdc_setupPanGestureRecognizer {
    SEL action = @selector(mdc_onSwipeToChoosePanGestureRecognizer:);
    UIPanGestureRecognizer *panGestureRecognizer =
    [[UIPanGestureRecognizer alloc] initWithTarget:self
                                            action:action];
    [self addGestureRecognizer:panGestureRecognizer];
}
```

- `UIPanGestureRecognizer`を初期化して`UIView`に追加している。パンというジェスチャーはスワイプとかドラッグのことだ。
- スワイプされると`-[UIView mdc_onSwipeToChoosePanGestureRecognizer:]`が呼ばれるようだ。

## UIView+MDCSwipeToChoose.m:227

```
- (void)mdc_onSwipeToChoosePanGestureRecognizer:(UIPanGestureRecognizer *)panGestureRecognizer {
    UIView *view = panGestureRecognizer.view;

    if (panGestureRecognizer.state == UIGestureRecognizerStateBegan) {
        self.mdc_viewState.originalCenter = view.center;

        // If the pan gesture originated at the top half of the view, rotate the view
        // away from the center. Otherwise, rotate towards the center.
        if ([panGestureRecognizer locationInView:view].y < view.center.y) {
            self.mdc_viewState.rotationDirection = MDCRotationAwayFromCenter;
        } else {
            self.mdc_viewState.rotationDirection = MDCRotationTowardsCenter;
        }
    } else if (panGestureRecognizer.state == UIGestureRecognizerStateEnded) {
        // Either move the view back to its original position or move it off screen.
        [self mdc_finalizePosition];
    } else {
        // Update the position and transform. Then, notify any listeners of
        // the updates via the pan block.
        CGPoint translation = [panGestureRecognizer translationInView:view];
        view.center = MDCCGPointAdd(self.mdc_viewState.originalCenter, translation);
        [self mdc_rotateForTranslation:translation
                     rotationDirection:self.mdc_viewState.rotationDirection];
        [self mdc_executeOnPanBlockForTranslation:translation];
    }
}
```

- スワイプが始まったとき、ユーザーの指の位置がViewの上半分なら`MDCRotationAwayFromCenter`すなわち`1.0`、下半分なら`MDCRotationTowardsCenter`すなわち`-1.0`を`self.mdc_viewState.rotationDirection`にセットしている。
- スワイプが終わったとき、`-[UIVIew mdc_finalizePosition]`を呼ぶ。ここはあとで詳細に見ることにしてスキップする。
- スワイプ中
  - `-[UIPanGestureRecognizer translationInView:]`によって最初に指が触れた点からの移動量を取得している。
  - 取得した移動量を`originalCenter`に加えた値を`center`とすることで、ユーザーの指の位置が常に`center`になるようにViewを移動させているようだ。
  - `-[UIView mdc_rotateForTranslation:rotationDirection:]`によってViewを回転させているようだ。あとで詳細を見ることにする。
  - `-[UIView mdc_executeOnPanBlockForTranslation:]`はスワイプの状態から`thresholdRatio`を計算したり`MDCPanState`を生成したりして`self.mdc_options.onPan()`の引数に渡して実行している。ここで、Viewの初期化時に指定した`onPan`のブロックが実行されることになる。

## UIView+MDCSwipeToChoose.m:189

後回しにしていた`-[UIView mdc_rotateForTranslation:rotationDirection:]`を先に見る。

```
- (void)mdc_rotateForTranslation:(CGPoint)translation
               rotationDirection:(MDCRotationDirection)rotationDirection {
    CGFloat rotation = MDCDegreesToRadians(translation.x/100 * self.mdc_options.rotationFactor);
    self.transform = CGAffineTransformRotate(CGAffineTransformIdentity,
                                             rotationDirection * rotation);
}
```

- `x軸方向への移動量 / 100`に定数倍したものをラジアンに変換して、`rotationDirection`（`1.0`or`-1.0`）を掛けた量を回転させている。

## UIView+MDCSwipeToChoose.m:114

次に、スワイプが終了したときに呼ばれる`-[UIView mdc_finalizePosition]`を見ていく。

```
- (void)mdc_finalizePosition {
    MDCSwipeDirection direction = [self mdc_directionOfExceededThreshold];
    switch (direction) {
        case MDCSwipeDirectionRight:
        case MDCSwipeDirectionLeft: {
            CGPoint translation = MDCCGPointSubtract(self.center,
                                                     self.mdc_viewState.originalCenter);
            [self mdc_exitSuperviewFromTranslation:translation];
            break;
        }
        case MDCSwipeDirectionNone:
            [self mdc_returnToOriginalCenter];
            [self mdc_executeOnPanBlockForTranslation:CGPointZero];
            break;
    }
}
```

- `-[UIView mdc_directionOfExceededThreshold]`である閾値を超えた方向を取得しているようだ。
- 取得した方向が左か右であれば`-[UIView mdc_exitSuperviewFromTranslation:]`を呼び、どちらでもなかった場合は`-[UIView mdc_returnToOriginalCenter]`と`-[UIView mdc_executeOnPanBlockForTranslation:]`を呼んでいる。

## UIView+MDCSwipeToChoose.m:215

まず閾値をを超えた方向を取得する部分から見ていく。

```
- (MDCSwipeDirection)mdc_directionOfExceededThreshold {
    if (self.center.x > self.mdc_viewState.originalCenter.x + self.mdc_options.threshold) {
        return MDCSwipeDirectionRight;
    } else if (self.center.x < self.mdc_viewState.originalCenter.x - self.mdc_options.threshold) {
        return MDCSwipeDirectionLeft;
    } else {
        return MDCSwipeDirectionNone;
    }
}
```

- どうやら閾値というのは`self.mdc_options.threshold`のことのようだ。デフォルトでは`100.0`だ。
- Viewの中心点のx座標がもともとの中心点のx座標から閾値以上移動した場合、右方向なら`Right`、左方向なら`Left`を返している。そうでなければ`None`を返している。

## UIView+MDCSwipeToChoose.m:146

次に、上記の閾値を超えてどちらかの方向が返ってきた場合に呼ばれる`-[UIView mdc_exitSuperviewFromTranslation:]`を見る。

```
- (void)mdc_exitSuperviewFromTranslation:(CGPoint)translation {
    MDCSwipeDirection direction = [self mdc_directionOfExceededThreshold];
    id<MDCSwipeToChooseDelegate> delegate = self.mdc_options.delegate;
    if ([delegate respondsToSelector:@selector(view:shouldBeChosenWithDirection:)]) {
        BOOL should = [delegate view:self shouldBeChosenWithDirection:direction];
        if (!should) {
            return;
        }
    }

    MDCSwipeResult *state = [MDCSwipeResult new];
    state.view = self;
    state.translation = translation;
    state.direction = direction;
    state.onCompletion = ^{
        if ([delegate respondsToSelector:@selector(view:wasChosenWithDirection:)]) {
            [delegate view:self wasChosenWithDirection:direction];
        }
    };
    self.mdc_options.onChosen(state);
}
```

- `delegate`に`view:shouldBeChosenWithDirection:`が実装されていれば、それを呼び`NO`が返ってきた場合そこで終了する。
- `MDCSwipeResult`オブジェクトを初期化して`self.mdc_options.onChosen()`に渡して実行している。

## MDCSwipeOptions.m:33

`onChosen`は何を参照しているのか確認する。

```
- (instancetype)init {
    self = [super init];
    if (self) {
        _swipeCancelledAnimationDuration = 0.2;
        _swipeCancelledAnimationOptions = UIViewAnimationOptionCurveEaseOut;
        _swipeAnimationDuration = 0.1;
        _swipeAnimationOptions = UIViewAnimationOptionCurveEaseIn;
        _rotationFactor = 3.f;

        _onChosen = [[self class] exitScreenOnChosenWithDuration:0.1
                                                         options:UIViewAnimationOptionCurveLinear];
    }
    return self;
}
```

- `_onChosen`は`+[MDCSwipeOptions exitScreenOnChosenWithDuration:options]`の返り値を参照している。

## MDCSwipeOptions.m:50

```
+ (MDCSwipeToChooseOnChosenBlock)exitScreenOnChosenWithDuration:(NSTimeInterval)duration
                                                        options:(UIViewAnimationOptions)options {
    return ^(MDCSwipeResult *state) {
        CGRect destination = MDCCGRectExtendedOutOfBounds(state.view.frame,
                                                          state.view.superview.bounds,
                                                          state.translation);
        [UIView animateWithDuration:duration
                              delay:0.0
                            options:options
                         animations:^{
                             state.view.frame = destination;
                         } completion:^(BOOL finished) {
                             if (finished) {
                                 [state.view removeFromSuperview];
                                 state.onCompletion();
                             }
                         }];
    };
}
```

- このメソッドはブロックを返しているのであって、ブロックを実行しているわけではない。
- その内容としては、Viewをスーパービューの外にアニメーションつきで移動させ、完了後にそのViewをスーパービューから削除し、`state.onCompletion()`を実行するというものだ。

## UIView+MDCSwipeToChoose.m:146

いったん`-[UIView mdc_exitSuperviewFromTranslation:]`に戻って`onCompletion`を確認する。

```
- (void)mdc_exitSuperviewFromTranslation:(CGPoint)translation {
    // ...

    MDCSwipeResult *state = [MDCSwipeResult new];
    state.view = self;
    state.translation = translation;
    state.direction = direction;
    state.onCompletion = ^{
        if ([delegate respondsToSelector:@selector(view:wasChosenWithDirection:)]) {
            [delegate view:self wasChosenWithDirection:direction];
        }
    };
    self.mdc_options.onChosen(state);
}
```

- Viewが枠外に消えた後に、`onChosen()`の引数に渡された`state`の`onCompletion`が実行されるので、ここでは`delegate`の`view:wasChosenWithDirection:`が呼ばれることになる。

## UIView+MDCSwipeToChoose.m:131

続いて、`-[UIView mdc_finalizePosition]`で閾値を超えなかった場合に呼ばれる2つのメソッドのうち、`-[UIView mdc_returnToOriginalCenter]`を見る。

```
- (void)mdc_returnToOriginalCenter {
    [UIView animateWithDuration:self.mdc_options.swipeCancelledAnimationDuration
                          delay:0.0
                        options:self.mdc_options.swipeCancelledAnimationOptions
                     animations:^{
                         self.transform = CGAffineTransformIdentity;
                         self.center = self.mdc_viewState.originalCenter;
                     } completion:^(BOOL finished) {
                         id<MDCSwipeToChooseDelegate> delegate = self.mdc_options.delegate;
                         if ([delegate respondsToSelector:@selector(viewDidCancelSwipe:)]) {
                             [delegate viewDidCancelSwipe:self];
                         }
                     }];
}
```

- アニメーションつきで回転を打ち消し、もともとの中心点に移動させている。
- それらが完了したあと、`delegate`の`viewDidCancelSwipe:`を呼んでいる。

## UIView+MDCSwipeToChoose.m:168

もう1つの`-[UIView mdc_executeOnPanBlockForTranslation:]`を見る。

```
- (void)mdc_executeOnPanBlockForTranslation:(CGPoint)translation {
    if (self.mdc_options.onPan) {
        CGFloat thresholdRatio = MIN(1.f, fabsf(translation.x)/self.mdc_options.threshold);

        MDCSwipeDirection direction = MDCSwipeDirectionNone;
        if (translation.x > 0.f) {
            direction = MDCSwipeDirectionRight;
        } else if (translation.x < 0.f) {
            direction = MDCSwipeDirectionLeft;
        }

        MDCPanState *state = [MDCPanState new];
        state.view = self;
        state.direction = direction;
        state.thresholdRatio = thresholdRatio;
        self.mdc_options.onPan(state);
    }
}
```

- 中心点に戻る際の`onPan`ブロックを実行している。そのために、`thresholdRatio`を計算し`MDCPanState`を初期化している。
