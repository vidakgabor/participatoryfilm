import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, Legend,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import {
  youthData, youthQuestionLabels, youthQuestionFullText,
  getAvg, getValidN, getPositivePct, getDistribution, type YouthRow,
} from "@/data/youthData";
import { fmt, fmtPct } from "@/data/statsHelpers";

interface AcceptanceFutureSectionProps {
  selectedLocation: string;
}

const BLUE = "#2563EB";
const GREEN = "#16a34a";
const AMBER = "#f59e0b";
const ROSE = "#e11d48";
const COLORS_5 = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#2563EB"];

const radarShort: Record<string, string> = {
  q17: "Ismeretlenek",
  q18: "Elfogadás",
  q19: "Szabályok",
  q22: "Jövő-gondolkodás",
  q23: "Jövőkép",
  q26: "Továbbtanulás",
};

const acceptanceKeys: (keyof YouthRow)[] = ["q17", "q18", "q19"];
const futureKeys: (keyof YouthRow)[] = ["q22", "q23", "q26"];

export function AcceptanceFutureSection({ selectedLocation }: AcceptanceFutureSectionProps) {
  const data = useMemo(() => {
    if (selectedLocation === "all") return youthData;
    return youthData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const n = data.length;

  const acceptanceAvgs = useMemo(() =>
    acceptanceKeys.map(k => ({
      name: youthQuestionLabels[k as string],
      avg: parseFloat(getAvg(data, k).toFixed(2)),
      nValid: getValidN(data, k),
    })), [data]);

  const acceptanceStacked = useMemo(() =>
    acceptanceKeys.map(k => {
      const dist = getDistribution(data, k);
      return {
        name: youthQuestionLabels[k as string],
        "Egyáltalán nem": dist[0].pct,
        "Inkább nem": dist[1].pct,
        "Részben": dist[2].pct,
        "Inkább igen": dist[3].pct,
        "Teljes mértékben": dist[4].pct,
      };
    }), [data]);

  const futureAvgs = useMemo(() =>
    futureKeys.map(k => ({
      name: youthQuestionLabels[k as string],
      avg: parseFloat(getAvg(data, k).toFixed(2)),
      nValid: getValidN(data, k),
    })), [data]);

  const radarData = useMemo(() =>
    [...acceptanceKeys, ...futureKeys].map(k => ({
      skill: radarShort[k as string],
      value: parseFloat(getAvg(data, k).toFixed(2)),
      fullMark: 5,
    })), [data]);

  const q26Dist = useMemo(() => getDistribution(data, "q26"), [data]);
  const q26N = getValidN(data, "q26");
  const q26Positive = getPositivePct(data, "q26");

  const locationBreakdown = useMemo(() => {
    const locs = [...new Set(data.map(d => d.location))].sort();
    return locs.map(loc => {
      const locData = data.filter(d => d.location === loc);
      return {
        name: `${loc} (n=${locData.length})`,
        "Elfogadás (18.)": parseFloat(getAvg(locData, "q18").toFixed(2)),
        "Jövőkép (23.)": parseFloat(getAvg(locData, "q23").toFixed(2)),
        "Továbbtanulás (26.)": parseFloat(getAvg(locData, "q26").toFixed(2)),
      };
    });
  }, [data]);

  const positiveRates = useMemo(() =>
    [...acceptanceKeys, ...futureKeys].map(k => ({
      name: youthQuestionLabels[k as string],
      pct: parseFloat(getPositivePct(data, k).toFixed(1)),
      nValid: getValidN(data, k),
    })), [data]);

  return (
    <div data-pdf-section="acceptance-future">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Elfogadás, közösségi kapcsolódás és jövőkép</h2>
        <p className="text-sm text-muted-foreground">
          A fiatalok kérdőívének 17–19. (elfogadás, kapcsolódás) és 22–23., 26. (jövőkép, továbbtanulás) tételei — tételenkénti leíró elemzés
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Elfogadás (18.)" value={fmt(getAvg(data, "q18"))} sublabel={`átlag, n=${getValidN(data, "q18")}`} />
        <MetricCard label="Jövőkép (23.)" value={fmt(getAvg(data, "q23"))} sublabel={`átlag, n=${getValidN(data, "q23")}`} />
        <MetricCard label="Továbbtanulás (26.)" value={fmt(getAvg(data, "q26"))} sublabel={`átlag, n=${q26N}`} />
      </div>

      <div className="chart-card mb-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Megjegyzés: </span>
          az egyes tételek külön-külön szerepelnek, összevont skálát nem képezünk, mert a kérdések nem validált skálaként készültek.
          A 26. tétel pontos megfogalmazása: „{youthQuestionFullText.q26}” — ez nem az iskola befejezésére vonatkozik.
          A hiányzó válasz kizárva (n = {q26N}).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Elfogadás és közösségi kapcsolódás — átlagok"
          id="acceptance-avgs"
          insight={`Az elfogadás más háttérből érkezők iránt ${fmt(getAvg(data, "q18"))}/5, az ismeretlenekkel való beszélgetés ${fmt(getAvg(data, "q17"))}/5, a közösségi szabályok betartása ${fmt(getAvg(data, "q19"))}/5.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={acceptanceAvgs} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={165} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={BLUE} radius={[0, 4, 4, 0]} barSize={22} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Elfogadás — válaszeloszlás (%)"
          id="acceptance-stacked"
          insight={`A 18. tételnél a válaszadók ${fmtPct(getPositivePct(data, "q18"))}-a jelölt 4-es vagy 5-ös értéket; negatív (1–2) választ senki nem adott.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={acceptanceStacked} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={150} />
              <Tooltip formatter={(val: number) => [`${val}%`]} />
              <Bar dataKey="Egyáltalán nem" stackId="a" fill={COLORS_5[0]} />
              <Bar dataKey="Inkább nem" stackId="a" fill={COLORS_5[1]} />
              <Bar dataKey="Részben" stackId="a" fill={COLORS_5[2]} />
              <Bar dataKey="Inkább igen" stackId="a" fill={COLORS_5[3]} />
              <Bar dataKey="Teljes mértékben" stackId="a" fill={COLORS_5[4]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Jövőkép és továbbtanulás — átlagok"
          id="future-avgs"
          insight={`A jövőről való gondolkodás ${fmt(getAvg(data, "q22"))}/5 és a jövőkép alakulása ${fmt(getAvg(data, "q23"))}/5 közepes értéket mutat, a továbbtanulási döntésre gyakorolt észlelt hatás ennél alacsonyabb (${fmt(getAvg(data, "q26"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={futureAvgs} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={165} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={BLUE} radius={[0, 4, 4, 0]} barSize={22} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Elfogadás és jövőkép — Radar"
          id="acceptance-future-radar"
          insight="A radar a hat tétel átlagát mutatja egy skálán; az elfogadás és a kapcsolódás tételei magasabbak, a továbbtanulási tétel alacsonyabb."
        >
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9 }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9 }} />
              <Radar dataKey="value" stroke={BLUE} fill={BLUE} fillOpacity={0.2} animationDuration={600} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Pozitív (4–5) válaszok aránya tételenként"
          id="acceptance-positive"
          insight={`A legmagasabb pozitív arány az elfogadás tételénél (${fmtPct(getPositivePct(data, "q18"))}), a legalacsonyabb a továbbtanulási döntésnél (${fmtPct(q26Positive)}).`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={positiveRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={165} />
              <Tooltip formatter={(val: number, _n, p) => [`${val}% (n=${(p.payload as { nValid: number }).nValid})`, "Pozitív (4–5)"]} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={18} animationDuration={600}>
                {positiveRates.map((d, i) => (
                  <Cell key={i} fill={d.pct >= 60 ? GREEN : d.pct >= 40 ? AMBER : ROSE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="26. kérdés — a továbbtanulási döntésre gyakorolt észlelt hatás"
          id="future-q26-dist"
          insight={`A válaszadók ${fmtPct(q26Positive)}-a (${q26Dist[3].count + q26Dist[4].count}/${q26N}) jelölt 4-es vagy 5-ös értéket, míg ${q26Dist[0].count}/${q26N} „egyáltalán nem” választ adott. Átlag: ${fmt(getAvg(data, "q26"))}/5.`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={q26Dist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "fő", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number, _n, p) => [`${val} fő (${(p.payload as { pct: number }).pct}%)`, "Válaszok"]} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={34} animationDuration={600}>
                {q26Dist.map((_, i) => (
                  <Cell key={i} fill={COLORS_5[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {selectedLocation === "all" && locationBreakdown.length > 1 && (
        <ChartCard
          title="Helyszínenkénti átlagok (kis elemszámok!)"
          id="acceptance-locations"
          insight="A helyszínenkénti elemszámok kicsik (n = 5–15), ezért az eltérések tájékoztató jellegűek, statisztikai következtetésre nem alkalmasak."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={locationBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-20} textAnchor="end" height={70} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="Elfogadás (18.)" fill={BLUE} barSize={12} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Jövőkép (23.)" fill={GREEN} barSize={12} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Továbbtanulás (26.)" fill={AMBER} barSize={12} radius={[2, 2, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
