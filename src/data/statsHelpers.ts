// Közös leíró statisztikai segédfüggvények (hiányzó értékek kizárásával)

type Key = string;
export type Row = Record<string, unknown>;
function vals(data: readonly object[], key: Key): number[] {
  return data
    .map((d) => (d as Row)[key])
    .filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5);
}
export function validN(data: readonly object[], key: Key): number {
  return vals(data, key).length;
}
export function avgOf(data: readonly object[], key: Key): number {
  const v = vals(data, key);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
}
export function positivePct(data: readonly object[], key: Key): number {
  const v = vals(data, key);
  return v.length ? (v.filter((x) => x >= 4).length / v.length) * 100 : NaN;
}
export const LIKERT_LABELS = [
  "1 – Egyáltalán nem",
  "2 – Inkább nem",
  "3 – Részben",
  "4 – Inkább igen",
  "5 – Teljes mértékben",
];
export interface DistBin { value: number; label: string; count: number; pct: number; }
export function distributionOf(data: readonly object[], key: Key): DistBin[] {
  const v = vals(data, key);
  return LIKERT_LABELS.map((label, i) => {
    const count = v.filter((x) => x === i + 1).length;
    return { value: i + 1, label, count, pct: v.length ? parseFloat(((count / v.length) * 100).toFixed(1)) : 0 };
  });
}
export function fmt(n: number, digits = 2): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "–";
}
export function fmtPct(n: number): string {
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : "–";
}
