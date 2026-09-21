import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";
import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import {
  organizerData, orgQuestionLabels, orgQuestionFullText, orgFollowUp, orgSkillCategories,
  getOrgAvg, getOrgValidN, getOrgPositivePct, getOrgDistribution, type OrganizerRow,
} from "@/data/organizerData";
import { fmt, fmtPct } from "@/data/statsHelpers";

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
  const impactN = getOrgValidN(data, "overallImpact");
  const volunteeredYes = data.filter(d => d.volunteered === "igen").length;
  const volunteeredN = data.filter(d => d.volunteered === "igen" || d.volunteered === "nem").length;
  const workedYes = data.filter(d => d.workedWithGroup === "igen").length;
  const workedN = data.filter(d => d.workedWithGroup === "igen" || d.workedWithGroup === "nem").length;

  const followDays = useMemo(() => data.map(d => d.followUpDays).sort((a, b) => a - b), [data]);
  const medianDays = followDays.length ? followDays[Math.floor(followDays.length / 2)] : orgFollowUp.medianDays;

  const bars = (keys: string[]) =>
    keys.map(k => ({
      name: orgQuestionLabels[k] || k,
      avg: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
      nValid: getOrgValidN(data, k as keyof OrganizerRow),
    }));

  const socialData = useMemo(() => bars(orgSkillCategories.socialSensitivity.keys), [data]);
  const collabData = useMemo(() => bars(orgSkillCategories.collaboration.keys), [data]);
  const selfData = useMemo(() => bars(orgSkillCategories.selfDevelopment.keys), [data]);

  const pedRadar = useMemo(() =>
    orgSkillCategories.pedagogical.keys.map(k => ({
      skill: (orgQuestionLabels[k] || k).split(" ").slice(0, 2).join(" "),
      value: parseFloat(getOrgAvg(data, k as keyof OrganizerRow).toFixed(2)),
      fullMark: 5,
    })), [data]);

  const impactDist = useMemo(() => getOrgDistribution(data, "overallImpact"), [data]);
  const impactPositive = getOrgPositivePct(data, "overallImpact");

  return (
    <div data-pdf-section="organizer">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Hosszú távú önbeszámolók — ELTE hallgatók (szervezők)</h2>
        <p className="text-sm text-muted-foreground">
          Változó időtávú retrospektív utánkövetés (a workshop óta eltelt idő: {orgFollowUp.minDays}–{orgFollowUp.maxDays} nap, medián {medianDays} nap)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Válaszadók" value={n} sublabel="N" />
        <MetricCard label="Helyszínek" value={uniqueLocations} sublabel="település" />
        <MetricCard label="Észlelt hosszú távú hatás" value={fmt(avgImpact)} sublabel={`átlag (1–5), n=${impactN}`} />
        <MetricCard
          label="Önkéntes munka azóta"
          value={volunteeredN ? `${((volunteeredYes / volunteeredN) * 100).toFixed(1)}%` : "–"}
          sublabel={`${volunteeredYes}/${volunteeredN} „igen”`}
        />
      </div>

      <div className="chart-card mb-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Módszertani megjegyzés: </span>
          a hallgatói kérdőív önálló tételekből áll, amelyek nem azonosak a fiatalok kérdéseivel; minden érték egyszeri, visszatekintő önbeszámoló.
          A 15. tétel fordított megfogalmazású („{orgQuestionFullText.q15}”), ezért nyers értékként jelenik meg, külön kiemelve — nincs átpontozva.
          A workshop óta hátrányos helyzetű csoporttal dolgozott vagy tanult: {workedYes}/{workedN} válaszadó ({workedN ? ((workedYes / workedN) * 100).toFixed(1) : "–"}%).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Észlelt hosszú távú hatás mértéke (32. kérdés)"
          id="org-impact"
          insightVariant="organizer"
          insight={`A hallgatók ${fmtPct(impactPositive)}-a (${impactDist[3].count + impactDist[4].count}/${impactN}) jelentős vagy meghatározó hatásról számolt be. Átlag: ${fmt(avgImpact)}/5.`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={impactDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "fő", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number, _n, p) => [`${val} fő (${(p.payload as { pct: number }).pct}%)`, "Válaszok"]} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} animationDuration={600}>
                {impactDist.map((_, i) => (
                  <Cell key={i} fill={i >= 3 ? ORG_COLOR : ORG_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Együttműködés a workshopon (6–8., 10. kérdés)"
          id="org-collaboration"
          insightVariant="organizer"
          insight={`A legmagasabb érték a csoportbeli biztonságérzet (${fmt(getOrgAvg(data, "q8"))}/5), a legalacsonyabb a valódi együttműködés tétele (${fmt(getOrgAvg(data, "q6"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={collabData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Társadalmi érzékenység tételei (11–13., 16–21.)"
          id="org-social"
          insightVariant="organizer"
          insight={`A legmagasabb átlag a roma fiatalokkal való munkára vonatkozó nyitottságé (${fmt(getOrgAvg(data, "q21"))}/5), a legalacsonyabb a strukturális okokon való gondolkodásé (${fmt(getOrgAvg(data, "q20"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={socialData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 8, fontFamily: "'Source Sans Pro'" }} width={175} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={14} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Szakmai, pedagógiai tételek — Radar (22–26.)"
          id="org-pedagogical"
          insightVariant="organizer"
          insight={`A legmagasabb érték az együttműködési készség (${fmt(getOrgAvg(data, "q26"))}/5) és a csoportvezetés (${fmt(getOrgAvg(data, "q24"))}/5); a konfliktuskezelés alacsonyabb (${fmt(getOrgAvg(data, "q25"))}/5).`}
        >
          <ResponsiveContainer width="100%" height={320}>
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
          title="Önismeret és tudás (14., 27–28. kérdés)"
          id="org-self"
          insightVariant="organizer"
          insight={`Az új információk/tudás tétele ${fmt(getOrgAvg(data, "q28"))}/5, az önismereti fejlődés ${fmt(getOrgAvg(data, "q27"))}/5 átlagot mutat.`}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={selfData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} width={170} />
              <Tooltip formatter={(val: number, _n, p) => [`${val.toFixed(2)} (n=${(p.payload as { nValid: number }).nValid})`, "Átlag"]} />
              <Bar dataKey="avg" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={18} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Fordított tétel — 15. kérdés (nyers értékek)"
          id="org-reverse-item"
          insightVariant="organizer"
          insight={`A „nem változtatott a gondolkodásomon” állítás nyers átlaga ${fmt(getOrgAvg(data, "q15"))}/5: a magas érték egyetértést jelent az állítással, tehát alacsonyabb észlelt változást. Az értéket nem pontoztuk át.`}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getOrgDistribution(data, "q15")}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "fő", position: "insideLeft", fontSize: 10 }} />
              <Tooltip formatter={(val: number, _n, p) => [`${val} fő (${(p.payload as { pct: number }).pct}%)`, "Válaszok"]} />
              <Bar dataKey="count" fill={ORG_LIGHT} radius={[2, 2, 0, 0]} barSize={30} animationDuration={600} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
