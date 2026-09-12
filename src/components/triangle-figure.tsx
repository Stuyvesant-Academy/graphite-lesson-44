import type { Figure, SideId, Tag } from "@/data/lesson";
import { cn } from "@/lib/utils";

const STAMPS: Tag[] = ["opp", "adj", "hyp"];

type Props = {
  figure: Figure;
  interactive?: boolean;
  labels?: Partial<Record<SideId, Tag | string>>;
  stamp?: Tag;
  onStampChange?: (tag: Tag) => void;
  onApply?: (side: SideId) => void;
};

export function TriangleFigure({
  figure,
  interactive,
  labels,
  stamp,
  onStampChange,
  onApply,
}: Props) {
  const { angleA, angleB, angleC = "90°", sideA, sideB, sideC, tags, highlight, unknown } = figure;
  const mergedTags = { ...tags, ...labels };
  const isUnknown = (id: string) => unknown?.includes(id as never);

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-ink bg-paper p-2">
      {interactive ? (
        <div className="mb-1 grid grid-cols-3 gap-1 px-1 pt-1">
          {STAMPS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onStampChange?.(tag)}
              className={cn(
                "h-11 rounded-[var(--radius-sm)] font-mono text-sm font-bold",
                stamp === tag ? "bg-ink text-paper" : "bg-paper-dark text-ink hover:bg-rule",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative px-16 pb-16 pt-10">
        <svg viewBox="0 0 220 148" className="h-auto w-full" role="img" aria-label="Right triangle">
          <polygon
            points="24,132 196,132 24,16"
            className="fill-paper-dark stroke-ink"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M 24 116 L 40 116 L 40 132" fill="none" className="stroke-ink" strokeWidth="1.6" />
          <path
            d="M 174 132 A 22 22 0 0 0 192 114"
            fill="none"
            className="stroke-ink"
            strokeWidth={highlight === "A" ? 2.4 : 1.4}
          />
          <text x="210" y="142" textAnchor="middle" className="font-sans text-[11px] font-bold" fill="var(--color-ink)">
            {angleA ?? ""}
          </text>
          <text x="24" y="10" textAnchor="middle" className="font-sans text-[11px] font-bold" fill="var(--color-ink)">
            {angleB ?? ""}
          </text>
          <text x="8" y="146" textAnchor="middle" className="font-sans text-[11px] font-bold" fill="var(--color-ink)">
            {angleC}
          </text>
        </svg>
        <SideChip
          className="absolute top-1/2 left-1 -translate-y-1/2"
          name={sideA}
          tag={mergedTags.a}
          dim={isUnknown("a")}
          onClick={interactive ? () => onApply?.("a") : undefined}
        />
        <SideChip
          className="absolute bottom-1 left-1/2 -translate-x-1/2"
          name={sideB}
          tag={mergedTags.b}
          dim={isUnknown("b")}
          onClick={interactive ? () => onApply?.("b") : undefined}
        />
        <SideChip
          className="absolute top-8 right-1"
          name={sideC}
          tag={mergedTags.c}
          dim={isUnknown("c")}
          onClick={interactive ? () => onApply?.("c") : undefined}
        />
      </div>
      {interactive ? (
        <p className="px-2 pb-2 text-center font-sans text-base font-bold text-ink">
          {stamp} is selected. Tap one side. Each tag can only sit on one side.
        </p>
      ) : null}
    </div>
  );
}

function SideChip({
  className,
  name,
  tag,
  dim,
  onClick,
}: {
  className?: string;
  name?: string;
  tag?: string;
  dim?: boolean;
  onClick?: () => void;
}) {
  const label = (name ?? "").trim();
  if ((!label || label === "?") && !tag) return null;
  const shown = label === "?" ? "" : label;
  const [left, right] = shown.includes("=") ? shown.split(/\s*=\s*/) : [shown, ""];
  const body = (
    <>
      {tag ? <p className="font-mono text-[11px] font-bold leading-tight">{tag}</p> : null}
      {left ? <p className="font-sans text-sm font-bold leading-tight">{left}</p> : null}
      {right ? <p className="font-sans text-sm font-bold leading-tight">{right}</p> : null}
    </>
  );
  const box = cn(
    "min-w-[4.25rem] rounded-md px-2 py-1 text-center",
    tag ? "bg-ink text-paper" : "border-2 border-ink bg-paper text-ink",
    dim && !tag && "border-dashed",
    className,
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={box}>
        {body}
      </button>
    );
  }
  return <div className={box}>{body}</div>;
}
