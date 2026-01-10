import { index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("posts", [
    index("routes/posts/index.tsx"),
    route(":id", "routes/posts/post.tsx"),
    route("feed.xml", "routes/posts/feed.ts"),
  ]),
];
