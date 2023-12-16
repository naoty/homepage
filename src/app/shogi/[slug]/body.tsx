'use client'

import Column from "@/components/column"
import Content from "@/components/content"
import MultiColumns from "@/components/multi-columns"
import { KifuPlayer } from "@naoty/kifu-player"
import type { MDXComponents } from 'mdx/types'
import { useMDXComponent } from "next-contentlayer/hooks"
import { ReactNode } from "react"

import '@naoty/kifu-player/dist/style.css'

export default function Body({ code, className }: { code: string, className: string }) {
  const MDXContent = useMDXComponent(code)

  return (
    <Content className={className}>
      <MDXContent components={mdxComponents} />
    </Content>
  )
}

const mdxComponents: MDXComponents = {
  MultiColumns: ({ children }: { children: ReactNode }) => <MultiColumns>{children}</MultiColumns>,
  Column: ({ children }: { children: ReactNode }) => <Column>{children}</Column>,
  KifuPlayer: ({ sfen }: { sfen: string }) => <KifuPlayer sfen={sfen} />,
}
