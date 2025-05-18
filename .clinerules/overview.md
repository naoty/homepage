# 概要
- このリポジトリはnaotyのホームページを生成するためのコードと、ホームページのコンテンツを含む。
- ホームページはnaotyについての自己紹介を含むページと、ブログから構成されており、 https://naoty.dev で公開されている。

## ブログ
- ブログ記事にはIDが1から振られており、 `https://naoty.dev/posts/${id}` で公開されている。
- ブログ記事はmarkdown形式のファイルで記述されている。
- ブログ記事はタイトル（必須）、公開日時（必須、 `yyyy-mm-dd HH:MM` 形式）、タグ（0個以上）がfrontmatterで設定されている。

## 技術スタック
- React
- React Router v7以降
- TailwindCSS

## ディレクトリ構成
- `app`: React Routerアプリケーション
- `contents/pages/home.md`: トップページのコンテンツ
- `contents/posts/${id}/post.md`: ブログ記事のコンテンツ
- `packages/vite-plugin-markdown`: markdown形式のコンテンツをReact Routerアプリケーション内で `import` するためのviteプラグインで、細かい調整のため自作している
- `public/posts/${id}/`: ブログ記事で参照する画像ファイルなど
