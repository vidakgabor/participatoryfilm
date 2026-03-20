import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, PieChart, Pie, Legend,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { youthData, youthQuestionLabels, getAvg, getDistribution, type YouthRow } from "@/data/youthData";

interface AcceptanceFutureSectionProps {
  selectedLocation: string;
}

const BLUE = "#2563EB";
const BLUE_LIGHT = "#93c5fd";
const GREEN = "#16a34a";
const AMBER = "#f59e0b";
const ROSE = "#e11d48";
const COLORS_5 = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#2563EB"];

export function AcceptanceFutureSection({ selectedLocation }: AcceptanceFutureSectionProps) {
  const data = useMemo(() => {
    if (selectedLocation === "all") return youthData;
    return youthData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const n = data.length;

  // ── Acceptance & Community Connection (q17, q18, q19) ──
  const acceptanceKeys: (keyof YouthRow)[] = ["q17", "q18", "q19"];
  const acceptanceLabels: Record<string, string> = {
    q17: "Ismeretlenek megszólítása",
    q18: "Elfogadás",
    q19: "Közösségi szabályok betartása",
  };

  const acceptanceAvgs = useMemo(() =>
    acceptanceKeys.map(k => ({
      name: acceptanceLabels[k] || youthQuestionLabels[k],
      avg: parseFloat(getAvg(data, k).toFixed(2)),
    })), [data]);

  const acceptanceOverallAvg = useMemo(() => {
    const sum = acceptanceKeys.reduce((s, k) => s + getAvg(data, k), 0);
    return (sum / acceptanceKeys.length).toFixed(2);
  }, [data]);

  const acceptanceDists = useMemo(() =>
    acceptanceKeys.map(k => ({
      key: k,
      label: acceptanceLabels[k] || youthQuestionLabels[k],
      dist: getDistribution(data, k),
    })), [data]);

  // Stacked data for acceptance
  const acceptanceStacked = useMemo(() =>
    acceptanceDists.map(({ label, dist }) => ({
      name: label,
      "Egyáltalán nem": dist[0].pct,
      "Inkább nem": dist[1].pct,
      "Részben": dist[2].pct,
      "Inkább igen": dist[3].pct,
      "Teljes mértékben": dist[4].pct,
    })), [acceptanceDists]);

  // ── Future Vision (q22, q23) ──
  const futureKeys: (keyof YouthRow)[] = ["q22", "q23"];
  const futureLabels: Record<string, string> = {
    q22: "Jövőről gondolkodás",
    q23: "Jövőkép alakítása",
  };

  const futureAvgs = useMemo(() =>
    futureKeys.map(k => ({
      name: futureLabels[k] || youthQuestionLabels[k],
      avg: parseFloat(getAvg(data, k).toFixed(2)),
    })), [data]);

  const futureOverallAvg = useMemo(() => {
    const sum = futureKeys.reduce((s, k) => s + getAvg(data, k), 0);
    return (sum / futureKeys.length).toFixed(2);
  }, [data]);

  const futureDists = useMemo(() =>
    futureKeys.map(k => ({
      key: k,
      label: futureLabels[k] || youthQuestionLabels[k],
      dist: getDistribution(data, k),
    })), [data]);

  // Combined radar for all 5 questions
  const radarData = useMemo(() =>
    [...acceptanceKeys, ...futureKeys].map(k => ({
      skill: (acceptanceLabels[k] || futureLabels[k] || youthQuestionLabels[k]).substring(0, 18),
      value: parseFloat(getAvg(data, k).toFixed(2)),
      fullMark: 5,
    })), [data]);

  // ── School completion / q26 ──
  const schoolData = useMemo(() => {
    const vals = data.map(d => d.q26).filter(v => !isNaN(v));
    if (vals.length === 0) return null;
    // q26 values: group into categories
    const buckets: Record<string, number> = {
      "0 – Nem releváns": 0,
      "1 – Egyáltalán nem": 0,
      "2 – Kicsit": 0,
      "3 – Részben": 0,
      "4 – Nagyrészt": 0,
      "5 – Teljes mértékben": 0,
    };
    const labels = Object.keys(buckets);
    vals.forEach(v => {
      if (v >= 0 && v <= 5) buckets[labels[v]]++;
    });
    return labels.map(label => ({
      name: label,
      count: buckets[label],
      pct: vals.length ? Math.round((buckets[label] / vals.length) * 100) : 0,
    })).filter(d => d.count > 0);
  }, [data]);

  const schoolAvg = useMemo(() => {
    const vals = data.map(d => d.q26).filter(v => !isNaN(v) && v > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "–";
  }, [data]);

  // ── Location breakdown for acceptance ──
  const locationBreakdown = useMemo(() => {
    const locs = [...new Set(data.map(d => d.location))];
    return locs.map(loc => {
      const locData = data.filter(d => d.location === loc);
      return {
        name: loc,
        "Elfogadás": parseFloat(getAvg(locData, "q18").toFixed(2)),
        "Közösségi szabályok": parseFloat(getAvg(locData, "q19").toFixed(2)),
        "Jövőkép": parseFloat(getAvg(locData, "q23").toFixed(2)),
      };
    });
  }, [data]);

  // Positive response rates
  const positiveRates = useMemo(() => {
    const allKeys = [...acceptanceKeys, ...futureKeys];
    return allKeys.map(k => {
      const vals = data.map(d => d[k] as number).filter(v => !isNaN(v) && v >= 1 && v <= 5);
      const positive = vals.filter(v => v >= 4).length;
      return {
        name: (acceptanceLabels[k] || futureLabels[k] || k),
        pct: vals.length ? Math.round((positive / vals.length) * 100) : 0,
      };
    });
  }, [data]);

  return (
    <div data-pdf-section="acceptance-future">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Elfogadás, közösségi kapcsolódás és jövőkép</h2>
        <p className="text-sm text-muted-foreground">Kérdőív 17–19. kérdés (elfogadás) és 22–23. kérdés (jövőkép) elemzése</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Elfogadás átlag" value={acceptanceOverallAvg} sublabel="q17–q19 (1–5)" />
        <MetricCard label="Jövőkép átlag" value={futureOverallAvg} sublabel="q22–q23 (1–5)" />
        <MetricCard label="Iskola/tanulás" value={schoolAvg} sublabel="q26 átlag" />
      </div>

      {/* Row 1: Acceptance bars + Stacked Likert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Elfogadás és közösségi kapcsolódás — Átlagok"
          id="acceptance-avgs"
          insight={`Az elfogadás (${acceptanceAvgs.find(d => d.name === "Elfogadás")?.avg || "–"}/5) és a közösségi szabályok (${acceptanceAvgs.find(d => d.name.includes("szabály"))?.avg || "–"}/5) mutatják a legerősebb eredményt.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={acceptanceAvgs} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={160} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={BLUE} radius={[0, 4, 4, 0]} barSize={22} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Elfogadás — Likert eloszlás (%)"
          id="acceptance-stacked"
          insight="A válaszadók többsége pozitív (4–5) értékeket adott az elfogadás és közösségi kérdésekre."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={acceptanceStacked} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "%", position: "insideRight", fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={140} />
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

      {/* Row 2: Future vision + Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Jövőkép és továbbtanulási szándék"
          id="future-avgs"
          insight={`A program közepes mértékben befolyásolta a jövőről való gondolkodást (${futureAvgs[0]?.avg || "–"}/5) és a jövőkép alakítását (${futureAvgs[1]?.avg || "–"}/5).`}
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={futureDists.flatMap(({ label, dist }) =>
              dist.map(d => ({ question: label, ...d }))
            )}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 8 }} angle={-20} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Arány"]} />
              <Bar dataKey="pct" radius={[2, 2, 0, 0]} animationDuration={600}>
                {futureDists.flatMap(({ dist }) =>
                  dist.map((_, i) => (
                    <Cell key={Math.random()} fill={COLORS_5[i]} />
                  ))
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Elfogadás és jövőkép — Radar"
          id="acceptance-future-radar"
          insight="A radar diagram az összes elemzett dimenzió átlagértékét mutatja. Az elfogadás és a közösségi szabályok a legerősebbek."
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

      {/* Row 3: Positive rates + Location breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Pozitív válaszok aránya (4–5 értékek)"
          id="acceptance-positive"
          insight="Az elfogadás kérdésnél a legmagasabb a pozitív válaszok aránya, míg a jövőkép alakítása mérsékeltebb."
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={positiveRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "%", position: "insideRight", fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={160} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Pozitív"]} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={18} animationDuration={600}>
                {positiveRates.map((d, i) => (
                  <Cell key={i} fill={d.pct >= 60 ? GREEN : d.pct >= 40 ? AMBER : ROSE} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {selectedLocation === "all" && locationBreakdown.length > 1 ? (
          <ChartCard
            title="Helyszínek közötti összehasonlítás"
            id="acceptance-locations"
            insight="A helyszínek közötti eltérések a közösségi kontextus és a program implementációjának különbségeit tükrözik."
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={locationBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-20} textAnchor="end" height={60} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
                <Bar dataKey="Elfogadás" fill={BLUE} barSize={12} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Közösségi szabályok" fill={GREEN} barSize={12} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Jövőkép" fill={AMBER} barSize={12} radius={[2, 2, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        ) : (
          <ChartCard
            title="Részletes eloszlás — Jövőkép alakítása (q23)"
            id="future-q23-dist"
            insight={`A q23 kérdésnél a válaszadók ${futureDists[1]?.dist[3]?.pct + futureDists[1]?.dist[4]?.pct || 0}%-a adott pozitív választ.`}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={futureDists[1]?.dist || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
                <Tooltip formatter={(val: number) => [`${val}%`, "Arány"]} />
                <Bar dataKey="pct" radius={[2, 2, 0, 0]} animationDuration={600}>
                  {(futureDists[1]?.dist || []).map((_, i) => (
                    <Cell key={i} fill={COLORS_5[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Row 4: School completion */}
      {schoolData && schoolData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ChartCard
            title="Iskola befejezése / továbbtanulás (q26)"
            id="school-completion"
            insight={`Az iskola befejezésére/továbbtanulásra vonatkozó átlagérték ${schoolAvg}/5. A program közvetett hatással bír a tanulási motivációra.`}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={schoolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val: number, name: string) => [name === "pct" ? `${val}%` : val, name === "pct" ? "Arány" : "Fő"]} />
                <Bar dataKey="count" fill={BLUE} radius={[2, 2, 0, 0]} barSize={30} animationDuration={600}>
                  {schoolData.map((_, i) => (
                    <Cell key={i} fill={COLORS_5[Math.min(i, 4)]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Iskola befejezése — Megoszlás (%)"
            id="school-pie"
            insight="A kördiagram az iskola befejezésére adott válaszok százalékos megoszlását mutatja."
          >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={schoolData}
                  dataKey="pct"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, pct }) => `${pct}%`}
                  animationDuration={600}
                >
                  {schoolData.map((_, i) => (
                    <Cell key={i} fill={COLORS_5[Math.min(i, 4)]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${val}%`]} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
