import Container from "~/components/container";
import Link from "~/components/link";

export default function Home() {
  return (
    <main className="grid grid-cols-8 gap-x-6 pt-6">
      <Container className="col-span-4 col-start-3">
        <h1 className="border-rails-border-main border-b pb-3 text-3xl font-bold">
          Posts
        </h1>
        <ul className="list-disc pl-6">
          <li>
            <Link href="">RemixからFirebase Authenticationで認証する</Link>
          </li>
          <li>
            <Link href="">スマホからブログを書きたい</Link>
          </li>
          <li>
            <Link href="">Full Stack Web Development with Remix</Link>
          </li>
          <li>
            <Link href="">Windowsのキーマッピング3</Link>
          </li>
          <li>
            <Link href="">sealed classとの付き合い方を考える</Link>
          </li>
          <li>
            <Link href="">複雑性はチリツモであるという話</Link>
          </li>
        </ul>
      </Container>
    </main>
  );
}
