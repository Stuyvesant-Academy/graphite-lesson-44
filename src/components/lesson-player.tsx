import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, Eye, EyeOff, Notebook, X } from "lucide-react";
import { STEPS, type Figure, type SideId, type Tag } from "@/data/lesson";
import { useLesson } from "@/store/lesson";
import { figureFor, writeLinesFor } from "@/lib/hints";
import { Button } from "@/components/ui/button";
import { Gate, labelsMatch } from "@/components/gate";
import { TriangleFigure } from "@/components/triangle-figure";
import { TrigCalc } from "@/components/trig-calc";
import { WriteCard } from "@/components/write-card";
import { DoneScreen, KitScreen, Landing } from "@/components/screens";
import { cn } from "@/lib/utils";

export function LessonPlayer() {
  const started = useLesson((s) => s.started);
  const deskReady = useLesson((s) => s.deskReady);
  const stepIndex = useLesson((s) => s.stepIndex);
  const completeCurrent = useLesson((s) => s.completeCurrent);
  const back = useLesson((s) => s.back);
  const hintsOn = useLesson((s) => s.hintsOn);
  const setHintsOn = useLesson((s) => s.setHintsOn);
  const [notesOpen, setNotesOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5">
        <p className="mb-3 font-sans text-base font-bold text-ink">Saxon Algebra 2</p>
        <h1 className="font-display text-5xl font-bold text-ink">Graphite</h1>
        <p className="mt-3 font-sans text-xl text-ink">Lesson 44 — Solving Right Triangles</p>
      </main>
    );
  }

  if (!started) return <Landing />;
  if (!deskReady) return <KitScreen />;
  if (stepIndex >= STEPS.length) return <DoneScreen />;

  const step = STEPS[stepIndex];
  if (!step) return <DoneScreen />;
  const total = STEPS.length;
  const progress = ((stepIndex + 1) / total) * 100;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b-2 border-ink bg-desk">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="flex size-12 items-center justify-center rounded-[var(--radius-sm)] border-2 border-ink bg-paper text-ink hover:bg-paper-dark disabled:opacity-40"
            aria-label="Previous step"
          >
            <ChevronLeft className="size-6" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate font-sans text-base font-bold text-ink">
                {step.phase}
              </p>
              <p className="font-sans text-base font-bold text-ink tabular-nums">
                Step {stepIndex + 1} of {total}
              </p>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full border border-ink bg-paper">
              <div
                className="h-full bg-ink transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHintsOn(!hintsOn)}
            className="flex h-12 items-center gap-2 rounded-[var(--radius-sm)] border-2 border-ink bg-paper px-3 text-ink hover:bg-paper-dark"
            aria-pressed={hintsOn}
            aria-label={hintsOn ? "Turn answer hints off" : "Turn answer hints on"}
          >
            {hintsOn ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
            <span className="hidden font-sans text-sm font-bold sm:inline">
              {hintsOn ? "Hints on" : "Hints off"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="flex size-12 items-center justify-center rounded-[var(--radius-sm)] border-2 border-ink bg-paper text-ink hover:bg-paper-dark"
            aria-label="Open notes"
          >
            <Notebook className="size-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-4">
        <StepBody key={step.id} onPass={completeCurrent} />
      </div>
      <NotesRail open={notesOpen} onClose={() => setNotesOpen(false)} />
    </div>
  );
}

