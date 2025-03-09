import { Outlet } from "react-router";
import Link from "~/components/link";

export default function Posts() {
  return (
    <div className="divide-border dark:divide-dark-border flex flex-col divide-y md:flex-row md:divide-x">
      <div className="bg-primary dark:bg-dark-primary flex-1 p-4 md:min-h-screen md:p-12">
        <Outlet />
      </div>
      <nav className="bg-secondary dark:bg-dark-secondary w-3xs space-y-4 p-4 md:min-h-screen md:py-12">
        <h2 className="text-xl">Links</h2>
        <ul className="flex flex-row gap-x-2 md:flex-col md:gap-y-1">
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
