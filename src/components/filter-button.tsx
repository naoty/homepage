import Link from "next/link"
import clsx from "clsx"
import { ComponentProps } from "react"

type LinkProps = ComponentProps<typeof Link>

type Props = {
  active?: boolean
}

export default function FilterButton(props: LinkProps & Props) {
  return (
    <Link
      href={props.href}
      className={clsx(
        props.className,
        'px-2 py-1 rounded hover:bg-neutral-100 text-sm transition',
        {
          'bg-neutral-200 hover:bg-neutral-200': props.active,
        },
      )}
    >
      {props.children}
    </Link>
  )
}
