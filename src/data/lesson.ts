export type SideId = "a" | "b" | "c";
export type AngleId = "A" | "B" | "C";
export type Tag = "opp" | "adj" | "hyp";

export type Figure = {
  angleA?: string;
  angleB?: string;
  angleC?: string;
  sideA?: string;
  sideB?: string;
  sideC?: string;
  tags?: Partial<Record<SideId, Tag | string>>;
  highlight?: SideId | AngleId;
  unknown?: Array<SideId | AngleId>;
};

export type Gate =
  | { kind: "phrase"; expect: string[]; placeholder: string; prompt: string }
  | { kind: "number"; expect: number; tol?: number; unit?: "°" | ""; placeholder: string; prompt: string }
  | {
      kind: "multi";
      prompt: string;
      fields: Array<{
        id: string;
        label: string;
        expect: number;
        tol?: number;
        unit?: "°" | "";
        placeholder: string;
      }>;
    }
  | { kind: "label"; refAngle: AngleId; mapping: Record<SideId, Tag>; prompt: string }
  | { kind: "continue"; label: string };

export type LessonStep = {
  id: string;
  phase: string;
  kicker: string;
  coach: string[];
  write?: { heading: string; lines: string[]; spoilers?: string[] };
  figure?: Figure;
  calc?: boolean;
  hint?: string;
  gate: Gate;
};

export const PHASES = [
  "Desk",
  "The job",
  "Tools",
  "Labels",
  "The method",
  "Worked triangle",
  "Inverse",
  "Your turn",
] as const;

