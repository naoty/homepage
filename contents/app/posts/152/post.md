---
title: プログラムにフリックさせてイベントを受け取る
time: 2012-10-26 14:33
tags: ['ios']
---

- フリックで左右にスクロールできるだけでなく、ナビゲーションバーにあるボタンからも左右にスクロールできるUIを想定。（標準のメールアプリみたいなイメージ）
- ボタンからスクロールした場合も、フリックしたときと同様に、スクロール前後のイベントを受け取ってあれこれやりたい。

```obj-c:MainViewController.m
- (void)viewDidLoad {
	[super viewDidLoad];

	self.scrollContainer.animationDelegate = self;
}

- (void)scrollViewWillBeginDragging:(ScrollContainer *)scrollContainer {
	NSLog(@"offset: %d", self.scrollContainer.contentOffset.x);
}

- (void)scrollViewDidEndDecelerating:(ScrollContainer *)scrollContainer {
	NSLog(@"offset: %d", self.scrollContainer.contentOffset.x);
}

- (void)segmentDidChange:(id)sender {
	if (![sender isKindOfClass:[UISegmentControl class]]) {
		return;
	}
	UISegmentControl *segmentControl = sender;

	if (segmentControl.selectedSegmentIndex == 0) {
		[self.scrollContainer moveToPreviousContent];
	} else if (segmentControl.selectedSegmentIndex == 1) {
		[self.scrollContainer moveToNextContent];
	}
}
```

- `UISegmentControl`で作ったボタンが押されると、`ScrollContainer`クラスのメソッドを呼び出して、左右どちらかにスクロールされる。
- `ScrollContainer`は以下のような`UIScrollView`のサブクラス。

```obj-c:ScrollContainer.m
static CGFloat kContentWidth = 320.0f;

- (void)moveToNextContent {
	[UIView beginAnimation:nil context:NULL];
	[UIView setAnimationDuration:0.3f];
	[UIView setAnimationDelegate:self.animationDelegate];
	[UIView setAnimationWillStartSelector:@selector(scrollViewWillBeginDragging:)];
	[UIView setAnimationDidStopSelector:@selector(scrollViewDidEndDecelerating:)];

	CGPoint nextContentOffset = CGPointMake(self.contentOffset.x + kContentWidth, 0);
	self.contentOffset = nextContentOffset;

	[UIView commitAnimations];
}

- (void)moveToPreviousContent {
	[UIView beginAnimation:nil context:NULL];
	[UIView setAnimationDuration:0.3f];
	[UIView setAnimationDelegate:self.animationDelegate];
	[UIView setAnimationWillStartSelector:@selector(scrollViewWillBeginDragging:)];
	[UIView setAnimationDidStopSelector:@selector(scrollViewDidEndDecelerating:)];

	CGPoint previousContentOffset = CGPointMake(self.contentOffset.x - kContentWidth, 0);
	self.contentOffset = previousContentOffset;

	[UIView commitAnimations];
}
```

- `setContentOffset:animated:`メソッドでもプログラムによるフリックを実現できるんだけど、スクロール前後のイベントを受け取ってあれこれすることはできないっぽい。
- そこで、`UIView`クラスのアニメーションを使って、アニメーション前後のイベントを利用する。
- `setAnimationWillStartSelector:`や`setAnimationDidStopSelector:`に直接`scrollViewDidEndDecelerating:`などを指定することで、プログラムによるフリックの場合でもイベントを受け取ることができる。
