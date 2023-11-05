import { ComponentProps } from "react"
import clsx from "clsx"

type Props = ComponentProps<'button'>

export default function FilterButton(props: Props) {
  return (
    <button
      className={clsx(props.className, 'px-2 py-1 rounded hover:bg-neutral-100 text-sm transition')}
    >
      {props.children}
    </button>
  )
}
