import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { youthData, youthQuestionLabels, youthQuestionFullText, getAvg, getValidN, getPositivePct, type YouthRow } from "@/data/youthData";
import { organizerData, orgQuestionLabels, orgQuestionFullText, getOrgAvg, getOrgValidN, getOrgPositivePct, type OrganizerRow } from "@/data/organizerData";
import { fmt, fmtPct } from "@/data/statsHelpers";

interface ComparisonSectionProps {
  selectedLocation: string;
}

const YOUTH_COLOR = "#2563EB";
const ORG_COLOR = "#059669";

// Tartalmilag rokon, de NEM azonos tételek: csak egymás mellé állítva, közös skálán nem összevonva.
const themes: { theme: string; youthKey: keyof YouthRow; orgKey: keyof OrganizerRow }[] = [
  { theme: "Együttműködés", youthKey: "q13", orgKey: "q26" },
  { theme: "Kommunikáció, megszólalás", youthKey: "q9", orgKey: "q23" },
  { theme: "Magabiztosság / csoportvezetés", youthKey: "q10", orgKey: "q24" },
  { theme: "Nyitottság", youthKey: "q15", orgKey: "q21" },
  { theme: "Konfliktuskezelés", youthKey: "q14", orgKey: "q25" },
  { theme: "Önismeret, reflexió", youthKey: "q22", orgKey: "q27" },
];

export function ComparisonSection({ selectedLocation }: ComparisonSectionProps) {
  const yData = useMemo(() => (selectedLocation === "all" ? youthData : youthData.filter(d => d.location === selectedLocation)), [selectedLocation]);
  const oData = useMemo(() => (selectedLocation === "all" ? organizerData : organizerData.filter(d => d.location === selectedLocation)), [selectedLocation]);

  const rows = useMemo(() =>
    themes.map(t => ({
      theme: t.theme,
      youthItem: youthQuestionLabels[t.youthKey as string],
      orgItem: orgQuestionLabels[t.orgKey as string],
      youthFull: youthQuestionFullText[t.youthKey as string],
      orgFull: orgQuestionFullText[t.orgKey as string],
      youthAvg: parseFloat(getAvg(yData, t.youthKey).toFixed(2)),
      orgAvg: parseFloat(getOrgAvg(oData, t.orgKey).toFixed(2)),
      youthN: getValidN(yData, t.youthKey),
      orgN: getOrgValidN(oData, t.orgKey),
      youthPos: getPositivePct(yData, t.youthKey),
      orgPos: getOrgPositivePct(oData, t.orgKey),
    })), [yData, oData]);

  const youthChart = rows.map(r => ({ name: r.youthItem, avg: r.youthAvg, nValid: r.youthN }));
  const orgChart = rows.map(r => ({ name: r.orgItem, avg: r.orgAvg, nValid: r.orgN }));

  return (
    <div data-pdf-section="comparison">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">A két célcsoport önbeszámolóinak tartalmi összevetése</h2>
        <p className="text-sm text-muted-foreground">
          Hátrányos helyzetű fiatalok (N={yData.length}) és ELTE hallgatók (N={oData.length}) — leíró, tételszintű egymás mellé állítás
        </p>
      </div>

      <div className="chart-card mb-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Fontos értelmezési keret: </span>
          a két csoport eltérő kérdőívet töltött ki, eltérő megfogalmazású és tartalmú tételekkel, eltérő élethelyzetben és szerepben.
          Ezért a két minta értékei nem azonos konstruktumok mérései, csoportkülönbségként nem értelmezhetők, és nem végzünk rajtuk
          szignifikanciatesztet vagy hatásméret-számítást. Az alábbi ábrák és a táblázat kizárólag tartalmi, leíró egymás mellé állítást mutatnak,
          a tételek pontos szövegével együtt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Fiatalok — kapcsolódó tételek átlaga"
          id="comparison-youth-items"
          insight="A fiatalok kérdőívének azon tételei, amelyek témájukban rokoníthatók a hallgatói tételekkel. Az értékek csak ezen a mintán belül értelmezhetők."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={youthChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={16} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Hallgatók — kapcsolódó tételek átlaga"
          id="comparison-org-items"
          insightVariant="organizer"
          insight="A hallgatói kérdőív rokon témájú tételei. A két ábra egymás mellett olvasandó, de az értékek nem egymáshoz mért különbségek."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orgChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={16} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="chart-card">
        <h3 className="text-sm font-display font-semibold text-primary mb-3">Tételszintű tartalmi összevetés (leíró)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-3 font-semibold text-primary">Téma</th>
                <th className="text-left py-2 px-3 font-semibold text-primary">Fiatalok tétele</th>
                <th className="text-right py-2 px-2 font-semibold text-primary">M (n)</th>
                <th className="text-right py-2 px-2 font-semibold text-primary">4–5 %</th>
                <th className="text-left py-2 px-3 font-semibold text-primary">Hallgatók tétele</th>
                <th className="text-right py-2 px-2 font-semibold text-primary">M (n)</th>
                <th className="text-right py-2 pl-2 font-semibold text-primary">4–5 %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.theme} className="border-b border-border/50 align-top">
                  <td className="py-1.5 pr-3 font-medium">{r.theme}</td>
                  <td className="py-1.5 px-3 text-muted-foreground" title={r.youthFull}>{r.youthItem}</td>
                  <td className="py-1.5 px-2 text-right whitespace-nowrap">{fmt(r.youthAvg)} ({r.youthN})</td>
                  <td className="py-1.5 px-2 text-right whitespace-nowrap">{fmtPct(r.youthPos)}</td>
                  <td className="py-1.5 px-3 text-muted-foreground" title={r.orgFull}>{r.orgItem}</td>
                  <td className="py-1.5 px-2 text-right whitespace-nowrap">{fmt(r.orgAvg)} ({r.orgN})</td>
                  <td className="py-1.5 pl-2 text-right whitespace-nowrap">{fmtPct(r.orgPos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
          M = átlag az 1–5 skálán, zárójelben az érvényes válaszok száma (hiányzó válaszok kizárva). A „4–5 %” az adott tételre adott pozitív válaszok aránya
          az érvényes válaszokon belül. A sorok tartalmilag rokon, de eltérő szövegű tételeket állítanak egymás mellé; a különbségek nem csoportkülönbségek.
        </p>
      </div>
    </div>
  );
}
