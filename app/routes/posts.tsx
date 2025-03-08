import { Outlet } from "react-router";
import Link from "~/components/link";

export default function Posts() {
  return (
    <div className="divide-border flex flex-row divide-x">
      <div className="bg-primary min-h-screen flex-1 p-12">
        <Outlet />
      </div>
      <nav className="bg-secondary min-h-screen w-3xs space-y-4 px-4 py-12">
        <h2 className="text-xl">Links</h2>
        <ul className="space-y-1">
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
    </div>
  );
}
