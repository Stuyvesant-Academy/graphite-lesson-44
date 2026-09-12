import { useMemo, useState } from "react";
import { evalDegExpr, formatCalc } from "@/lib/check";

const KEYS = [
  "sin",
  "cos",
  "tan",
  "×",
  "sin^-1",
  "cos^-1",
  "tan^-1",
  "÷",
  "(",
  ")",
  "^",
  "sqrt",
];

export function TrigCalc() {
  const [raw, setRaw] = useState("");
  const value = useMemo(() => evalDegExpr(raw), [raw]);
  const display = value === null ? (raw.trim() ? "—" : "") : formatCalc(value);

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-ink bg-paper p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-sans text-base font-bold text-ink">Calculator</p>
        <span className="rounded-[var(--radius-sm)] border-2 border-ink px-2 py-0.5 font-sans text-sm font-bold text-ink">
          DEG
        </span>
      </div>
      <label className="sr-only" htmlFor="calc-input">
        Expression
      </label>
      <input
        id="calc-input"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="h-12 w-full rounded-[var(--radius-sm)] border-2 border-ink bg-paper px-3 font-mono text-lg text-ink placeholder:text-faint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink"
        placeholder="20 × cos 32"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <p className="mt-2 font-mono text-2xl font-bold text-ink tabular-nums">
        {display ? `= ${display}` : "= ?"}
      </p>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              setRaw((s) => {
                const pad = s && !s.endsWith(" ") && !s.endsWith("(") ? " " : "";
                return `${s}${pad}${key === "×" || key === "÷" || key === "^" ? key : key}`;
              })
            }
            className="h-11 rounded-[var(--radius-sm)] border-2 border-ink bg-paper font-mono text-sm font-bold text-ink hover:bg-paper-dark"
          >
            {key}
          </button>
        ))}
      </div>
      <p className="mt-2 font-sans text-base text-ink">
        Type the whole line, like 20 × cos 32. Locked to degrees.
      </p>
    </div>
  );
}
