import styles from '@/components/content.module.css'
import type { ComponentProps } from "react"

type Props = ComponentProps<'section'>

export default function Content({ children, ...props }: Props) {
  return (
    <section className={`${styles.body}`} {...props}>
      {children}
    </section>
  )
}
