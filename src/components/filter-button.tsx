import Link from "next/link"
import clsx from "clsx"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof Link>

export default function FilterButton(props: Props) {
  return (
    <Link
      href={props.href}
      className={clsx(props.className, 'px-2 py-1 rounded hover:bg-neutral-100 text-sm transition')}
    >
      {props.children}
    </Link>
  )
}
