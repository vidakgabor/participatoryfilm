// Mann-Whitney U test implementation for comparing two independent samples

/**
 * Performs a Mann-Whitney U test (two-tailed) on two independent samples.
 * Returns U statistic, z-score, and approximate p-value.
 */
export function mannWhitneyU(sample1: number[], sample2: number[]): {
  U: number;
  z: number;
  p: number;
  significant005: boolean;
  significant001: boolean;
  significant0001: boolean;
  stars: string;
} {
  const n1 = sample1.length;
  const n2 = sample2.length;

  if (n1 === 0 || n2 === 0) {
    return { U: 0, z: 0, p: 1, significant005: false, significant001: false, significant0001: false, stars: "" };
  }

  // Combine and rank
  const combined: { value: number; group: 1 | 2 }[] = [
    ...sample1.map(v => ({ value: v, group: 1 as const })),
    ...sample2.map(v => ({ value: v, group: 2 as const })),
  ];

  combined.sort((a, b) => a.value - b.value);

  // Assign ranks with ties averaged
  const ranks: number[] = new Array(combined.length);
  let i = 0;
  while (i < combined.length) {
    let j = i;
    while (j < combined.length && combined[j].value === combined[i].value) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[k] = avgRank;
    }
    i = j;
  }

  // Sum of ranks for group 1
  let R1 = 0;
  let idx = 0;
  for (const item of combined) {
    if (item.group === 1) {
      R1 += ranks[idx];
    }
    idx++;
  }

  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U2 = n1 * n2 - U1;
  const U = Math.min(U1, U2);

  // Normal approximation (with continuity correction for ties)
  const meanU = (n1 * n2) / 2;
  const N = n1 + n2;

  // Tie correction
  const tieGroups: number[] = [];
  let ti = 0;
  while (ti < combined.length) {
    let tj = ti;
    while (tj < combined.length && combined[tj].value === combined[ti].value) {
      tj++;
    }
    const tieSize = tj - ti;
    if (tieSize > 1) {
      tieGroups.push(tieSize);
    }
    ti = tj;
  }

  let tieCorrection = 0;
  for (const t of tieGroups) {
    tieCorrection += (t * t * t - t);
  }

  const sigmaU = Math.sqrt(
    (n1 * n2 / 12) * ((N + 1) - tieCorrection / (N * (N - 1)))
  );

  const z = sigmaU > 0 ? (U1 - meanU) / sigmaU : 0;

  // Two-tailed p-value from z-score (approximation using error function)
  const p = 2 * (1 - normalCDF(Math.abs(z)));

  const significant005 = p < 0.05;
  const significant001 = p < 0.01;
  const significant0001 = p < 0.001;

  let stars = "";
  if (significant0001) stars = "***";
  else if (significant001) stars = "**";
  else if (significant005) stars = "*";

  return { U, z, p, significant005, significant001, significant0001, stars };
}

/** Standard normal CDF approximation */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/** Format p-value for display */
export function formatP(p: number): string {
  if (p < 0.001) return "< .001";
  if (p < 0.01) return `= .${Math.round(p * 1000).toString().padStart(3, "0")}`;
  return `= .${Math.round(p * 100).toString().padStart(2, "0")}`;
}