function StepBody({ onPass }: { onPass: () => void }) {
  const stepIndex = useLesson((s) => s.stepIndex);
  const hintsOn = useLesson((s) => s.hintsOn);
  const step = STEPS[stepIndex];
  const { labels, stamp, setStamp, apply, reset } = useSideLabels();
  const [labelError, setLabelError] = useState("");

  useEffect(() => {
    reset();
    setLabelError("");
  }, [step?.id, reset]);

  if (!step) return null;
  const isLabel = step.gate.kind === "label";
  const figure = figureFor(step, hintsOn);
  const lines = writeLinesFor(step, hintsOn);

  const submitLabels = () => {
    if (step.gate.kind !== "label") return;
    if (labelsMatch(labels, step.gate.mapping)) onPass();
    else {
      setLabelError(
        hintsOn
          ? missingStampMessage(step.gate.mapping, labels, step.figure)
          : "Not yet. Check each side against the angle you are standing on.",
      );
    }
  };

  const hasFigure = Boolean(figure);

  return (
    <article className="step-enter pb-40">
      <h1 className="mb-4 font-display text-3xl font-bold text-ink">
        {step.kicker}
      </h1>
      <div
        className={cn(
          "grid gap-5",
          hasFigure && "min-[720px]:grid-cols-2 min-[720px]:items-start",
        )}
      >
        <div className="space-y-4">
          {step.coach.map((para) => (
            <p key={para} className="max-w-prose font-sans text-lg leading-[1.6] text-ink">
              {para}
            </p>
          ))}
          {step.write ? <WriteCard heading={step.write.heading} lines={lines} /> : null}
          {step.calc ? <TrigCalc /> : null}
        </div>
        {hasFigure && figure ? (
          <div className="min-[720px]:sticky min-[720px]:top-20">
            <TriangleFigure
              figure={figure}
              interactive={isLabel}
              labels={isLabel ? labels : figure.tags}
              stamp={isLabel ? stamp : undefined}
              onStampChange={isLabel ? setStamp : undefined}
              onApply={isLabel ? apply : undefined}
            />
          </div>
        ) : null}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-desk px-4 pr-20 py-3 pb-12">
        <div className="mx-auto max-w-5xl rounded-[var(--radius-lg)] border-2 border-ink bg-paper p-3">
          {isLabel && step.gate.kind === "label" ? (
            <div className="space-y-2">
              <p className="font-sans text-lg font-bold text-ink">
                {hintsOn ? step.gate.prompt : "Stamp opp, adj, and hyp. Then unlock."}
              </p>
              <Button variant="oxblood" className="w-full" onClick={submitLabels}>
                That is how I labeled it
              </Button>
              {labelError ? (
                <p className="font-sans text-base font-bold text-margin" role="alert">
                  {labelError}
                </p>
              ) : null}
            </div>
          ) : (
            <Gate gate={step.gate} hint={step.hint} hintsOn={hintsOn} onPass={onPass} />
          )}
        </div>
      </div>
    </article>
  );
}

function NotesRail({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notes = useLesson((s) => s.notes);
  const goTo = useLesson((s) => s.goTo);
  const seen = useLesson((s) => s.seen);

  return (
    <div
      className={cn("fixed inset-0 z-30", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close notes"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[75vh] overflow-auto rounded-t-[var(--radius-xl)] bg-paper p-5 text-ink transition-transform duration-200 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="font-sans text-base font-bold text-ink">Your page so far</p>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-paper-dark"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        {notes.length === 0 ? (
          <p className="font-sans text-sm text-muted">Empty until you write a block.</p>
        ) : (
          <ol className="space-y-3">
            {notes.map((block, i) => {
              const idx = STEPS.findIndex((s) => s.id === block.id);
              const canJump = idx >= 0 && seen.includes(block.id);
              return (
                <li key={block.id}>
                  <button
                    type="button"
                    disabled={!canJump}
                    onClick={() => {
                      if (canJump) goTo(idx);
                      onClose();
                    }}
                    className="w-full text-left"
                  >
                    <p className="font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")} · {STEPS[idx]?.kicker}
                    </p>
                    <p className="font-sans text-sm">{block.lines[0]}</p>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function missingStampMessage(
  want: Record<SideId, Tag>,
  got: Partial<Record<SideId, Tag>>,
  figure?: Figure,
): string {
  const names: Record<SideId, string> = {
    a: figure?.sideA || "the left side",
    b: figure?.sideB || "the bottom side",
    c: figure?.sideC || "the long side",
  };
  const misses = (["a", "b", "c"] as SideId[])
    .filter((side) => got[side] !== want[side])
    .map((side) => `${names[side]} needs ${want[side]}`);
  if (misses.length === 0) return "Check the stamps and try again.";
  return `Keep your stamps. ${misses.join(". ")}.`;
}

function useSideLabels() {
  const [stamp, setStamp] = useState<Tag>("opp");
  const [labels, setLabels] = useState<Partial<Record<SideId, Tag>>>({});
  const apply = useCallback(
    (side: SideId) => {
      setLabels((prev) => {
        const next: Partial<Record<SideId, Tag>> = { ...prev };
        (["a", "b", "c"] as SideId[]).forEach((key) => {
          if (next[key] === stamp) delete next[key];
        });
        if (prev[side] !== stamp) next[side] = stamp;
        return next;
      });
    },
    [stamp],
  );
  const reset = useCallback(() => setLabels({}), []);
  return { labels, stamp, setStamp, apply, reset };
}
