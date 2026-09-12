import type { Figure, LessonStep } from "@/data/lesson";

function blankSpoiler(line: string): string {
  if (line.includes("=")) return line.replace(/=\s*.+$/, "= ______");
  return line.replace(/[\d.]+/g, "______");
}

export function writeLinesFor(step: LessonStep, hintsOn: boolean): string[] {
  const write = step.write;
  if (!write) return [];
  if (!write.spoilers?.length) return write.lines;
  if (hintsOn) return [...write.lines, ...write.spoilers];
  return [...write.lines, ...write.spoilers.map(blankSpoiler)];
}

export function figureFor(step: LessonStep, hintsOn: boolean): Figure | undefined {
  const figure = step.figure;
  if (!figure || hintsOn) return figure;
  const strip = (value?: string) => value?.replace(/\s*=\s*[\d.]+$/, "") ?? value;
  return {
    ...figure,
    sideA: strip(figure.sideA),
    sideB: strip(figure.sideB),
    sideC: strip(figure.sideC),
  };
}

export function promptFor(kind: "phrase" | "number" | "multi", prompt: string, hintsOn: boolean): string {
  if (hintsOn) return prompt;
  if (kind === "number") return "Type the number from your paper.";
  if (kind === "phrase") return "Type what you wrote.";
  return prompt;
}
