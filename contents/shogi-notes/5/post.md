---
title: 相中飛車の序盤のパターン
time: 2024-01-04 19:15
tags: ['相中飛車']
---

中飛車を指していると、どうしても相中飛車は避けられないのだけど、相振り飛車以上に定跡化されていない戦型で棋書もほとんど存在しないため、自分である程度パターンを整理していく必要がある。

そこで、今回は実戦でよく見かける序盤をパターン化してみた。

# 二枚銀

<MultiColumns>
  <Column>
    いきなり二枚銀にして中央突破を狙ってくる指し方をけっこう見かける。

    数の上では二枚銀の方が多いのだけど、相中飛車においては△５五飛に対して▲６六角と打つことができ、単純な数の攻めは通用しない。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1gkg1nl/4r2b1/pppp1p1pp/3spsp2/9/2P1PS3/PP1P1PPPP/1B2R1SK1/LN1G1G1NL w - 20 moves 5d5e 5f5e 6d5e 4f5e 4d5e 8h5e 2b5e 5h5e 5b5e B*6f' />
    
  </Column>
</MultiColumns>

<MultiColumns>
  <Column>
    その後は「歩越し銀には歩で対抗」の格言通りに▲６六歩と突いていく。

    ▲６六歩で角道が止まったのを見て△５五歩と突く手には、▲６五歩の「突き違いの歩」で対抗できる。以下、△同銀と取れば▲７七桂や▲５六飛から銀を取りに行ける。

    なので、△５五歩とは行かずに△７三桂、▲７七桂とお互いに桂馬を跳ねる形となる。次の△６二金はどこかで△６五銀と浮いたときに▲６八飛が銀取りと▲６三飛成の狙いに入るため、それを事前に受けた手となる。

    以降は桂交換から、▲７八飛と三間に振り直して薄くなった７筋を攻めていくのが分かりやすい。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln1gkg1nl/4r2b1/pppp1p1pp/3spsp2/9/2P1PS3/PP1P1PPPP/1B2R1SK1/LN1G1G1NL w - 20 moves 7c7d 6g6f 8a7c 8i7g 6a6b 7g6e 7c6e 6f6e 6d6e 5h7h' />
  </Column>
</MultiColumns>


# 角道クローズ型

<MultiColumns>
  <Column>
    相中飛車の後手番では角道を開けずに銀を繰り出す形もよく出てくる。角道を開けた後だと△４二銀と出れないため、銀を先に繰り出してから角道を開ける工夫をしている。

    先ほどと同様に△６四銀には▲６六歩と突いて「歩越し銀には歩で対抗」し、△５五歩には▲６五歩と突き違いの歩で対応する。以下、角交換から△５五飛に▲７七角で香をとることができる。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen lnsgkg1nl/4rs1b1/pppp1pppp/4p4/9/2P1P4/PP1P1PPPP/1B2R4/LNSGKGSNL b - 7 moves 7i6h 4b5c 6h5g 5c6d 5i4h 5a6b 4h3h 6b7b 6g6f 3c3d 6i6h 6a6b 6h6g 5d5e 6f6e 6d6e 5f5e 2b5e 8h5e 5b5e B*7g' />
  </Column>
</MultiColumns>

<MultiColumns>
  <Column>
    先手としては、▲６五歩から角交換を挑んで向かい飛車に組み替える方針や、右図のように▲７七桂、▲９七角から中央を攻めていく方針が考えられそうだ。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen ln3g1nl/1skgr2b1/pppp1p3/3sp1p2/1P5pp/P1PPP4/3GSPPPP/1B2RGK2/LN4SNL b - 29 moves 6f6e 6d5c 8i7g 5c4d 8h9g 2a3c 5g4f 2b1c 3g3f 7c7d 6e6d 6c6d 9g6d P*6c 6d9g' />
  </Column>
</MultiColumns>

# 先後同型

<MultiColumns>
  <Column>
    後手が先手と同じ手を指し続けていく展開もある。

    お互いに美濃囲いまで組んだら、向かい飛車か三間飛車に振り直して相振り飛車の将棋になっていく。この際、５筋から駒を交換しあっても先述のとおり、最後に▲６六角のような手で交換を仕掛けた側が損になる。
  </Column>
  <Column>
    <KifuPlayer sfen='position sfen lnsg1gsnl/1k2r2b1/pppp1p1pp/4p1p2/9/2P1P4/PP1P1PPPP/1B2R2K1/LNSG1GSNL b - 13 moves 3i3h 7a7b 9g9f 1c1d 9f9e 1d1e 8h7g 2b7g* 8i7g B*4d 7i6h 3a4b 6i7h 2a1c 6h5g' />
  </Column>
</MultiColumns>
