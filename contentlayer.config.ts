import { defineDocumentType, makeSource } from 'contentlayer/source-files'
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
    time: { type: 'date', required: true },
    description: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' }, default: [] }
  },
  computedFields: {
    id: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.split('/')[1],
    }
  }
}))

export default makeSource({
  contentDirPath: './contents',
  documentTypes: [Page, Post],
  markdown: {
    rehypePlugins: [rehypePrettyCode],
  },
})
