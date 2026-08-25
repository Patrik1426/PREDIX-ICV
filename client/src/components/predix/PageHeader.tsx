import { ReactNode } from "react";

type PageHeaderProps = { eyebrow: string; title: string; description: string; action?: ReactNode };

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  );
}
