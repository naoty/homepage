import { Outlet } from "react-router";
import Container from "~/components/container";
import Link from "~/components/link";

export default function Posts() {
  return (
    <main className="grid grid-cols-8 gap-x-6 py-6">
      <Container className="col-span-4 col-start-3">
        <Outlet />
      </Container>
      <nav className="col-span-1 col-start-7 space-y-3 pt-6">
        <h2 className="border-b border-rails-border-main pb-1 font-bold">
          Links
        </h2>
        <ul>
          <li>
            <Link href="/" className="text-sm">
              Top
            </Link>
          </li>
          <li>
            <Link href="/posts" className="text-sm">
              Posts
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
