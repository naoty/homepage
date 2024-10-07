import { type HTMLAttributes } from "react";

export default function Container(props: HTMLAttributes<HTMLElement>) {
  return (
    <section className="border-3 border-rails-border-content w-[500px] space-y-6 bg-white p-6">
      {props.children}
    </section>
  );
}
