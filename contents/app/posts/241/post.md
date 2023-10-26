---
title: SlackTextViewControllerを読んだ
time: 2014-11-18 21:23
tags: ['ios']
---

UI周りの理解を深めるため、Slackが公開している[https://github.com/slackhq/SlackTextViewController](https://github.com/slackhq/SlackTextViewController)を読む。コミット番号は`9fcf06ac6f7004e4aacb6536b375d1cb03f08289`だ。

全部はさすがに読みきれないので、以下の気になるポイントに集中してコードを読んでいくことにする。

- キーボードの表示／非表示に伴うレイアウトの調整。何も工夫しないとキーボードでViewが隠れてしまうはずだ。
- ユーザー名や絵文字の補完

# TL;DR

- キーボードの表示／非表示の際に送信される通知`UIKeyboardWillShowNotification`等を使ってレイアウトを調整している。レイアウトはすべてAuto Layout上の制約をプログラムで制御することで調整している。例えば、キーボードの高さに併せてスクロールビューの高さを大きくしたり小さくしたりしている。
- `UITextView`上のカーソル位置が変更されるタイミングで、事前に登録されたプレフィックスにマッチするかどうかチェックしている。マッチすれば、補完候補を表示する`UITextView`を表示し、それに併せて各Viewのレイアウトを調整している。
- 全体を通して「キーボード等の状態が変化する」→「各Viewの適切な高さを計算する」→「`-[NSLayoutConstraint constant]`を更新する」→「`-[CALayer layoutIfNeeded]`を呼んで再描画する」という流れだった。

# 初期化から表示まで

とりあえず、初期化から表示までの流れを先に抑えておく。

## SlackTextViewController.m:115

```
- (instancetype)initWithCoder:(NSCoder *)decoder
{
    NSAssert([self class] != [SLKTextViewController class], @"Oops! You must subclass SLKTextViewController.");
    
    if (self = [super initWithCoder:decoder])
    {
        UITableViewStyle tableViewStyle = [[self class] tableViewStyleForCoder:decoder];
        UICollectionViewLayout *collectionViewLayout = [[self class] collectionViewLayoutForCoder:decoder];
        
        if ([collectionViewLayout isKindOfClass:[UICollectionViewLayout class]]) {
            [self collectionViewWithLayout:collectionViewLayout];
        }
        else if (tableViewStyle == UITableViewStylePlain || tableViewStyle == UITableViewStyleGrouped) {
            [self tableViewWithStyle:tableViewStyle];
        }
        else {
            return nil;
        }
        
        [self commonInit];
    }
    return self;
}
```

- `NSAssert()`は第一引数が`true`であることを表明するために使われる。`false`ならそこで第二引数のメッセージをログに出力して強制終了する。
- `-[tableViewWithStyle:]`がやっていることは主に2つ。
  - `_tableView`の初期化。
  - `_scrollViewProxy`の初期化。これは実際には`_tableView`を参照している。また、タップしたらキーボードを閉じる設定をしている。
- `-[commonInit]`は名前の通り、他の初期化メソッド内でも呼ばれており、主に以下のようなことを行っている。
  - 各状態プロパティの初期化。
  - 多数のオブザーバーを登録する。

## SlackTextViewController.m:160

次に、ViewControllerが`self.view`を初期化する際に呼ばれる`loadView`を読む。

```
- (void)loadView
{
    [super loadView];
        
    [self.view addSubview:self.scrollViewProxy];
    [self.view addSubview:self.autoCompletionView];
    [self.view addSubview:self.typingIndicatorView];
    [self.view addSubview:self.textInputbar];
}
```

- `self.view`を初期化したあと、`self.scrollViewProxy`, `self.autoCompletionView`, `self.typingIndicatorView`, `self.textInputbar`の4つのサブビューが追加されている。それぞれのサブビューは以下のようなものだ。
  - `self.scrollViewProxy`: 上でも見たように`self.tableView`のこと。
  - `self.autoCompletionView`: おそらく補完候補を表示する`UITableView`だと思われる。
  - `self.typingIndicatorView`: 「◯◯が入力中…」のようなメッセージを表示するためのViewで、`SLKTextIndicatorView`というカスタムViewとして定義されている。
  - `self.textInputbar`: テキストの入力フォームや送信ボタンを含む`UIToolBar`で、これも`SLKTextInputbar`というカスタムViewとして定義されている。

## SlackTextViewController.m:165

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [UIView performWithoutAnimation:^{
        [self reloadTextView];
        [self setupViewConstraints];
    }];
}
```

- `-[reloadTextView]`はキャッシュされた入力テキストを復旧してTextFieldに表示している。
- `-[SlackTextViewController setupViewConstraints]`は全体を通して重要なメソッドなので、詳細に見ていく。

## SlackTextViewController.m:1681

```
- (void)setupViewConstraints
{
    NSDictionary *views = @{@"scrollView": self.scrollViewProxy,
                            @"autoCompletionView": self.autoCompletionView,
                            @"typingIndicatorView": self.typingIndicatorView,
                            @"textInputbar": self.textInputbar,
                            };
    
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:|[scrollView(0@750)][autoCompletionView(0)][typingIndicatorView(0)]-0@999-[textInputbar(>=0)]|" options:0 metrics:nil views:views]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[scrollView]|" options:0 metrics:nil views:views]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[autoCompletionView]|" options:0 metrics:nil views:views]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[typingIndicatorView]|" options:0 metrics:nil views:views]];
    [self.view addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|[textInputbar]|" options:0 metrics:nil views:views]];
    
    self.scrollViewHC = [self.view slk_constraintForAttribute:NSLayoutAttributeHeight firstItem:self.scrollViewProxy secondItem:nil];
    self.autoCompletionViewHC = [self.view slk_constraintForAttribute:NSLayoutAttributeHeight firstItem:self.autoCompletionView secondItem:nil];
    self.typingIndicatorViewHC = [self.view slk_constraintForAttribute:NSLayoutAttributeHeight firstItem:self.typingIndicatorView secondItem:nil];
    self.textInputbarHC = [self.view slk_constraintForAttribute:NSLayoutAttributeHeight firstItem:self.textInputbar secondItem:nil];
    self.keyboardHC = [self.view slk_constraintForAttribute:NSLayoutAttributeBottom firstItem:self.view secondItem:self.textInputbar];
    
    self.textInputbarHC.constant = [self minimumInputbarHeight];
    self.scrollViewHC.constant = [self appropriateScrollViewHeight];

    if (self.isEditing) {
        self.textInputbarHC.constant += self.textInputbar.accessoryViewHeight;
    }
}
```

- `-[UIView addConstraints:]`の部分は`self.view`のサブビューに対する以下のような制約を追加している。
  - 各サブビューの高さ、およびサブビュー間の垂直方向の余白を設定
  - 各サブビューの水平方向の親Viewとの余白はなし
- 各サブビュー間に制約が追加された結果、計算された制約の値をプロパティに保持する。このプロパティはレイアウトを調整する際にどんどん更新していくため重要。

# キーボードの表示／非表示に伴うレイアウトの調整

キーボードは`self.textInputbar`内の`UITextField`がfirstResponderになったときに表示されるはずだ。キーボードが表示される直前／直後にはそれぞれ`UIKeyboardWillShowNotification`, `UIKeyboardDidShowNotification`という通知がポストされる。そこで、この通知を監視するオブザーバーを探す。

## SlackTextViewController.m:1719

```
- (void)registerNotifications
{
    // Keyboard notifications
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(willShowOrHideKeyboard:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(willShowOrHideKeyboard:) name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didShowOrHideKeyboard:) name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didShowOrHideKeyboard:) name:UIKeyboardDidHideNotification object:nil];
    
    // ...
}
```

- `UIKeyboardWillShowNotification`がポストされたとき、`willShowOrHideKeyboard:`が呼ばれるようになっている。また、`UIKeyboardDidShowNotification`がポストされたとき、`didShowOrHideKeyboard:`が呼ばれるようになっている。

## SlackTextViewController.m:1048

`-[willShowOrHideKeyboard:]`の中でレイアウトの変更に関わる部分を抽出した。

```
- (void)willShowOrHideKeyboard:(NSNotification *)notification
{
    // ...
    
    // Updates the height constraints' constants
    self.keyboardHC.constant = [self appropriateKeyboardHeight:notification];
    self.scrollViewHC.constant = [self appropriateScrollViewHeight];
    
    // ...
}
```

- `self.keyboardHC`および`self.scrollViewHC`は`-[setupViewConstraints]`内で設定された、それぞれの高さに対する制約だ。
- `-[appropriateKeyboardHeight:notification]`と`-[appropriateScrollViewHeight]`で適切な高さを計算しているようなので、詳細に見ていく。

## SlackTextViewController.m:412

```
- (CGFloat)appropriateKeyboardHeight:(NSNotification *)notification
{
    CGFloat keyboardHeight = 0.0;

    CGRect endFrame = [notification.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
    
    // ...
    
    // Sets the minimum height of the keyboard
    if (self.isMovingKeyboard) {
        if (!UI_IS_IOS8_AND_HIGHER && UI_IS_LANDSCAPE) {
            keyboardHeight = MIN(CGRectGetWidth([UIScreen mainScreen].bounds), CGRectGetHeight([UIScreen mainScreen].bounds));
            keyboardHeight -= MAX(endFrame.origin.x, endFrame.origin.y);
        }
        else {
            keyboardHeight = CGRectGetHeight([UIScreen mainScreen].bounds);
            keyboardHeight -= endFrame.origin.y;
        }
    }
    else {
        if ([notification.name isEqualToString:UIKeyboardWillShowNotification] || [notification.name isEqualToString:UIKeyboardDidShowNotification]) {
            CGRect convertedRect = [self.view convertRect:endFrame toView:self.view.window];
            keyboardHeight = CGRectGetHeight(convertedRect);
        }
        else {
            keyboardHeight = 0.0;
        }
    }
    
    // ...
    
    return keyboardHeight;
}
```

- 引数で渡される`notification`には`UIKeyboardWillShowNotification`などが入る。これらの通知の`userInfo`の`UIKeyboardFrameEndUserInfoKey`にはキーボードが表示された後のframeを表すCGRectが含まれる。
- `self.isMovingKeyboard`はキーボードが閉じようといるとき、または開こうとしているときに`YES`となるようだ。
- `self.isMovingKeyboard`が`YES`である場合、画面全体の高さからキーボードの`origin.y`を引いた値を`keyboardHeight`としている。
- `self.isMovingKeyboard`が`NO`である場合、これからキーボードが表示されるかそれとも非表示になるかでまた分岐する。
  - 非表示になる場合は0。
  - 表示する場合、キーボードのframeのWindow座標系を変換してその高さを取得し`keyboardHeight`としている。キーボードの座標系はデバイスの向きを考慮していないため、Window座標系かView座標系に変換する必要がある。

## Slacktextviewcontroller.m:456

```
- (CGFloat)appropriateScrollViewHeight
{
    CGFloat height = self.view.bounds.size.height;
    
    height -= self.keyboardHC.constant;
    height -= self.textInputbarHC.constant;
    height -= self.autoCompletionViewHC.constant;
    height -= self.typingIndicatorViewHC.constant;
    
    if (height < 0) return 0;
    else return roundf(height);
}
```

- スクロールビューの高さは親Viewの高さからサブビューの高さを引いた余りとなっている。

## SlackTextViewController.m:1060

`willShowOrHideKeyboard:`に戻る。

```
- (void)willShowOrHideKeyboard:(NSNotification *)notification
{
    // ...
    
    // Updates the height constraints' constants
    self.keyboardHC.constant = [self appropriateKeyboardHeight:notification];
    self.scrollViewHC.constant = [self appropriateScrollViewHeight];
    
    // ...
}
```

- キーボードに関する通知によってキーボードの高さを計算し、それに合わせてスクロールビューの高さを調整していることがわかった。
- ただ、`constant`に値を代入してもすぐに反映されるわけではないため、どこかで再描画をリクエストしているはずだ。キーボードが表示されたあとに呼ばれる`didShowOrHideKeyboard:`を見る。

## Slacktextviewcontroller.m:1112

`-[didShowOrHideKeyboard:]`の中でレイアウトの変更に関わる部分を探す。

```
- (void)didShowOrHideKeyboard:(NSNotification *)notification
{
    // ...

    [self reloadInputAccessoryViewIfNeeded];
    [self updateKeyboardDismissModeIfNeeded];

    // Very important to invalidate this flag after the keyboard is dismissed or presented
    self.movingKeyboard = NO;
}
```

- `-[reloadInputAccessoryViewIfNeeded]`で後ほど出てくる`textView.inputAccessoryView`が初期化される。
- `-[updatekeyboarddismissmodeifneeded]`を詳しく見る。

## Slacktextviewcontroller.m:993

```
- (void)updateKeyboardDismissModeIfNeeded
{
    // Skips if the keyboard panning is disabled
    if (!self.isKeyboardPanningEnabled) {
        return;
    }
    
    UIScrollView *scrollView = self.scrollViewProxy;
    UIScrollViewKeyboardDismissMode dismissMode = scrollView.keyboardDismissMode;
    
    BOOL isPannable = self.textView.inputAccessoryView ? YES : NO;
    
    // Enables the keyboard dismiss mode
    if (dismissMode == UIScrollViewKeyboardDismissModeNone && isPannable) {
        scrollView.keyboardDismissMode = UIScrollViewKeyboardDismissModeInteractive;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didChangeKeyboardFrame:) name:SLKInputAccessoryViewKeyboardFrameDidChangeNotification object:nil];
    }
    // Disables the keyboard dismiss mode
    else if (dismissMode == UIScrollViewKeyboardDismissModeInteractive && !isPannable) {
        scrollView.keyboardDismissMode = UIScrollViewKeyboardDismissModeNone;
        [[NSNotificationCenter defaultCenter] removeObserver:self name:SLKInputAccessoryViewKeyboardFrameDidChangeNotification object:nil];
    }
}
```

- `UIScrollView`の`keyboardDismissMode`というプロパティはiOS 7から登場したプロパティで、スクロールビューがドラッグされたときのキーボードの振る舞いを以下の値で指定できる。
  - `UIScrollViewKeyboardDismissModeNone`: ドラッグでキーボードを閉じない。デフォルト値。
  - `UIScrollViewKeyboardDismissModeOnDrag`: ドラッグが始まったときにキーボードを閉じる。
  - `UIScrollViewKeyboardDismissModeInteractive`: スクロールビューから下にドラッグするとキーボードを閉じ、途中で上にドラッグすると閉じるのをキャンセルできる。
- `UITextView`の`inputAccessoryView`はキーボードの上に出てくる、よく「次へ」とか「閉じる」のようなボタンを載せるViewのこと。キーボードが表示され`-[didShowOrHideKeyboard:]`が呼ばれる中で初期化されているため、`isPannable`は`YES`となっているはず。
- よって、`keyboardDismissMode`が`UIScrollViewKeyboardDismissModeInteractive`に変更され、`SLKInputAccessoryViewKeyboardFrameDidChangeNotification`という通知に対して`didChangeKeyboardFrame`というメソッドが呼ばれるように登録される。
  - この通知は`textView`の`center`（iOS8以降場合）または`frame`（それ未満の場合）が変更されたときに送信される。
  - つまり、`textView`の描画領域が変更されたときに、`-[didChangeKeyboardFrame:]`が呼ばれることになる。

## SlackTextViewController.m:1150

```
- (void)didChangeKeyboardFrame:(NSNotification *)notification
{
    // ...
    
    self.keyboardHC.constant = [self appropriateKeyboardHeight:notification];
    self.scrollViewHC.constant = [self appropriateScrollViewHeight];
    
    // ...
    
    [self.view layoutIfNeeded];
}
```

- 再び2つの`HC`（高さに対する制約）の値を更新している。
- 最後に`-[CALayer layoutIfNeeded]`を呼んでいる。このメソッドは描画が必要な上位レイヤーが見つからなくなるまでツリーを遡り、描画が必要なレイヤー全体を描画する。この段階で制約に対する変更が反映されることになる。

## ここまでのおさらい

ここまで、キーボードの表示／非表示に伴うレイアウトの調整についてどのように実装されているのか調べてきた。キーボードの表示からレイアウトの調整が反映されるまで、おおまかに以下のような流れで処理が進行する。

1. ユーザーが入力を開始する。
2. `UIKeyboardWillShowNotification`が送信され、オブザーバーによって`-[willShowOrHideKeyboard:]`が呼ばれる。キーボードの高さとスクロールビューの適切な高さが再計算され、高さの制約上の数値が更新される（ここではまだViewに反映されない）。
3. `UIKeyboardDidShowNotification`が送信され、オブザーバーによって`-[didShowOrHideKeyboard:]`が呼ばれる。`textView`の`frame`の更新時に`-[didChangeKeyboardFrame:]`を呼ぶようにオブザーバーに登録する。
4. **何かしらのタイミング** で`textView`の`frame`が更新され、オブザーバーによって`-[didChangeKeyboardFrame:]`が呼ばれる。再度、キーボードとスクロールビューの高さが計算され設定される。そして、`-[CALayer layoutIfNeeded]`によって変更された制約上の値がViewに反映され再描画される。

ここで`textView`の`frame`が更新されるのはどのタイミングか考えてみると、2つ考えられる。

- `textView`の中身のテキストの行数が変更された場合。`textView`の中でテキストが改行されると、当然その高さが変わるのでそれに併せてスクロールビューの高さを小さくしなければならなくなる。そういった場合に対処する実装だと思う。
- ユーザーによってtextViewの位置が変更された場合。`scrollViewProxy`の`keyboardDismissMode`は`UIScrollViewKeyboardDismissModeInteractive`となっているため、ユーザーの操作によってキーボードを閉じることができる。キーボードを閉じる動作をした場合、当然`frame`も変更されるのでこのタイミングでも`-[didChangeKeyboardFrame:]`が呼ばれることになる。

# ユーザー名や絵文字の補完

続いて、ユーザー名や絵文字の補完がどのように実装されているのか調べる。ドキュメントによると、補完機能を利用する場合は`SlackTextViewController`のサブクラスは以下のような実装を行う必要がある。

1. `-[SlackTextViewController registerPrefixesForAutoCompletion:]`を呼んで自動補完を起動するプレフィックスを登録する。
2. `-[SlackTextViewController canShowAutoCompletion]`を実装して、自動補完Viewを表示するかどうかを`BOOL`で返すようにする。このメソッドはテキストが入力されたとき上で登録したプレフィックスを発見した場合に呼ばれる。自動補完Viewは`UITableView`のインスタンスであり、自由にカスタマイズできる。自動補完の候補はこのメソッドの中で用意する。
3. 自動補完Viewの高さを返すメソッド`heightForAutoCompletionView`を実装する。
4. 自動補完の候補が選択された場合、自動補完Viewの`-[UITableViewDelegate tableView:didSelectRowAtIndexPath:]`が呼ばれるので、この中で`-[SlackTextViewController acceptAutoCompletionWithString:]`を呼ぶと選択されたテキストが補完される。

これらのメソッドの実装を見ていくことにする。

## SlackTextViewController.m:1279

```
- (void)registerPrefixesForAutoCompletion:(NSArray *)prefixes
{
    NSMutableArray *array = [NSMutableArray arrayWithArray:self.registeredPrefixes];
    
    for (NSString *prefix in prefixes) {
        // Skips if the prefix is not a valid string
        if (![prefix isKindOfClass:[NSString class]] || prefix.length == 0) {
            continue;
        }
        
        // Adds the prefix if not contained already
        if (![array containsObject:prefix]) {
            [array addObject:prefix];
        }
    }
    
    if (_registeredPrefixes) {
        _registeredPrefixes = nil;
    }
    
    _registeredPrefixes = [[NSArray alloc] initWithArray:array];
}
```

- 内部的にミュータブルな配列に変換してプレフィックスを追加したあと、その結果をイミュータブルな配列に変換したものをインスタンス変数に入れている。

## SlackTextViewController.m:1575

```
- (void)textViewDidChangeSelection:(SLKTextView *)textView
{
    // The text view must be first responder
    if (![self.textView isFirstResponder]) {
        return;
    }
    
    // Skips if the loupe is visible or if there is a real text selection
    if (textView.isLoupeVisible || self.textView.selectedRange.length > 0) {
        return;
    }
    
    // Process the text at every caret movement
    [self processTextForAutoCompletion];
}
```

- `textView`の選択範囲、つまりカーソル位置が変わったとき`-[UITextViewDelegate textViewDidChangeSelection:]`が呼ばれる。
- この中で呼ばれる`-[SlackTextViewController processTextForAutoCompletion]`の中で、さらに呼ばれる`-[SlackTextViewController handleProcessesWord:range:]`を見る。

## SlackTextViewController.m:1343

```
- (void)handleProcessedWord:(NSString *)word range:(NSRange)range
{
    // ...
    
    BOOL canShow = [self canShowAutoCompletion];
    
    // Reload the tableview before showing it
    [self.autoCompletionView reloadData];
    [self.autoCompletionView setContentOffset:CGPointZero];
    
    [self showAutoCompletionView:canShow];
}
```

- `-[UITableView reloadData]`の前に`-[SlackTextViewController canShowAutoCompletion]`が呼ばれているので、ドキュメントの通り、このタイミングで補完候補を用意する必要がある。

## SlackTextViewController.m:1417

```
- (void)showAutoCompletionView:(BOOL)show
{
    CGFloat viewHeight = show ? [self heightForAutoCompletionView] : 0.0;
    
    // ...
    
    self.autoCompletionViewHC.constant = viewHeight;
    self.autoCompleting = show;
    
    // Toggles auto-correction if requiered
    [self enableTypingSuggestionIfNeeded];
    
    [self.view slk_animateLayoutIfNeededWithBounce:self.bounces
                                           options:UIViewAnimationOptionCurveEaseInOut|UIViewAnimationOptionLayoutSubviews|UIViewAnimationOptionBeginFromCurrentState
                                        animations:NULL];
}
```

- ドキュメントの通り、`-[SlackTextViewController heightForAutoCompletionView]`を実装して自動補完Viewの高さを返すように実装しておくと、その値が`autoCompletionViewHC.constant`にセットされる。
- 最後に`-[UIView slk_animateLayoutIfNeededWithBounce:options:animations]`によってアニメーションつきで再描画され、セットされた値が反映される。

## SlackTextViewController.m:1394

最後に、選択したテキストが補完される部分の実装を見ていく。

```
- (void)acceptAutoCompletionWithString:(NSString *)string
{
    if (string.length == 0) {
        return;
    }
    
    SLKTextView *textView = self.textView;
    
    NSRange range = NSMakeRange(self.foundPrefixRange.location+1, self.foundWord.length);
    NSRange insertionRange = [textView slk_insertText:string inRange:range];
    
    textView.selectedRange = NSMakeRange(insertionRange.location, 0);
    
    [self cancelAutoCompletion];
    
    [textView slk_scrollToCaretPositonAnimated:NO];
}
```

- 引数の`string`に選択された文字列が入っている。
- `-[UITextView slk_insertText:]`で選択された文字列を`textView`に挿入しているようだ。

## UITextView+SLKAdditions.m:90

```
- (NSRange)slk_insertText:(NSString *)text inRange:(NSRange)range
{
    // ...
    
    // Append the new string at the caret position
    if (range.length == 0)
    {
        NSString *leftString = [self.text substringToIndex:range.location];
        NSString *rightString = [self.text substringFromIndex: range.location];
        
        self.text = [NSString stringWithFormat:@"%@%@%@", leftString, text, rightString];
        
        range.location += [text length];
        return range;
    }
    // Some text is selected, so we replace it with the new text
    else if (range.location != NSNotFound && range.length > 0)
    {
        self.text = [self.text stringByReplacingCharactersInRange:range withString:text];
        
        return NSMakeRange(range.location+[self.text rangeOfString:text].length, text.length);
    }
    
    // No text has been inserted, but still return the caret range
    return self.selectedRange;
}
```

- `-[NSRange length]`が`0`の場合、何も選択されていない状態なので、カーソルのある位置に足りない部分の文字列を挿入している。
- `-[NSRange length]`が`1`以上の場合、文字列が選択されている状態なので、補完されるテキストと置換する。
