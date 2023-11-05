import type { ComponentProps } from "react"
import clsx from "clsx"
import styles from '@/components/content.module.css'

type Props = ComponentProps<'section'>

export default function Content({ children, ...props }: Props) {
  return (
    <section {...props} className={clsx(props.className, styles.body)}>
      {children}
    </section>
  )
}
