import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./index.css";

export default function Root() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>Naoto Kaneko</title>
        <Links />
      </head>
      <body className="bg-rails-background">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
