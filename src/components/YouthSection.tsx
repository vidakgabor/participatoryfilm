import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { youthData, youthQuestionLabels, getAvg, getDistribution, skillCategories, type YouthRow } from "@/data/youthData";

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
  const returnRate = Math.round((data.filter(d => d.wouldReturn === "igen").length / n) * 100);

  // Skill development radar data
  const radarData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q9", "q10", "q11", "q13", "q14", "q15"];
    const labels = ["Önbizalom", "Magabiztosság", "Vélemény", "Együttműködés", "Konfliktuskezelés", "Nyitottság"];
    return keys.map((k, i) => ({
      skill: labels[i],
      value: parseFloat(getAvg(data, k).toFixed(2)),
      fullMark: 5,
    }));
  }, [data]);

  // Community impact bars
  const communityData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q15", "q16", "q17", "q18", "q19", "q20"];
    return keys.map(k => ({
      name: youthQuestionLabels[k] || k,
      avg: parseFloat(getAvg(data, k).toFixed(2)),
    }));
  }, [data]);

  // Long-term impact (diverging Likert)
  const longTermData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q21", "q22", "q23"];
    return keys.map(k => {
      const dist = getDistribution(data, k);
      return {
        name: youthQuestionLabels[k] || k,
        negative: -(dist[0].pct + dist[1].pct),
        neutral: dist[2].pct,
        positive: dist[3].pct + dist[4].pct,
        avg: parseFloat(getAvg(data, k).toFixed(2)),
      };
    });
  }, [data]);

  // General impact
  const satisfactionDist = useMemo(() => getDistribution(data, "satisfaction"), [data]);

  // Media impact
  const mediaData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q24", "q25"];
    return keys.map(k => ({
      name: youthQuestionLabels[k] || k,
      avg: parseFloat(getAvg(data, k).toFixed(2)),
    }));
  }, [data]);

  // Confidence bars
  const confidenceData = useMemo(() => {
    const keys: (keyof YouthRow)[] = ["q9", "q10", "q11", "q12"];
    return keys.map(k => ({
      name: youthQuestionLabels[k] || k,
      avg: parseFloat(getAvg(data, k).toFixed(2)),
    }));
  }, [data]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Hosszútávú hatások — Hátrányos helyzetű fiatalok</h2>
        <p className="text-sm text-muted-foreground">Részvételi filmes program utánkövetéses vizsgálat (1–3 év)</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Helyszínek" value={uniqueLocations} sublabel="település" />
        <MetricCard label="Elégedettség" value={avgSatisfaction.toFixed(1)} sublabel="átlag (1–5)" />
        <MetricCard label="Újra részt venne" value={`${returnRate}%`} sublabel="igen" />
      </div>

      {/* General impact */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Általános elégedettség eloszlása"
          id="youth-satisfaction"
          insight={`A válaszadók ${satisfactionDist[4].pct}%-a teljes mértékben elégedett volt a programmal. Az átlagos elégedettség ${avgSatisfaction.toFixed(2)}/5.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={satisfactionDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Arány"]} />
              <Bar dataKey="pct" radius={[2, 2, 0, 0]} animationDuration={600}>
                {satisfactionDist.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? YOUTH_COLOR : YOUTH_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Készségfejlődés — Önbizalom és kommunikáció"
          id="youth-confidence"
          insight={`A legmagasabb fejlődés a véleménynyilvánítás (${confidenceData.find(d => d.name === "Véleménynyilvánítás")?.avg || "–"}) és az önbizalom terén tapasztalható.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={confidenceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={130} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Készségfejlődés — Radar"
          id="youth-radar"
          insight="A résztvevők leginkább a nyitottság és az együttműködés terén fejlődtek, ami a program közösségépítő jellegét tükrözi."
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
          title="Közösségi hatások"
          id="youth-community"
          insight={`A közösségi szabályok betartása (${communityData.find(d => d.name.includes("szabály"))?.avg || "–"}) és az elfogadás (${communityData.find(d => d.name.includes("Elfogadás"))?.avg || "–"}) mutatják a legerősebb eredményt.`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={communityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={150} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={16} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Hosszútávú hatások — Szervezők és jövőkép"
          id="youth-longterm"
          insight={`A szervezők személyisége a legmagasabb hosszútávú hatást gyakorolta (${longTermData[0]?.avg || "–"}/5). A pozitív válaszok aránya mindhárom kérdésnél meghaladja a 60%-ot.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={longTermData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-10} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Pozitív arány"]} />
              <Bar dataKey="positive" fill={YOUTH_COLOR} radius={[2, 2, 0, 0]} barSize={40} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Filmkészítés és médiatudatosság"
          id="youth-media"
          insight="A filmezés/média iránti érdeklődés erős, de a kreatív tartalom utólagos készítése alacsonyabb — ez a program utánkövetési potenciáljára utal."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mediaData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={22} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
