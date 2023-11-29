import type { ComponentProps } from "react"
import clsx from "clsx"

import '@/components/content.css'

type Props = ComponentProps<'section'>

export default function Content({ children, ...props }: Props) {
  return (
    <section {...props} className={clsx(props.className, 'content')}>
      {children}
    </section>
  )
}
