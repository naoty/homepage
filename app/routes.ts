import {
  index,
  route,
  type RouteConfig,
} from "node_modules/@react-router/dev/dist/config/routes";

export const routes: RouteConfig = [
  index("routes/home.tsx"),
  route("posts", "routes/posts.tsx", [
    index("routes/posts/home.tsx"),
    route(":id", "routes/posts/post.tsx"),
    route("feed.xml", "routes/posts/feed.ts"),
  ]),
];
