import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

export function WriteCard({
  heading,
  lines,
  children,
}: {
  heading: string;
  lines: string[];
  children?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-xl)] border-2 border-ink bg-paper text-ink">
      <div className="flex items-center gap-2 border-b-2 border-ink px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-[var(--radius-xs)] bg-ink text-paper">
          <Pencil className="size-4" strokeWidth={2.2} />
        </span>
        <p className="font-sans text-base font-bold text-ink">Write this on paper</p>
      </div>
      <div className="px-5 py-5 sm:px-7">
        <h3 className="mb-3 font-display text-xl font-bold text-ink">{heading}</h3>
        <ul className="space-y-2">
          {lines.map((line) => (
            <li key={line} className="font-mono text-lg leading-8 text-ink">
              {line}
            </li>
          ))}
        </ul>
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
