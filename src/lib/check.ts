export function normalizePhrase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[°]/g, "")
    .replace(/(\d)\s*[×⋅·*x]\s*/gi, "$1")
    .replace(/[×⋅·*]/g, "")
    .replace(/[^a-z0-9/^-]/g, "");
}

export function phraseMatches(input: string, expected: string[]): boolean {
  const got = normalizePhrase(input);
  if (!got) return false;
  return expected.some((candidate) => normalizePhrase(candidate) === got);
}

export function parseNumber(input: string): number | null {
  const cleaned = input.replace(/[°\s,]/g, "").replace(/degrees?/i, "");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function numberMatches(input: string, expected: number, tol = 0.05): boolean {
  const value = parseNumber(input);
  if (value === null) return false;
  return Math.abs(value - expected) <= tol;
}

export function degSin(degrees: number): number {
  return Math.sin((degrees * Math.PI) / 180);
}
export function degCos(degrees: number): number {
  return Math.cos((degrees * Math.PI) / 180);
}
export function degTan(degrees: number): number {
  return Math.tan((degrees * Math.PI) / 180);
}
export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

const FN_NAMES = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "sqrt"]);

function rewriteExpr(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/°/g, "")
    .replace(/sin\s*\^\s*-?\s*1|sin-1|arcsin/g, "asin")
    .replace(/cos\s*\^\s*-?\s*1|cos-1|arccos/g, "acos")
    .replace(/tan\s*\^\s*-?\s*1|tan-1|arctan/g, "atan")
    .replace(/[×⋅·∗]/g, "*")
    .replace(/÷/g, "/")
    .replace(/(\d)\s*x\s*/g, "$1*")
    .replace(/\bx\b/g, "*");
}

function tokenize(src: string): string[] {
  const tokens: string[] = [];
  const re = /asin|acos|atan|sin|cos|tan|sqrt|pi|\d+\.?\d*|[+\-*/^()]/g;
  const cleaned = src.replace(/[^a-z0-9+\-*/^().]/g, " ");
  let match: RegExpExecArray | null;
  while ((match = re.exec(cleaned))) tokens.push(match[0]);
  const out: string[] = [];
  const isValueEnd = (t: string) => /^(?:\d+\.?\d*|pi|\))$/.test(t);
  const isValueStart = (t: string) =>
    /^(?:\d+\.?\d*|pi|\(|sin|cos|tan|asin|acos|atan|sqrt)$/.test(t);
  for (const cur of tokens) {
    const prev = out[out.length - 1];
    if (prev && isValueEnd(prev) && isValueStart(cur)) out.push("*");
    out.push(cur);
  }
  return out;
}

export function evalDegExpr(raw: string): number | null {
  const src = rewriteExpr(raw);
  if (!src) return null;
  const tokens = tokenize(src);
  if (tokens.length === 0) return null;
  let i = 0;

  const peek = () => tokens[i];
  const eat = (t?: string) => {
    if (t !== undefined && tokens[i] !== t) return false;
    i += 1;
    return true;
  };

  const parseExpr = (): number => parseTermRest(parseTerm());
  const parseTermRest = (left: number): number => {
    if (peek() === "+" ) {
      eat();
      return parseTermRest(left + parseTerm());
    }
    if (peek() === "-") {
      eat();
      return parseTermRest(left - parseTerm());
    }
    return left;
  };
  const parseTerm = (): number => parseFactorRest(parseUnary());
  const parseFactorRest = (left: number): number => {
    if (peek() === "*") {
      eat();
      return parseFactorRest(left * parseUnary());
    }
    if (peek() === "/") {
      eat();
      const right = parseUnary();
      if (right === 0) throw new Error("div0");
      return parseFactorRest(left / right);
    }
    return left;
  };
  const parseUnary = (): number => {
    if (peek() === "-") {
      eat();
      return -parseUnary();
    }
    if (peek() === "+") {
      eat();
      return parseUnary();
    }
    return parsePower();
  };
  const parsePower = (): number => {
    const base = parsePrimary();
    if (peek() === "^") {
      eat();
      return base ** parseUnary();
    }
    return base;
  };
  const toDeg = (radians: number) => (radians * 180) / Math.PI;
  const applyFn = (name: string, arg: number): number => {
    if (name === "sin") return Math.sin((arg * Math.PI) / 180);
    if (name === "cos") return Math.cos((arg * Math.PI) / 180);
    if (name === "tan") return Math.tan((arg * Math.PI) / 180);
    if (name === "asin") return toDeg(Math.asin(arg));
    if (name === "acos") return toDeg(Math.acos(arg));
    if (name === "atan") return toDeg(Math.atan(arg));
    if (name === "sqrt") return Math.sqrt(arg);
    throw new Error("fn");
  };
  const parsePrimary = (): number => {
    const t = peek();
    if (t === undefined) throw new Error("eof");
    if (t === "pi") {
      eat();
      return Math.PI;
    }
    if (/^\d/.test(t)) {
      eat();
      return Number(t);
    }
    if (FN_NAMES.has(t)) {
      eat();
      if (peek() === "(") {
        eat();
        const arg = parseExpr();
        if (!eat(")")) throw new Error("paren");
        return applyFn(t, arg);
      }
      return applyFn(t, parseUnary());
    }
    if (t === "(") {
      eat();
      const v = parseExpr();
      if (!eat(")")) throw new Error("paren");
      return v;
    }
    throw new Error("tok");
  };

  try {
    const value = parseExpr();
    if (i !== tokens.length) return null;
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function formatCalc(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 4 : abs >= 1 ? 6 : 8;
  return Number(value.toFixed(digits)).toString();
}
