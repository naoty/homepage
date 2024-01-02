---
title: ▲５四歩が突ける条件
time: 2024-01-02 17:09
tags: ['先手中飛車']
---

超速から銀対抗の形になったとき、▲５四歩から歩交換を入れられるかによってその後の方針が大きく変わってくる。もし歩交換が入れば、６六の銀を▲５五銀と活用して、△同銀、▲同角と角をさばいたり、５筋を飛車と銀で攻めたり、４四の地点を角と銀で攻めるといったバリエーションが生まれ、気持ちよく攻めていくことができる。歩交換ができないとなると、逆に居飛車側から５五の歩を狙われる展開になりやすいし、手厚い５筋を避けて７筋から攻めるといった方針にシフトする必要がある。

# 結論
長くなりそうなので先に結論をまとめておく。

- ▲５四歩、△同歩、▲同飛から△３四歩が取れる場合は▲５四歩が突ける。
- 二枚銀急戦の場合、△７三桂+△９三歩の形であれば▲５四歩が突ける。△５五歩で飛車がつかまっても▲７五歩と▲９五角から反撃することができる。
- さらに二枚銀急戦の場合、△９四歩から△７三桂の形になると▲５四歩が突けないため、こちらも▲６六銀+▲５六銀の二枚銀で対抗する。

# 早めの仕掛け
まずは二枚銀急戦になる前に▲５四歩が突けるかどうかを調べる。

## △４二銀

<MultiColumns>
  <Column>
    ３四の歩にひもがついていないので、△５五歩と打たれても▲３四飛で飛車がつかまっていない。よって、この時点では▲５四歩が突ける。

    居飛車は▲３四飛と取られてはまずいので、▲４四歩と突く一手だと思う。こうなると、△４四銀からの二枚銀急戦の形にならないため、△４三銀から雁木に組んで持久戦模様になりそう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln3g1nl/1r2gskb1/3ppp1p1/p1ps2p1p/1p2P4/2PS4P/PPBP1PPP1/4R1SK1/LN1G1G1NL b - 27 moves 5e5d 5c5d 5h5d 4c4d 5d5i' />
  </Column>
</MultiColumns>

## △３三銀

<MultiColumns>
  <Column>
    ３三に銀が上がっていると今度は▲３四飛と取れないため、△５五歩で飛車がつかまっている。ここから金か銀と交換することになるが、中飛車としては失敗で劣勢と言えそう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln3g1nl/1r2g1kb1/p2pppsp1/2ps2p1p/1p2P4/2PS4P/PPBP1PPP1/4R1SK1/LN1G1G1NL b - 27 moves 5e5d 5c5d 5h5d P*5e 6f5e 6d6e' />
  </Column>
</MultiColumns>

## △４四歩

<MultiColumns>
  <Column>
    ４四の歩が上がっている場合も▲３四飛と取れないため、△５五歩で飛車がつかまってしまい、中飛車が失敗と言える。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln3g1nl/1r2gskb1/p2pp2p1/2ps1pp1p/1p2P4/2PS4P/PPBP1PPP1/4R1SK1/LN1G1G1NL b - 27 moves 5e5d 5c5d 5h5d P*5e 6f5e 5b4c' />
  </Column>
</MultiColumns>

# 二枚銀急戦に対する仕掛け
△４四銀と二枚銀急戦の形になった場合にも▲５四歩が突けるのか調べていく。

## △８一桂

<MultiColumns>
  <Column>
    居飛車の右桂が動いていない状態で突くと、後述する筋が使えず▲３四飛とかわすこともできないため、飛車がつかまってしまう。

    ▲５六歩と合わせて飛車の逃げ道を作ろうとしても相手にされず、金で詰まされてしまう。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1g1g1nl/1r4kb1/p2ppp1p1/2ps1sp1p/1p2P4/2PS4P/PPBP1PPP1/4R1SK1/LN1G1G1NL b - 27 moves 5e5d 5c5d 5h5d P*5e P*5f 6a5b 6f5e 5b5c' />
  </Column>
</MultiColumns>

## △７三桂+△９三歩

<MultiColumns>
  <Column>
    右桂が７三に跳ねている場合、△５五歩で飛車がつかまっても▲７五歩から反撃することができる。△同歩だと▲７四歩とされてしまうため、△６五桂と跳ねる。
    
    このときに△９三歩型であると、▲９五角と飛び出す幽霊角の筋があり、飛車を切ってから▲７三角成と馬を作ることができる。

    飛車と銀の交換で駒損しているものの、居飛車の飛車・角がまだ働いておらず▲６五馬から桂もとれそうなので、先手が優勢と言えそうだ。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen l2g1g1nl/1r4kb1/p1nppp1p1/2ps1sp1p/1p2P4/2PS1P2P/PPBP2PP1/4R1SK1/LN1G1G1NL b - 29 moves 5e5d 5c5d 5h5d P*5e 7f7e 7c6e 7g9e 9c9d 5d6d 6c6d 9e7c+' />
  </Column>
</MultiColumns>

## △７三桂+△９四歩

<MultiColumns>
  <Column>
    居飛車側も工夫して△９四歩を入れてから△７三桂と跳ねたらどうなるだろうか。

    やはり△６五桂に対して△６八角と引くしかなく、飛車を活用する手立てがないため、これも中飛車が失敗と言える。

    この形では、▲５四歩ではなく▲５六銀と上がってこちらも二枚銀の形を作るのが定跡で、居飛車側からの攻めがない。よって、居飛車が△９四歩を省略して桂馬を跳ねたら▲５四歩を突くし、△９四歩が入ったらそのスキにこちらも二枚銀の体制を築くというのが中飛車側の二枚銀急戦に対する大きな方針と言えそうだ。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen l2g1g1nl/1r4kb1/2nppp1p1/p1ps1sp1p/1p2P4/2PS1P2P/PPBP1SPP1/4R2K1/LN1G1G1NL b - 31 moves 5e5d 5c5d 5h5d p*5e 7f7e 7c6e 7g6h' />
  </Column>
</MultiColumns>
