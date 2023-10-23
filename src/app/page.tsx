export default function Home() {
  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose max-w-none'>
        <h1>Naoto Kaneko</h1>
        <p>都内在住のプログラマーです。これまで10年以上スタートアップや大企業にてWebサービスやスマホアプリの開発/運用を携わってきました。</p>
        <p>バックエンド、Webフロントエンド、スマホアプリの開発や、AWS上でのインフラ構築など幅広く経験があることが強みで、プロジェクトのスムーズな進行や保守しやすい設計・実装を心がけています。</p>
        <h2>できること（2022/7）</h2>
        <ul>
          <li><b>Ruby on Rails</b>: キャリアの中で最も長い時間扱っており、これまで5つ以上のWebサービスやスマホアプリのバックエンドをRailsで開発してきました。Rails wayからなるべく外れないように標準的な設計を心がけることで、保守性を保つようにしています。また、RailsへのPull Requestをmergeしてもらった経験もあり、Railsに対する理解もある程度は持っています。</li>
          <li><b>Ruby</b>: 仕事ではなく自分のためのツールをRubyで書くことが多く、ブログのビルドツールやTODO管理ツールをRubyで開発しています。また、HomebrewやCocoaPodsといったRuby製のOSSへのコントリビューションも経験してきました。</li>
          <li><b>React</b>: 直近のプロジェクトにてReactとTypeScriptを使ったWebフロントエンドの実装を経験しており、基本的な開発はひととおり可能です。</li>
          <li><b>AWS</b>:  VPCを使ったネットワークの構築からECS上でのRailsアプリケーションの運用までおこない、それらをTerraformを使ってコードとして管理していました。また、aws-sdk-rubyを使い、S3やSQS等のサービスを扱うアプリケーションも開発してきました。</li>
          <li><b>MySQL</b>: バックエンドの開発ではほぼMySQLを利用してきました。基本的なパフォーマンスチューニングやロックにまつわるトラブルシューティングを経験しました。</li>
          <li><b>iOSアプリ開発</b>: Objective-CやSwiftを使いネイティブでiOSアプリを開発していました。IAPやCore Bluetoothを使った経験もあります。また、SwiftによるライブラリをいくつかOSSとして公開しており、2700以上のStarを持つライブラリもあります。ただし、最後にiOSアプリを開発していたのは5年以上前なので、ブランクがあります。</li>
        </ul>
        <h2>リンク</h2>
        <ul>
          <li><a href='https://blog.naoty.dev'>Blog</a></li>
          <li><a href='https://github.com/naoty'>GitHub</a></li>
          <li><a href='https://twitter.com'>X</a></li>
        </ul>
      </article>
    </main>
  )
}
