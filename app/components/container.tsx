import { type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Container(props: HTMLAttributes<HTMLElement>) {
  return (
    <section
      {...props}
      className={twMerge(
        "border-main space-y-6 border-3 bg-white p-6",
        props.className,
      )}
    >
      {props.children}
    </section>
  );
}
