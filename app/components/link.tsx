import { type AnchorHTMLAttributes } from "react";
import { Link as ReactRouterLink } from "react-router";
import { twMerge } from "tailwind-merge";

export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classNames = twMerge(
    "text-rails-link underline hover:bg-rails-link hover:text-white hover:no-underline",
    props.className,
  );

  return typeof props.href === "string" ? (
    <ReactRouterLink to={props.href} className={classNames}>
      {props.children}
    </ReactRouterLink>
  ) : (
    <span className={classNames}>{props.children}</span>
  );
}
