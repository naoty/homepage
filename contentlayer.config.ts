import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { format, parseISO } from 'date-fns'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.md',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
  },
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/post.md',
  fields: {
    title: { type: 'string', required: true },
    time: { type: 'string', required: true },
    description: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, default: [] }
  },
  computedFields: {
    id: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.split('/')[1],
    },
    formattedTime: {
      type: 'string',
      resolve: (post) => format(parseISO(post.time), 'y-MM-dd')
    },
    year: {
      type: 'number',
      resolve: (post) => parseISO(post.time).getFullYear()
    }
  }
}))

export default makeSource({
  contentDirPath: './contents',
  documentTypes: [Page, Post],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrettyCode],
  },
})
