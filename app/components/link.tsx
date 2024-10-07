import { type AnchorHTMLAttributes } from "react";

export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={props.href}
      className="text-rails-link hover:bg-rails-link text-sm underline hover:text-white hover:no-underline"
    >
      {props.children}
    </a>
  );
}
