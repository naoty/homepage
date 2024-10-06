export default function Home() {
  return (
    <main className="flex w-[750px] justify-center space-x-6">
      <section className="border-3 border-rails-border-content w-[500px] space-y-6 bg-white p-6">
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
      </section>
      <nav className="w-[175px] space-y-3 pt-6">
        <h2 className="border-rails-border-main border-b pb-3 font-bold">
          Links
        </h2>
        <ul>
          <li>
            <a
              href="https://x.com/naoty_k"
              className="text-rails-link hover:bg-rails-link text-sm underline hover:text-white hover:no-underline"
            >
              X
            </a>
          </li>
          <li>
            <a
              href="https://github.com/naoty"
              className="text-rails-link hover:bg-rails-link text-sm underline hover:text-white hover:no-underline"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
