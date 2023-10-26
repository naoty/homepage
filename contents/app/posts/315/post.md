---
title: よく使うLaTeXコマンド
time: 2018-01-08T08:57:00+0900
description: Jupyter Notebookでよく使っているLaTeXコマンドをまとめた
---

最近、Jupyter Notebookを使って機械学習を学び始めた。数式が頻繁に出てくるため、LaTeXを初めて使うようになった。

自分のためのメモとして、よく使う数式とその記法をまとめた。

<table>
  <thead>
    <tr>
      <th>記法</th>
      <th>数式</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`$x^{-2}$`</td>
      <td>$x^{-2}$</td>
    </tr>
    <tr>
      <td>`$x_{12}$`</td>
      <td>$x\_{12}$</td>
    </tr>
    <tr>
      <td>`$\frac{1}{2}$`</td>
      <td>$\frac{1}{2}$</td>
    </tr>
    <tr>
      <td>`$y = 2x + 1 \tag{1}$`</td>
      <td>$y = 2x + 1 \tag{1}$</td>
    </tr>
    <tr>
      <td>`$\frac{\partial L}{\partial W}$`</td>
      <td>$\frac{\partial L}{\partial W}$</td>
    </tr>
    <tr>
      <td><pre><code>$$
\begin{align}
x + y = 3 \tag{1} \\\
2x - y = 0 \tag{2}
\end{align}
$$</code></pre></td>
      <td>$$
\begin{align}
x + y = 3 \tag{1} \\\
2x - y = 0 \tag{2}
\end{align}
$$</td>
    </tr>
    <tr>
      <td><pre><code>$$
y = \begin{cases}
x & (x > 0) \\\
0 & (x \leqq 0)
\end{cases}
$$</code></pre>
      </td>
      <td>$$
y = \begin{cases}
x & (x > 0) \\\
0 & (x \leqq 0)
\end{cases}
$$</td>
    </tr>
    <tr>
      <td><pre><code>$$
\sum\_{i=0}^{k} x\_{k}
$$</code></pre></td>
      <td>$$
\sum\_{i=0}^{k} x\_k
$$</td>
    </tr>
    <tr>
      <td><pre><code>$$
\begin{pmatrix}
1 & 2 \\\
3 & 4
\end{pmatrix}
$$</code></pre></td>
      <td>$$
\begin{pmatrix}
1 & 2 \\\
3 & 4
\end{pmatrix}
$$</td>
    </tr>
  </tbody>
</table>
