import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import {
  youthData, youthQuestionLabels, youthFollowUp,
  getAvg, getValidN, getPositivePct, getDistribution, type YouthRow,
} from "@/data/youthData";
import { fmt, fmtPct } from "@/data/statsHelpers";

interface YouthSectionProps {
  selectedLocation: string;
}

const YOUTH_COLOR = "#2563EB";
const YOUTH_LIGHT = "#93c5fd";

export function YouthSection({ selectedLocation }: YouthSectionProps) {
  const data = useMemo(() => {
    if (selectedLocation === "all") return youthData;
    return youthData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const n = data.length;
  const uniqueLocations = [...new Set(data.map(d => d.location))].length;
  const avgSatisfaction = getAvg(data, "satisfaction");
  const returnYes = data.filter(d => d.wouldReturn === "igen").length;
  const returnN = data.filter(d => d.wouldReturn.length > 0).length;

  const followDays = useMemo(() => data.map(d => d.followUpDays).sort((a, b) => a - b), [data]);
  const medianDays = followDays.length ? followDays[Math.floor(followDays.length / 2)] : youthFollowUp.medianDays;

  const bar = (keys: (keyof YouthRow)[]) =>
    keys.map(k => ({
      name: youthQuestionLabels[k as string] || (k as string),
      avg: parseFloat(getAvg(data, k).toFixed(2)),
      nValid: getValidN(data, k),
    }));

  // Önbizalom / önkifejezés (9–12)
  const confidenceData = useMemo(() => bar(["q9", "q10", "q11", "q12"]), [data]);

  // Készségfejlődés radar (9, 10, 11, 13, 14, 15)
  const radarData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q9", "q10", "q11", "q13", "q14", "q15"];
    const short: Record<string, string> = {
      q9: "Megszólalás",
      q10: "Önbizalom",
      q11: "Vélemény",
      q13: "Együttműködés",
      q14: "Konfliktus",
      q15: "Nyitottság",
    };
    return keys.map(k => ({
      skill: short[k as string],
      value: parseFloat(getAvg(data, k).toFixed(2)),
      fullMark: 5,
    }));
  }, [data]);

  // Közösségi kapcsolódás (15–20)
  const communityData = useMemo(() => bar(["q15", "q16", "q17", "q18", "q19", "q20"]), [data]);

  // Retrospektív hatásészlelés (21–23)
  const longTermData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q21", "q22", "q23"];
    return keys.map(k => ({
      name: youthQuestionLabels[k as string],
      avg: parseFloat(getAvg(data, k).toFixed(2)),
      positive: parseFloat(getPositivePct(data, k).toFixed(1)),
      nValid: getValidN(data, k),
    }));
  }, [data]);

  // Média és továbbtanulás
  const mediaLikert = useMemo(() => bar(["q24", "q26"]), [data]);
  const createdYes = data.filter(d => d.q25 === "igen").length;
  const createdN = data.filter(d => d.q25 === "igen" || d.q25 === "nem").length;

  const satisfactionDist = useMemo(() => getDistribution(data, "satisfaction"), [data]);
  const satisfactionN = getValidN(data, "satisfaction");

  return (
    <div data-pdf-section="youth">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Hosszú távú önbeszámolók — Hátrányos helyzetű fiatalok</h2>
        <p className="text-sm text-muted-foreground">
          Változó időtávú retrospektív utánkövetés (a workshop óta eltelt idő: {youthFollowUp.minDays}–{youthFollowUp.maxDays} nap, medián {medianDays} nap)
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Helyszínek" value={uniqueLocations} sublabel="település" />
        <MetricCard label="Elégedettség" value={fmt(avgSatisfaction)} sublabel={`átlag (1–5), n=${satisfactionN}`} />
        <MetricCard label="Újra részt venne" value={returnN ? `${((returnYes / returnN) * 100).toFixed(1)}%` : "–"} sublabel={`${returnYes}/${returnN} „igen”`} />
      </div>

      <div className="chart-card mb-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Módszertani megjegyzés: </span>
          minden adat a résztvevők egyszeri, visszatekintő önbeszámolója a workshop után eltelt, egyénenként eltérő idővel.
          Nincs előzetes (pre) mérés, ezért az értékek észlelt változást jelenítenek meg, nem mért változást, és nem értelmezhetők oksági hatásként.
          Az átlagok a hiányzó válaszok kizárásával készültek (a tételenkénti n külön szerepel).
        </p>
      </div>

      {/* General impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Általános elégedettség eloszlása (7. kérdés)"
          id="youth-satisfaction"
          insight={`A válaszadók ${fmtPct(satisfactionDist[4].pct)}-a (${satisfactionDist[4].count}/${satisfactionN}) adta a legmagasabb értéket. Átlag: ${fmt(avgSatisfaction)}/5.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={satisfactionDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number, _n, p) => [`${val}% (${(p.payload as { count: number }).count} fő)`, "Arány"]} />
              <Bar dataKey="pct" radius={[2, 2, 0, 0]} animationDuration={600}>
                {satisfactionDist.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? YOUTH_COLOR : YOUTH_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Önbizalom és önkifejezés (9–12. kérdés)"
          id="youth-confidence"
          insight={`A legmagasabb átlag a vélemény képviseleténél (${fmt(getAvg(data, "q11"))}/5), a legalacsonyabb az önbizalomnál (${fmt(getAvg(data, "q10"))}/5). Az értékek észlelt, visszatekintő változást jelölnek.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={confidenceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={150} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Készségekre vonatkozó önbeszámolók — Radar"
          id="youth-radar"
          insight={`A legmagasabb érték a nyitottság új emberekre (${fmt(getAvg(data, "q15"))}/5), a legalacsonyabb a nyugodt konfliktuskezelés (${fmt(getAvg(data, "q14"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9 }} />
              <Radar dataKey="value" stroke={YOUTH_COLOR} fill={YOUTH_COLOR} fillOpacity={0.2} animationDuration={600} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Közösségi kapcsolódás (15–20. kérdés)"
          id="youth-community"
          insight={`A legmagasabb átlag a közösségi programokon való részvételé (${fmt(getAvg(data, "q16"))}/5), a legalacsonyabb a felelősségvállalásé (${fmt(getAvg(data, "q20"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={communityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={165} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={16} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Visszatekintő hatásészlelés (21–23. kérdés) — pozitív (4–5) válaszok aránya"
          id="youth-longterm"
          insight={`A szervezők és segítők ösztönző hatását ${fmtPct(longTermData[0].positive)} értékelte pozitívan (átlag ${fmt(longTermData[0].avg)}/5); a jövőről való gondolkodásnál ez ${fmtPct(longTermData[1].positive)}, a jövőkép alakulásánál ${fmtPct(longTermData[2].positive)}.`}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={longTermData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-12} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number, _n, p) => [`${val}% (átlag ${(p.payload as { avg: number }).avg}, n=${(p.payload as { nValid: number }).nValid})`, "Pozitív (4–5)"]} />
              <Bar dataKey="positive" fill={YOUTH_COLOR} radius={[2, 2, 0, 0]} barSize={40} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Média iránti érdeklődés és továbbtanulás (24., 26. kérdés)"
          id="youth-media"
          insight={`A film/média iránti érdeklődés átlaga ${fmt(getAvg(data, "q24"))}/5 (n=${getValidN(data, "q24")}), a továbbtanulási döntésre gyakorolt észlelt hatásé ${fmt(getAvg(data, "q26"))}/5 (n=${getValidN(data, "q26")}). A két tétel külön skálán mért, eltérő tartalmú kérdés.`}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mediaLikert} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={22} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-3">
            25. kérdés (igen/nem, külön változó): a workshop óta készített videót vagy kreatív tartalmat{" "}
            <span className="font-semibold text-foreground">{createdYes}/{createdN} válaszadó ({createdN ? ((createdYes / createdN) * 100).toFixed(1) : "–"}%)</span>.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
