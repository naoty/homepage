import { Loader2 } from "lucide-react";
import { type AnchorHTMLAttributes } from "react";
import { Link as ReactRouterLink, useNavigation } from "react-router";
import { twMerge } from "tailwind-merge";

export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const navigation = useNavigation();
  const isLoading =
    navigation.state !== "idle" && navigation.location.pathname === props.href;
  const classNames = twMerge(
    "text-rails-link underline hover:bg-rails-link hover:text-white hover:no-underline",
    props.className,
  );

  return typeof props.href === "string" ? (
    <span className="space-x-1">
      <ReactRouterLink to={props.href} className={classNames}>
        {props.children}
      </ReactRouterLink>
      {isLoading && <Loader2 className="inline size-4 animate-spin" />}
    </span>
  ) : (
    <span className={classNames}>{props.children}</span>
  );
}