export const STEPS: LessonStep[] = [
  {
    id: "header",
    phase: "Desk",
    kicker: "Page title",
    coach: [
      "Fresh page. Top line only. Do not start working problems yet.",
      "Writing the title is not busywork. It tells your brain this page has a job.",
    ],
    write: {
      heading: "Write this at the top",
      lines: ["Lesson 44", "Solving Right Triangles", "Saxon Algebra 2"],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: Solving Right Triangles",
      placeholder: "Solving Right Triangles",
      expect: ["Solving Right Triangles", "solving right triangles"],
    },
  },
  {
    id: "job",
    phase: "The job",
    kicker: "What “solve” means",
    coach: [
      "In this lesson, “solve the right triangle” is a complete job, not a single missing number.",
      "You find every missing side and every missing angle. All of them. Then you stop.",
    ],
    write: {
      heading: "Copy this definition",
      lines: [
        "Solve a right triangle =",
        "find EVERY missing side and angle.",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: side and angle",
      placeholder: "side and angle",
      expect: ["side and angle", "sides and angles", "side angle"],
    },
  },
  {
    id: "six-parts",
    phase: "The job",
    kicker: "Six parts",
    coach: [
      "A triangle has three sides and three angles. That is six numbers.",
      "In a right triangle one of those angles is already 90°. You are hunting the other five, and the book will have given you some of them.",
      "Rule: angles get one letter. Sides get two letters — the endpoints. Never name a side with the same letter as an angle.",
    ],
    figure: {
      angleA: "P",
      angleB: "Q",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "PQ",
    },
    write: {
      heading: "Write the six parts",
      lines: [
        "Angles: P, Q, 90° at R",
        "Sides: QR, PR, PQ",
        "PQ is the hypotenuse — across from 90°.",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: PQ",
      placeholder: "PQ",
      expect: ["PQ", "side PQ", "hyp PQ", "hypotenuse"],
    },
  },
  {
    id: "three-tools",
    phase: "Tools",
    kicker: "Three weapons",
    coach: [
      "You do not need a new formula every time. You rotate three tools until the triangle is full.",
      "If you have an acute angle, the other acute angle is free. If you have two sides, Pythagoras can get the third. Trig gets you from angles to sides, and inverse trig gets you from sides to angles.",
    ],
    write: {
      heading: "Box this in your notes",
      lines: [
        "1. Acute angles add to 90°",
        "2. SOH CAH TOA, then inverses (sin^-1, cos^-1, tan^-1)",
        "3. leg² + leg² = hyp²",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: 90",
      placeholder: "90",
      expect: ["90", "90 degrees", "90°"],
    },
  },
  {
    id: "sohcahtoa",
    phase: "Tools",
    kicker: "SOH CAH TOA, written out",
    coach: [
      "Each word is a fraction. The angle you stand on picks which sides are opposite and adjacent. Hypotenuse is always the long side, across from 90°.",
      "Sine uses the side across from the angle. Cosine uses the side next to the angle. Tangent uses those two legs and ignores the hypotenuse.",
    ],
    write: {
      heading: "Write this twice. Full words.",
      lines: [
        "SOH  Sine = Opposite / Hypotenuse",
        "      sin θ = opp / hyp",
        "CAH  Cosine = Adjacent / Hypotenuse",
        "      cos θ = adj / hyp",
        "TOA  Tangent = Opposite / Adjacent",
        "      tan θ = opp / adj",
        "You know the angle. You want a side. Use these.",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: SOH CAH TOA",
      placeholder: "SOH CAH TOA",
      expect: ["SOH CAH TOA", "sohcahtoa", "soh cah toa"],
    },
  },
  {
    id: "label-hyp",
    phase: "Labels",
    kicker: "Always start with hyp",
    coach: [
      "Labels are from the angle you are standing on. Change the angle, and opposite/adjacent swap. Hypotenuse never swaps.",
      "hyp is the longest side, always across from the right angle. Find it first so you cannot mix it up.",
    ],
    figure: {
      angleA: "θ",
      angleB: " ",
      angleC: "90°",
      tags: { c: "hyp" },
      highlight: "c",
    },
    write: {
      heading: "Write this rule",
      lines: [
        "hyp = hypotenuse = across from 90°.",
        "Label hyp first. Always.",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: 90",
      placeholder: "90",
      expect: ["90", "90 degrees", "the right angle", "right angle", "90°"],
    },
  },
  {
    id: "label-drill",
    phase: "Labels",
    kicker: "Tap to label",
    coach: [
      "Stand on P. Opposite does not touch P. Adjacent does. Hypotenuse is the long side across from 90°.",
      "Left column is the cheat sheet. Right is the triangle. Pick a stamp, then tap one side.",
    ],
    figure: {
      angleA: "P",
      angleB: "Q",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "PQ",
      highlight: "A",
    },
    write: {
      heading: "On your sketch, mark",
      lines: [
        "From angle P:",
        "QR is opposite",
        "PR is adjacent",
        "PQ is hypotenuse",
      ],
    },
    hint: "Opposite does not touch the angle. Adjacent does. Hypotenuse is across from 90°.",
    gate: {
      kind: "label",
      refAngle: "A",
      mapping: { a: "opp", b: "adj", c: "hyp" },
      prompt: "Stamp opp on QR, adj on PR, hyp on PQ.",
    },
  },
  {
    id: "method",
    phase: "The method",
    kicker: "The recipe you will reuse",
    coach: [
      "This is the whole lesson, boxed. Every example is just this list with numbers in it.",
      "Leave space under it. You will glance back here for the rest of the page.",
    ],
    write: {
      heading: "Copy the six steps. Box them.",
      lines: [
        "1. Sketch. Mark 90°. Fill in knowns.",
        "2. Other acute angle = 90° − the one you have.",
        "3. Pick a reference angle (the acute one you know).",
        "4. From that angle, label opp, adj, hyp.",
        "5. Pick sine, cosine, or tangent using a known side and the unknown side.",
        "6. Write the equation. Solve. Sides to 3 decimals. Check with leg² + leg² = hyp².",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: opp adj hyp",
      placeholder: "opp adj hyp",
      expect: ["opp adj hyp", "oah", "opp, adj, hyp", "opposite adjacent hypotenuse"],
    },
  },
  {
    id: "ex-knowns",
    phase: "Worked triangle",
    kicker: "Example — write the knowns",
    coach: [
      "Right triangle PQR. Right angle at R. Angle P is 32°. Hypotenuse PQ is 20.",
      "Before any calculator: copy the sketch and list what you know. If you skip this, you will grab the wrong side.",
    ],
    figure: {
      angleA: "32°",
      angleB: "Q",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      unknown: ["B", "a", "b"],
    },
    write: {
      heading: "Write the given",
      lines: [
        "△PQR, right angle at R",
        "∠P = 32°",
        "hyp PQ = 20",
        "Find: ∠Q, QR, PR",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: 20",
      placeholder: "20",
      expect: ["20"],
    },
  },
  {
    id: "ex-angle",
    phase: "Worked triangle",
    kicker: "Step 2 — free angle",
    coach: [
      "You already have 90° and 32°. The leftover acute angle is not a trig problem. It is subtraction.",
      "In a right triangle the two acute angles are complements. Write the line, then the number.",
    ],
    figure: {
      angleA: "32°",
      angleB: "?",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      highlight: "B",
      unknown: ["B"],
    },
    write: {
      heading: "Write both lines",
      lines: ["∠Q = 90° − 32°"],
      spoilers: ["∠Q = 58°"],
    },
    hint: "The two acute angles add to 90, so the missing one is 90 minus 32.",
    gate: {
      kind: "number",
      prompt: "Type: 58",
      placeholder: "58",
      expect: 58,
      tol: 0.2,
      unit: "°",
    },
  },
  {
    id: "ex-oah",
    phase: "Worked triangle",
    kicker: "Label from 32°",
    coach: [
      "Stand on the 32° corner only. The sketch already has the three names. Copy them onto paper — you do not have to stamp this time.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
      highlight: "A",
    },
    write: {
      heading: "Copy these three",
      lines: [
        "opp = QR   (across from 32°)",
        "adj = PR   (bottom, next to 32°)",
        "hyp = 20   (the long side)",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: adj",
      placeholder: "adj",
      expect: ["adj", "adjacent"],
    },
  },
  {
    id: "ex-sine-setup",
    phase: "Worked triangle",
    kicker: "You want QR",
    coach: [
      "Stop. You are not solving the whole triangle at once. You are finding one side: QR.",
      "From 32°, QR is opposite. The side you already know is 20 — the hypotenuse. Opposite and hypotenuse is the S in SOH. That word is sine.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", c: "hyp" },
      highlight: "a",
    },
    write: {
      heading: "Copy this, nothing else",
      lines: [
        "Need: QR  (opp)",
        "Have: 20  (hyp)",
        "SOH → use sine",
      ],
    },
    hint: "Sine is the one that uses opposite and hypotenuse.",
    gate: {
      kind: "phrase",
      prompt: "Type: sine",
      placeholder: "sine",
      expect: ["sine", "sin", "soh", "use sine"],
    },
  },
  {
    id: "ex-sine-frac",
    phase: "Worked triangle",
    kicker: "Sine is a fraction",
    coach: [
      "Sine of an angle is just a nickname for opposite ÷ hypotenuse. That is the whole definition.",
      "Do not calculate. Replace the words with the names on your sketch: opposite is QR, hypotenuse is 20.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", c: "hyp" },
      highlight: "a",
    },
    write: {
      heading: "Write one line. Stop.",
      lines: ["sin 32° = QR / 20"],
    },
    hint: "Left side is the angle. Right side is opp over hyp.",
    gate: {
      kind: "phrase",
      prompt: "Type: QR / 20",
      placeholder: "QR / 20",
      expect: ["QR / 20", "QR/20", "sin 32 = QR / 20", "sin32=QR/20", "sin 32 QR/20"],
    },
  },
  {
    id: "ex-sine-free",
    phase: "Worked triangle",
    kicker: "Get QR by itself",
    coach: [
      "QR is sitting under a 20. That means QR is being divided by 20.",
      "To cancel a divide-by-20, multiply both sides by 20. The 20 on the bottom disappears. QR stands alone.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", c: "hyp" },
      highlight: "a",
    },
    write: {
      heading: "Write the jump",
      lines: [
        "sin 32° = QR / 20",
        "QR = 20 × sin 32°",
      ],
    },
    hint: "The 20 jumps from the bottom of the fraction to the front of sine.",
    gate: {
      kind: "phrase",
      prompt: "Type: 20 × sin 32",
      placeholder: "20 × sin 32",
      expect: ["20 × sin 32", "20 * sin 32", "20 x sin 32", "20 sin 32", "QR = 20 × sin 32", "20 sin32"],
    },
  },
  {
    id: "ex-sine-calc",
    phase: "Worked triangle",
    kicker: "Punch QR",
    coach: [
      "DEGREE mode. Punch the line you just wrote: 20 × sin 32.",
      "If you get about 0.53, you forgot the 20. Round the side to three decimal places.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", c: "hyp" },
      highlight: "a",
    },
    calc: true,
    write: {
      heading: "Write the result",
      lines: ["QR = 20 × sin 32°"],
      spoilers: ["QR = 10.598"],
    },
    hint: "sin 32° ≈ 0.5299, times 20. Three decimal places.",
    gate: {
      kind: "number",
      prompt: "Type: 10.598",
      placeholder: "10.598",
      expect: 10.598,
      tol: 0.02,
      unit: "",
    },
  },
  {
    id: "ex-cosine-setup",
    phase: "Worked triangle",
    kicker: "You want PR",
    coach: [
      "Same machine, different side. PR sits next to 32°, so it is adjacent. You still know the hypotenuse 20.",
      "Adjacent and hypotenuse is the C in CAH. That word is cosine.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR = 10.598",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
      highlight: "b",
    },
    write: {
      heading: "Copy this, nothing else",
      lines: [
        "Need: PR  (adj)",
        "Have: 20  (hyp)",
        "CAH → use cosine",
      ],
    },
    hint: "Cosine is the one that uses adjacent and hypotenuse.",
    gate: {
      kind: "phrase",
      prompt: "Type: cosine",
      placeholder: "cosine",
      expect: ["cosine", "cos", "cah", "use cosine"],
    },
  },
  {
    id: "ex-cosine-frac",
    phase: "Worked triangle",
    kicker: "Cosine is a fraction",
    coach: [
      "Same move as sine. Cosine of the angle equals adjacent ÷ hypotenuse.",
      "Plug in the names. Do not calculate yet.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR = 10.598",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
      highlight: "b",
    },
    write: {
      heading: "Write one line. Stop.",
      lines: ["cos 32° = PR / 20"],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: PR / 20",
      placeholder: "PR / 20",
      expect: ["PR / 20", "PR/20", "cos 32 = PR / 20", "cos32=PR/20", "cos 32 PR/20"],
    },
  },
  {
    id: "ex-cosine-free",
    phase: "Worked triangle",
    kicker: "Get PR by itself",
    coach: [
      "PR is under 20, so multiply both sides by 20. PR stands alone.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR = 10.598",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
      highlight: "b",
    },
    write: {
      heading: "Write the jump",
      lines: [
        "cos 32° = PR / 20",
        "PR = 20 × cos 32°",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: 20 × cos 32",
      placeholder: "20 × cos 32",
      expect: ["20 × cos 32", "20 * cos 32", "20 x cos 32", "20 cos 32", "PR = 20 × cos 32", "20 cos32"],
    },
  },
  {
    id: "ex-cosine-calc",
    phase: "Worked triangle",
    kicker: "Punch PR",
    coach: [
      "DEGREE mode. Punch 20 × cos 32. Round to three decimal places.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR = 10.598",
      sideB: "PR",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
      highlight: "b",
    },
    calc: true,
    write: {
      heading: "Write the result",
      lines: ["PR = 20 × cos 32°"],
      spoilers: ["PR = 16.961"],
    },
    hint: "cos 32° ≈ 0.8480, times 20.",
    gate: {
      kind: "number",
      prompt: "Type: 16.961",
      placeholder: "16.961",
      expect: 16.961,
      tol: 0.02,
      unit: "",
    },
  },
  {
    id: "ex-check",
    phase: "Worked triangle",
    kicker: "Pythagoras as a lie detector",
    coach: [
      "If trig was set up on the wrong sides, Pythagoras will not close. That is the point of the check.",
      "You want QR² + PR² close to 20² = 400. Rounding will be a hair off. Close is the win.",
    ],
    figure: {
      angleA: "32°",
      angleB: "58°",
      angleC: "90°",
      sideA: "QR = 10.598",
      sideB: "PR = 16.961",
      sideC: "20",
      tags: { a: "opp", b: "adj", c: "hyp" },
    },
    write: {
      heading: "Write the check",
      lines: ["10.598² + 16.961² ≟ 20²"],
      spoilers: ["112.318 + 287.676 = 399.994", "≈ 400. Check passes."],
    },
    hint: "Add the two squares. You want something extremely close to 400.",
    gate: {
      kind: "number",
      prompt: "Type: 400",
      placeholder: "400",
      expect: 400,
      tol: 1,
      unit: "",
    },
  },
  {
    id: "inv-why",
    phase: "Inverse",
    kicker: "Inverses — the other direction",
    coach: [
      "SOH CAH TOA goes angle → side. Inverse trig goes side → angle. Same three fractions, solved for the angle instead of the side.",
      "If sin θ = n, then θ is the angle whose sine is n. On the calculator that button is sin^-1 (also called arcsin). Same idea for cos^-1 and tan^-1. DEGREE mode.",
    ],
    write: {
      heading: "Write both directions",
      lines: [
        "FORWARD  (know the angle, want a side)",
        "sin θ = opp / hyp    →    side = hyp × sin θ",
        "cos θ = adj / hyp    →    side = hyp × cos θ",
        "tan θ = opp / adj    →    side = adj × tan θ",
        "INVERSE  (know two sides, want the angle)",
        "If sin θ = n,  then θ = sin^-1(n)   angle whose sine is n",
        "If cos θ = n,  then θ = cos^-1(n)   angle whose cosine is n",
        "If tan θ = n,  then θ = tan^-1(n)   angle whose tangent is n",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: tan^-1",
      placeholder: "tan^-1",
      expect: ["tan^-1", "tan-1", "arctan", "tan inverse", "inv tan", "tan 1"],
    },
  },
  {
    id: "inv-setup",
    phase: "Inverse",
    kicker: "Example — two legs",
    coach: [
      "Right triangle XYZ, right angle at Z. XZ = 8, YZ = 15. Find angle X, angle Y, and hypotenuse XY.",
      "You have both legs, so tangent is the cleanest path to the angle: opposite over adjacent. No hypotenuse required yet.",
    ],
    figure: {
      angleA: "X",
      angleB: "Y",
      angleC: "90°",
      sideA: "YZ = 15",
      sideB: "XZ = 8",
      sideC: "XY",
      unknown: ["A", "B", "c"],
      tags: { a: "opp", b: "adj" },
    },
    write: {
      heading: "From angle X, write",
      lines: [
        "opp = 15, adj = 8",
        "tan X = 15 / 8",
        "X = tan^-1(15/8)",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: tan^-1(15/8)",
      placeholder: "tan^-1(15/8)",
      expect: [
        "tan^-1(15/8)",
        "tan-1(15/8)",
        "arctan(15/8)",
        "tan^-1 15/8",
        "tan-1 15/8",
        "inv tan 15/8",
      ],
    },
  },
  {
    id: "inv-calc",
    phase: "Inverse",
    kicker: "Finish the triangle",
    coach: [
      "Punch tan^-1(15/8). Write the angle to three decimals, then the complement, then the hypotenuse with Pythagoras — this one is a clean integer.",
      "15-8-17 is a scaled 8-15-17 triple. Nice when a check comes out exact.",
    ],
    figure: {
      angleA: "X",
      angleB: "Y",
      angleC: "90°",
      sideA: "YZ = 15",
      sideB: "XZ = 8",
      sideC: "XY",
    },
    calc: true,
    write: {
      heading: "Write all three",
      lines: ["X = tan^-1(15/8)", "Y = 90° − X", "XY = √(8² + 15²)"],
      spoilers: ["X = 61.928°", "Y = 28.072°", "XY = 17"],
    },
    hint: "tan^-1(1.875) ≈ 61.928°. The other acute is 90 minus that. Hypotenuse is 17.",
    gate: {
      kind: "multi",
      prompt: "Enter the three missing parts from your paper.",
      fields: [
        { id: "X", label: "Angle X", expect: 61.928, tol: 0.15, unit: "°", placeholder: "61.928" },
        { id: "Y", label: "Angle Y", expect: 28.072, tol: 0.15, unit: "°", placeholder: "28.072" },
        { id: "c", label: "Hypotenuse XY", expect: 17, tol: 0.05, unit: "", placeholder: "17" },
      ],
    },
  },
  {
    id: "solo-1",
    phase: "Your turn",
    kicker: "Full solve — no peeking ahead",
    coach: [
      "Do this one on paper using the six-step box. Then type the three answers.",
      "Right triangle DEF, right angle at F. Angle D = 41°. Hypotenuse DE = 12. Find angle E, side EF, and side DF.",
    ],
    figure: {
      angleA: "41°",
      angleB: "E",
      angleC: "90°",
      sideA: "EF",
      sideB: "DF",
      sideC: "12",
      unknown: ["B", "a", "b"],
    },
    calc: true,
    write: {
      heading: "On paper, run the method",
      lines: [
        "E = 90 − 41",
        "EF = 12 × sin 41°   (opp / hyp)",
        "DF = 12 × cos 41°   (adj / hyp)",
        "Round sides to 3 decimals.",
      ],
    },
    hint: "Angle E is 49°. Sine for EF (opposite 41°), cosine for DF (adjacent). Both times 12.",
    gate: {
      kind: "multi",
      prompt: "From your page: angle E, side EF, side DF.",
      fields: [
        { id: "E", label: "Angle E", expect: 49, tol: 0.2, unit: "°", placeholder: "49" },
        { id: "EF", label: "Side EF (opp 41°)", expect: 7.873, tol: 0.03, unit: "", placeholder: "7.873" },
        { id: "DF", label: "Side DF (adj 41°)", expect: 9.057, tol: 0.03, unit: "", placeholder: "9.057" },
      ],
    },
  },
  {
    id: "solo-2",
    phase: "Your turn",
    kicker: "Two legs, you find the rest",
    coach: [
      "Last problem. Legs 7 and 24, right angle between them. Find the hypotenuse and both acute angles.",
      "Pythagoras first (this one is a triple). Then inverse sine or inverse tangent for one angle, subtract from 90 for the other.",
    ],
    figure: {
      angleA: "θ",
      angleB: " ",
      angleC: "90°",
      sideA: "7",
      sideB: "24",
      sideC: "h",
      unknown: ["A", "B", "c"],
    },
    calc: true,
    write: {
      heading: "Write the path",
      lines: [
        "h = √(7² + 24²)",
        "θ = tan^-1(7/24)   or   sin^-1(7/h)",
        "other angle = 90° − θ",
      ],
    },
    hint: "7-24-25 is a Pythagorean triple. θ ≈ 16.260°. The other angle is about 73.740°.",
    gate: {
      kind: "multi",
      prompt: "Hypotenuse, the small angle opposite 7, then the other acute angle.",
      fields: [
        { id: "h", label: "Hypotenuse h", expect: 25, tol: 0.05, unit: "", placeholder: "25" },
        { id: "th", label: "Angle opposite 7", expect: 16.26, tol: 0.2, unit: "°", placeholder: "16.260" },
        { id: "ph", label: "Other acute angle", expect: 73.74, tol: 0.2, unit: "°", placeholder: "73.740" },
      ],
    },
  },
  {
    id: "close",
    phase: "Your turn",
    kicker: "What lives on the page",
    coach: [
      "You do not need to memorize twenty examples. You need the boxed method, the three fractions, and the inverse switch.",
      "Keep this page open while you do the Lesson 44 practice in the book. Copy the six steps onto any problem that stalls.",
    ],
    write: {
      heading: "Underline these on your page",
      lines: [
        "Solve = find every missing side and angle.",
        "Acute angles add to 90°.",
        "SOH  Sine = Opposite / Hypotenuse     sin θ = opp / hyp",
        "CAH  Cosine = Adjacent / Hypotenuse   cos θ = adj / hyp",
        "TOA  Tangent = Opposite / Adjacent    tan θ = opp / adj",
        "Know the angle, want a side  →  sin, cos, tan",
        "Know two sides, want the angle  →  sin^-1, cos^-1, tan^-1",
        "DEGREE mode. Sides to 3 decimals.",
        "Check with leg² + leg² = hyp².",
      ],
    },
    gate: {
      kind: "phrase",
      prompt: "Type: degree",
      placeholder: "degree",
      expect: ["degree", "degrees", "deg", "DEGREE"],
    },
  },
];
