declare module "*.md" {
  export const attributes: Frontmatter;
  export const html: string;
}

interface Frontmatter {
  title: string;
  time: string;
  tags: string[];
}
