import Container from "~/components/container";
import Link from "~/components/link";

export default function Home() {
  return (
    <main className="grid grid-cols-8 gap-x-6 pt-6">
      <Container className="col-span-4 col-start-3">
        <h1 className="border-rails-border-main border-b pb-3 text-3xl font-bold">
          Naoto Kaneko
        </h1>
        <p>
          都内在住のプログラマーです。これまで10年以上スタートアップや大企業においてRuby
          on
          Railsを使ったWebアプリケーションの開発、スマホアプリの開発、AWSを使ったクラウド上のインフラ構築などの業務に携わってきました。
        </p>
        <p>
          自分の生活に身近な課題を解決するプロダクト・サービスの開発を主な仕事としており、チーム一丸となって複雑なドメインに立ち向かっていくことにモチベーションを感じています。最近では、ドメイン駆動設計や型を利用した堅牢なプログラミングに興味があります。
        </p>
        <p>
          趣味は将棋です。現在はアマチュア二段の腕前で、三間飛車を好んで指しています。ネット対戦が主ですが、週末には近所の指導対局会やアマチュアの大会にも参加しています。
        </p>
      </Container>
      <nav className="col-span-1 col-start-7 space-y-3 pt-6">
        <h2 className="border-rails-border-main border-b pb-3 font-bold">
          Links
        </h2>
        <ul>
          <li>
            <Link href="/posts" className="text-sm">
              Posts
            </Link>
          </li>
          <li>
            <Link href="https://x.com/naoty_k" className="text-sm">
              X
            </Link>
          </li>
          <li>
            <Link href="https://github.com/naoty" className="text-sm">
              GitHub
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
