import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Container(props: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={twMerge(
        "border-3 border-rails-border-content space-y-6 bg-white p-6",
        props.className,
      )}
    >
      {props.children}
    </section>
  );
}
