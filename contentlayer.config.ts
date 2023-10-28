import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.md'
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/post.md',
  fields: {
    title: { type: 'string', required: true },
    time: { type: 'date', required: true },
    description: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' } }
  }
}))

export default makeSource({
  contentDirPath: './contents',
  documentTypes: [Page, Post]
})
