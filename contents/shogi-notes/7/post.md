---
title: 対美濃囲いの端攻め
time: 2024-01-21 21:41
tags: ['相振り飛車']
---

# TL;DR
- 端を突き越せているとき、持ち駒に歩が二枚あれば、▲９四歩から端攻めを仕掛けてお互い桂香歩を持ち合う結果になりそう。
- 端を突き合っているとき、向かい飛車であれば、持ち駒の二歩を使って香を釣り上げて銀で狙っていく筋がよさそう。
- 端を突き合っているとき、三間飛車であれば、△９四香に対して７筋から歩交換を仕掛けていく筋がありそうだが、成立するかは微妙なところ。

# 端を突き越せているとき

## 持ち駒に歩が一枚

<MultiColumns>
  <Column>
    ▲９四歩、△同歩から持ち駒の歩を使って▲９三歩とするのが、端攻めの基本とされている。

    △同香であれば、▲８五桂から香を取りに行く。以下、右図の通り桂香歩をお互い手持ちにする結果になる。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/pppp5/9/P8/1R1B5/2N6/9/L8 b P 1 moves 9e9d 9c9d P*9c 9a9c 7g8e 6c6d 8e9c+ 8a9c 9i9d P*9b 9d9c+ 9b9c' />
  </Column>
</MultiColumns>

<MultiColumns>
  <Column>
    △同桂であれば、▲９四香から桂を取りに行く。以下、右図の通り桂香の交換となる。

    受ける立場としては、こちらの変化の方が相手の桂の活用を抑えられているため成功と言えるだろう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/pppp5/9/P8/1R1B5/2N6/9/L8 b P 1 moves 9e9d 9c9d P*9c 8a9c 9i9d P*9b 9d9c+ 9b9c' />
  </Column>
</MultiColumns>

## 持ち駒に歩が二枚

<MultiColumns>
  <Column>
    持ち駒に歩が二枚以上ある場合、△同桂の展開は少し変化する。

    後手から△９二歩と打たれる前に▲９二歩と打つことで、受けが効かない形にする。以下、▲８五桂など端に戦力を集中させることで端を突破できそうだ。

    受ける立場としては、持ち駒に歩が複数あるなら▲９三歩に対して△同香と取る方が安全と言えそうだ。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/pppp5/9/P8/1R1B5/2N6/9/L8 b P2 1 moves 9e9d 9c9d P*9c 8a9c P*9b 9a9b 9i9d 6c6d 8f9f' />
  </Column>
</MultiColumns>

# 端を突き合っているとき

## 向かい飛車の場合

<MultiColumns>
  <Column>
    端を突き合っている場合、▲８五桂に対して△９四香とかわせるため、端攻めが不発に終わってしまう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/1ppp5/p8/9/PR1B5/2N6/9/L8 b P 1 moves 9f9e 9d9e P*9c 9a9c 7g8e 9c9d' />
  </Column>
</MultiColumns>

<MultiColumns>
  <Column>
    なので、この場合は▲８五桂は無理なので、▲９四歩と叩いて銀で香を狙っていくのがよさそう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/1ppp5/p8/9/PRS6/9/9/L8 b P2 1 moves 9f9e 9d9e P*9c 9a9c P*9d 9c9d 7f8e' />
  </Column>
</MultiColumns>

## 三間飛車の場合

<MultiColumns>
  <Column>
    三間飛車の場合、△９四香に対して７筋から歩交換して▲９四飛を狙う筋があるが、△８四歩が好手で▲同飛に対して△８三銀と受けられる。持ち駒次第では、△同角から７三や９三に殺到できそうだ。

    ただ、後手の飛車は四段目に浮いていることが多いため、この筋も成立するかは微妙なところ。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g5/1ks6/1ppp5/p8/2P6/P1RB5/2N6/9/L8 b P 1 moves 9f9e 9d9e P*9c 9a9c 7g8e 9c9d 7e7d 7c7d 7f7d 8c8d' />
  </Column>
</MultiColumns>
