---
title: Railsのロケールで特殊文字が表示されない問題
time: 2014-03-12 13:33
tags: ['rails']
---

```yaml:locales/ja.yml
ja:
  footer: "&copy; naoty All Rights Reserved."
```

などと`&copy;`のような特殊文字をロケールファイルで指定するとうまく表示されない。

```
> I18n.t("footer")
=> "&copy; naoty All Rights Reserved."
```

こういうときは特殊文字の16進数表記を使うとうまく表示される。

```yaml:locales/ja.yml
ja:
  footer: "\xA9 naoty All Rights Reserved."
```

```
> I18n.t("footer")
=> "© naoty All Rights Reserved."
```
