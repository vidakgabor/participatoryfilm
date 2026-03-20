import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { organizerData, orgQuestionLabels, getOrgAvg, orgSkillCategories, type OrganizerRow } from "@/data/organizerData";

interface OrganizerSectionProps {
  selectedLocation: string;
}

const ORG_COLOR = "#059669";
const ORG_LIGHT = "#6ee7b7";

export function OrganizerSection({ selectedLocation }: OrganizerSectionProps) {
  const data = useMemo(() => {
    if (selectedLocation === "all") return organizerData;
    return organizerData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const n = data.length;
  const uniqueLocations = [...new Set(data.map(d => d.location))].length;
  const avgImpact = getOrgAvg(data, "overallImpact");
  const wouldReturnRate = Math.round((data.filter(d => d.wouldParticipateAgain >= 4).length / n) * 100);
  const volunteeredRate = Math.round((data.filter(d => d.volunteered === "igen").length / n) * 100);

  // Social sensitivity bars
  const socialData = useMemo(() => {
    const keys = orgSkillCategories.socialSensitivity.keys;
    return keys.map(k => ({
      name: orgQuestionLabels[k] || k,
      avg: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
    }));
  }, [data]);

  // Pedagogical competence radar
  const pedRadar = useMemo(() => {
    const keys = orgSkillCategories.pedagogical.keys;
    return keys.map(k => ({
      skill: orgQuestionLabels[k]?.substring(0, 20) || k,
      value: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
      fullMark: 5,
    }));
  }, [data]);

  // Collaboration bars
  const collabData = useMemo(() => {
    const keys = orgSkillCategories.collaboration.keys;
    return keys.map(k => ({
      name: orgQuestionLabels[k] || k,
      avg: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
    }));
  }, [data]);

  // Self development
  const selfData = useMemo(() => {
    const keys = orgSkillCategories.selfDevelopment.keys;
    return keys.map(k => ({
      name: orgQuestionLabels[k] || k,
      avg: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
    }));
  }, [data]);

  // Overall impact distribution
  const impactDist = useMemo(() => {
    const labels = ["1 – nincs hatás", "2 – kis mértékben", "3 – közepesen", "4 – jelentősen", "5 – meghatározóan"];
    const counts = [0, 0, 0, 0, 0];
    data.forEach(d => {
      if (d.overallImpact >= 1 && d.overallImpact <= 5) counts[d.overallImpact - 1]++;
    });
    return labels.map((label, i) => ({
      label,
      count: counts[i],
      pct: n ? Math.round((counts[i] / n) * 100) : 0,
    }));
  }, [data, n]);

  return (
    <div data-pdf-section="organizer">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Hosszútávú hatások — ELTE hallgatók (szervezők)</h2>
        <p className="text-sm text-muted-foreground">Szervezői perspektíva — facilitátorok utánkövetése</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Helyszínek" value={uniqueLocations} sublabel="település" />
        <MetricCard label="Hosszútávú hatás" value={avgImpact.toFixed(1)} sublabel="átlag (1–5)" />
        <MetricCard label="Önkéntes munka" value={`${volunteeredRate}%`} sublabel="workshop óta" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Hosszútávú hatás mértéke"
          id="org-impact"
          insightVariant="organizer"
          insight={`A hallgatók ${impactDist[3].pct + impactDist[4].pct}%-a jelentős vagy meghatározó hatásról számolt be. Átlag: ${avgImpact.toFixed(2)}/5.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={impactDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "%", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number) => [`${val}%`, "Arány"]} />
              <Bar dataKey="pct" radius={[2, 2, 0, 0]} animationDuration={600}>
                {impactDist.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? ORG_COLOR : ORG_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Együttműködés a workshopon"
          id="org-collaboration"
          insightVariant="organizer"
          insight="Az együttműködés értékelése átlagosan magas — a biztonságérzet a csoportban kiemelkedő."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={collabData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={160} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Társadalmi érzékenység változása"
          id="org-social"
          insightVariant="organizer"
          insight="A sztereotípiák felismerése és az empátia növekedése a legmarkánsabb változás a hallgatóknál."
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={socialData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={14} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Pedagógiai kompetenciák — Radar"
          id="org-pedagogical"
          insightVariant="organizer"
          insight="A csoportvezetés és az együttműködési készség fejlődése kiemelkedő — a hallgatók praxisukban is alkalmazzák az itt szerzett tapasztalatokat."
        >
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={pedRadar}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9 }} />
              <Radar dataKey="value" stroke={ORG_COLOR} fill={ORG_COLOR} fillOpacity={0.2} animationDuration={600} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Önfejlődés"
          id="org-self"
          insightVariant="organizer"
          insight="A hallgatók önismereti fejlődésről és új felismerésekről számolnak be — a workshop katalizátor hatású volt."
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={selfData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={150} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
