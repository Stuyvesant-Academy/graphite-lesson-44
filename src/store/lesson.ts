import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STEPS } from "@/data/lesson";

export type Kit = {
  paper: boolean;
  pencil: boolean;
  calc: boolean;
};

type LessonState = {
  started: boolean;
  deskReady: boolean;
  kit: Kit;
  stepIndex: number;
  seen: string[];
  notes: Array<{ id: string; lines: string[] }>;
  hintsOn: boolean;
  start: () => void;
  setKit: (patch: Partial<Kit>) => void;
  confirmDesk: () => void;
  completeCurrent: () => void;
  goTo: (index: number) => void;
  back: () => void;
  reset: () => void;
  setHintsOn: (value: boolean) => void;
};

const emptyKit: Kit = { paper: false, pencil: false, calc: false };

export const useLesson = create<LessonState>()(
  persist(
    (set, get) => ({
      started: false,
      deskReady: false,
      kit: emptyKit,
      stepIndex: 0,
      seen: [],
      notes: [],
      hintsOn: true,
      start: () => set({ started: true }),
      setKit: (patch) => set({ kit: { ...get().kit, ...patch } }),
      confirmDesk: () => set({ deskReady: true }),
      completeCurrent: () => {
        const { stepIndex, notes, seen } = get();
        const step = STEPS[stepIndex];
        if (!step) return;
        const nextNotes = notes.some((n) => n.id === step.id)
          ? notes
          : step.write
            ? [...notes, { id: step.id, lines: step.write.lines }]
            : notes;
        const nextSeen = seen.includes(step.id) ? seen : [...seen, step.id];
        set({
          stepIndex: Math.min(stepIndex + 1, STEPS.length),
          notes: nextNotes,
          seen: nextSeen,
        });
      },
      goTo: (index) => {
        const clamped = Math.max(0, Math.min(index, STEPS.length));
        set({ stepIndex: clamped });
      },
      back: () => set({ stepIndex: Math.max(0, get().stepIndex - 1) }),
      setHintsOn: (value) => set({ hintsOn: value }),
      reset: () =>
        set({
          started: false,
          deskReady: false,
          kit: emptyKit,
          stepIndex: 0,
          seen: [],
          notes: [],
        }),
    }),
    { name: "graphite-l44" },
  ),
);
