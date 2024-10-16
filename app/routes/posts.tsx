import { Outlet } from "react-router";
import Container from "~/components/container";
import Link from "~/components/link";

export default function Posts() {
  return (
    <main className="grid grid-cols-12 gap-x-6 py-6">
      <Container className="col-span-10 col-start-2 md:col-span-6 md:col-start-4">
        <Outlet />
      </Container>
      <nav className="col-span-10 col-start-2 space-y-3 pt-6 md:col-span-2">
        <h2 className="border-b border-rails-border-main pb-1 font-bold">
          Links
        </h2>
        <ul className="flex flex-row space-x-2 md:flex-col md:space-x-0">
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
