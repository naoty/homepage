import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts", "routes/posts.tsx", [
    index("routes/posts/home.tsx"),
    route(":id", "routes/posts/post.tsx"),
    route("feed.xml", "routes/posts/feed.ts"),
  ]),
];
