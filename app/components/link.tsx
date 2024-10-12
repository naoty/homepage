import { type AnchorHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={props.href}
      className={twMerge(
        "text-rails-link underline hover:bg-rails-link hover:text-white hover:no-underline",
        props.className,
      )}
    >
      {props.children}
    </a>
  );
}
