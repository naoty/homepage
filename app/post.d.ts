interface Post {
  attributes: Frontmatter;
  html: string;
}

interface Frontmatter {
  title: string;
  time: string;
  tags: string[];
}

interface PostAttribute {
  id: number;
  title: string;
  time: string;
  tags: string[];
}
