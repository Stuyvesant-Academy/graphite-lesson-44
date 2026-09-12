import { useEffect, useRef, useState, type FormEvent } from "react";
import { Lightbulb } from "lucide-react";
import type { Gate as GateType, Tag } from "@/data/lesson";
import { numberMatches, phraseMatches } from "@/lib/check";
import { promptFor } from "@/lib/hints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  gate: GateType;
  hint?: string;
  hintsOn: boolean;
  onPass: () => void;
};

export function Gate({ gate, hint, hintsOn, onPass }: Props) {
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(false);
  const [value, setValue] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTries(0);
    setValue("");
    setValues({});
    setShowHint(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 180);
    return () => window.clearTimeout(t);
  }, [gate]);

  useEffect(() => {
    if (!hintsOn) setShowHint(false);
  }, [hintsOn]);

  const fail = () => {
    setTries((n) => n + 1);
    setShake(true);
    window.setTimeout(() => setShake(false), 320);
    if (hintsOn && tries + 1 >= 2) setShowHint(true);
  };

  if (gate.kind === "continue") {
    return (
      <Button variant="cream" size="lg" className="w-full" onClick={onPass}>
        {gate.label}
      </Button>
    );
  }

  if (gate.kind === "phrase" || gate.kind === "number") {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      const ok =
        gate.kind === "phrase"
          ? phraseMatches(value, gate.expect)
          : numberMatches(value, gate.expect, gate.tol);
      if (ok) onPass();
      else fail();
    };
    return (
      <form onSubmit={submit} className="space-y-3">
        <p className="font-sans text-lg font-bold text-ink">
          {promptFor(gate.kind, gate.prompt, hintsOn)}
        </p>
        <div className={cn("flex flex-col gap-2 sm:flex-row", shake && "shake")}>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={hintsOn ? gate.placeholder : "your answer"}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={promptFor(gate.kind, gate.prompt, hintsOn)}
          />
          <Button type="submit" variant="oxblood" className="sm:min-w-36">
            Unlock
          </Button>
        </div>
        {tries > 0 && !showHint ? (
          <p className="font-sans text-base font-bold text-margin" role="alert">
            Look at the line you just wrote.
          </p>
        ) : null}
        {hintsOn && showHint && hint ? <Hint text={hint} /> : null}
      </form>
    );
  }

  if (gate.kind === "multi") {
    const submit = (e: FormEvent) => {
      e.preventDefault();
      const ok = gate.fields.every((field) =>
        numberMatches(values[field.id] ?? "", field.expect, field.tol),
      );
      if (ok) onPass();
      else fail();
    };
    return (
      <form onSubmit={submit} className="space-y-3">
        <p className="font-sans text-lg font-bold text-ink">
          {promptFor("multi", gate.prompt, hintsOn)}
        </p>
        <div className={cn("grid gap-2 sm:grid-cols-3", shake && "shake")}>
          {gate.fields.map((field, i) => (
            <label key={field.id} className="grid gap-1">
              <span className="font-sans text-base font-bold text-ink">
                {field.label}
                {field.unit === "°" ? " (degrees)" : ""}
              </span>
              <Input
                ref={i === 0 ? inputRef : undefined}
                value={values[field.id] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                placeholder={hintsOn ? field.placeholder : "your answer"}
                inputMode="decimal"
                autoComplete="off"
              />
            </label>
          ))}
        </div>
        <Button type="submit" variant="oxblood" className="w-full">
          Check my paper
        </Button>
        {hintsOn && showHint && hint ? <Hint text={hint} /> : null}
      </form>
    );
  }

  return null;
}

function Hint({ text }: { text: string }) {
  return (
    <p className="flex gap-2 rounded-[var(--radius-md)] border-2 border-ink bg-paper-dark px-3 py-2 font-sans text-base text-ink" role="status">
      <Lightbulb className="mt-0.5 size-5 shrink-0 text-ink" />
      <span>{text}</span>
    </p>
  );
}

export function labelsMatch(got: Partial<Record<"a" | "b" | "c", Tag>>, want: Record<"a" | "b" | "c", Tag>) {
  return got.a === want.a && got.b === want.b && got.c === want.c;
}
