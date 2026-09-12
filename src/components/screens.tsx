import { Calculator, Check, NotebookPen, Pencil, RotateCcw } from "lucide-react";
import { STEPS } from "@/data/lesson";
import { useLesson } from "@/store/lesson";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Landing() {
  const start = useLesson((s) => s.start);
  const stepIndex = useLesson((s) => s.stepIndex);
  const reset = useLesson((s) => s.reset);
  const canResume = stepIndex > 0;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="mb-3 font-sans text-base font-bold text-ink">Saxon Algebra 2</p>
      <h1 className="font-display text-5xl font-bold text-ink sm:text-6xl">Graphite</h1>
      <p className="mt-3 font-sans text-xl font-medium text-ink">
        Lesson 44 — Solving Right Triangles
      </p>
      <p className="mt-6 max-w-prose font-sans text-lg leading-[1.6] text-ink">
        Not a video you half-watch. Write each move on paper. Type a piece of it. Unlock the next
        one. Paper is extra working memory.
      </p>
      <ul className="mt-8 space-y-3 font-sans text-lg text-ink">
        <li className="flex gap-3">
          <span className="w-8 shrink-0 font-bold">1.</span> About 25 minutes. One page.
        </li>
        <li className="flex gap-3">
          <span className="w-8 shrink-0 font-bold">2.</span> Calculator locked to DEG.
        </li>
        <li className="flex gap-3">
          <span className="w-8 shrink-0 font-bold">3.</span> No skip. The page has to exist.
        </li>
      </ul>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button variant="cream" size="lg" className="flex-1" onClick={start}>
          {canResume ? "Continue" : "Get paper"}
        </Button>
        {canResume ? (
          <Button variant="outline" size="lg" onClick={reset}>
            <RotateCcw />
            Start over
          </Button>
        ) : null}
      </div>
    </main>
  );
}

const KIT = [
  {
    key: "paper" as const,
    icon: NotebookPen,
    title: "Notebook or blank paper",
    detail: "On the desk. One fresh page.",
  },
  {
    key: "pencil" as const,
    icon: Pencil,
    title: "Pencil",
    detail: "You are drawing triangles.",
  },
  {
    key: "calc" as const,
    icon: Calculator,
    title: "Calculator in DEG",
    detail: "If it says RAD, switch it.",
  },
];

export function KitScreen() {
  const kit = useLesson((s) => s.kit);
  const setKit = useLesson((s) => s.setKit);
  const confirmDesk = useLesson((s) => s.confirmDesk);
  const ready = kit.paper && kit.pencil && kit.calc;

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="mb-2 font-sans text-base font-bold text-ink">Before you start</p>
      <h1 className="font-display text-4xl font-bold text-ink">Three things. On the desk.</h1>
      <p className="mt-3 font-sans text-lg leading-[1.6] text-ink">
        Tap each when it is actually there. Do not fake it.
      </p>
      <ul className="mt-8 space-y-3">
        {KIT.map((item) => {
          const on = kit[item.key];
          const Icon = item.icon;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => setKit({ [item.key]: !on })}
                className={cn(
                  "flex w-full items-start gap-4 rounded-[var(--radius-lg)] border-2 px-4 py-4 text-left",
                  on
                    ? "border-ink bg-ink text-paper"
                    : "border-ink bg-paper text-ink hover:bg-paper-dark",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-2",
                    on ? "border-paper bg-paper text-ink" : "border-ink bg-paper-dark text-ink",
                  )}
                >
                  {on ? <Check className="size-6" /> : <Icon className="size-6" />}
                </span>
                <span>
                  <span className="block font-sans text-lg font-bold">{item.title}</span>
                  <span className="mt-1 block font-sans text-base leading-[1.5]">{item.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="cream"
        size="lg"
        className="mt-8 w-full"
        disabled={!ready}
        onClick={confirmDesk}
      >
        Open the lesson
      </Button>
    </main>
  );
}

export function DoneScreen() {
  const notes = useLesson((s) => s.notes);
  const reset = useLesson((s) => s.reset);
  const goTo = useLesson((s) => s.goTo);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="mb-2 font-sans text-base font-bold text-ink">Lesson 44</p>
      <h1 className="font-display text-4xl font-bold text-ink">The page is the product.</h1>
      <p className="mt-4 font-sans text-lg leading-[1.6] text-ink">
        You have a one-page machine for any right triangle. Keep it open for the book practice. If a
        problem stalls, copy the six-step box onto it and run the list.
      </p>
      <section className="mt-8 overflow-hidden rounded-[var(--radius-xl)] border-2 border-ink bg-paper text-ink">
        <div className="border-b-2 border-ink px-5 py-3">
          <p className="font-sans text-base font-bold text-ink">On your page</p>
        </div>
        <ol className="max-h-[50vh] space-y-4 overflow-auto px-5 py-5 sm:px-8">
          {notes.map((block, i) => (
            <li key={block.id}>
              <p className="font-sans text-sm font-bold text-ink">
                {i + 1}. {STEPS.find((s) => s.id === block.id)?.kicker}
              </p>
              {block.lines.slice(0, 3).map((line) => (
                <p key={line} className="font-mono text-base leading-7 text-ink">
                  {line}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </section>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="cream" size="lg" className="flex-1" onClick={() => goTo(0)}>
          Run it again
        </Button>
        <Button variant="outline" size="lg" onClick={reset}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </main>
  );
}
