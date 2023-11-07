import clsx from "clsx";
import NextLink from "next/link";
import { ComponentProps } from "react";

type NextLinkProps = ComponentProps<typeof NextLink>

export default function Link(props: NextLinkProps) {
  return (
    <NextLink
      href={props.href}
      className={clsx(props.className, 'underline hover:text-slate-500 transition')}
    >
      {props.children}
    </NextLink>
  )
}
