import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { youthData, getAvg, type YouthRow } from "@/data/youthData";
import { organizerData, getOrgAvg, type OrganizerRow } from "@/data/organizerData";

interface ComparisonSectionProps {
  selectedLocation: string;
}

const YOUTH_COLOR = "#2563EB";
const ORG_COLOR = "#059669";

export function ComparisonSection({ selectedLocation }: ComparisonSectionProps) {
  const yData = useMemo(() => {
    if (selectedLocation === "all") return youthData;
    return youthData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const oData = useMemo(() => {
    if (selectedLocation === "all") return organizerData;
    return organizerData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  // Comparable dimensions
  const comparisonData = useMemo(() => [
    {
      dimension: "Együttműködés",
      youth: parseFloat(getAvg(yData, "q13").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q26" as keyof OrganizerRow).toFixed(2)),
    },
    {
      dimension: "Kommunikáció",
      youth: parseFloat(getAvg(yData, "q9").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q23" as keyof OrganizerRow).toFixed(2)),
    },
    {
      dimension: "Önbizalom",
      youth: parseFloat(getAvg(yData, "q10").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q24" as keyof OrganizerRow).toFixed(2)),
    },
    {
      dimension: "Nyitottság",
      youth: parseFloat(getAvg(yData, "q15").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q21" as keyof OrganizerRow).toFixed(2)),
    },
    {
      dimension: "Konfliktuskezelés",
      youth: parseFloat(getAvg(yData, "q14").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q25" as keyof OrganizerRow).toFixed(2)),
    },
    {
      dimension: "Önismeret",
      youth: parseFloat(getAvg(yData, "q22").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "q27" as keyof OrganizerRow).toFixed(2)),
    },
  ], [yData, oData]);

  // Overall satisfaction comparison
  const satisfactionComp = useMemo(() => [
    {
      group: "Elégedettség / Hatás",
      youth: parseFloat(getAvg(yData, "satisfaction").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "overallImpact").toFixed(2)),
    },
  ], [yData, oData]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Összehasonlító elemzés</h2>
        <p className="text-sm text-muted-foreground">Résztvevők (N={yData.length}) vs. ELTE hallgatók (N={oData.length}) percepciója</p>
      </div>

      <ChartCard
        title="Készségfejlődés összehasonlítása — Fiatalok vs. Hallgatók"
        id="comparison-skills"
        insight="Mindkét csoport hasonlóan magas fejlődést észlelt az együttműködés és a nyitottság terén. A hallgatók az önismereti fejlődést értékelik magasabbra, míg a fiatalok az önbizalom-növekedést emelik ki."
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="dimension" tick={{ fontSize: 11, fontFamily: "'Source Sans Pro'" }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(val: number) => [val.toFixed(2), ""]} />
            <Legend
              formatter={(value) => value === "youth" ? "Hátrányos helyzetű fiatalok" : "ELTE hallgatók"}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Bar dataKey="youth" fill={YOUTH_COLOR} radius={[2, 2, 0, 0]} barSize={28} animationDuration={600} name="youth" />
            <Bar dataKey="organizer" fill={ORG_COLOR} radius={[2, 2, 0, 0]} barSize={28} animationDuration={600} name="organizer" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="mt-4">
        <ChartCard
          title="Általános hatás összehasonlítása"
          id="comparison-overall"
          insight={`Mindkét csoport pozitívan értékeli a program hosszútávú hatását. A fiatalok elégedettsége (${satisfactionComp[0]?.youth}/5) és a hallgatók által észlelt hatás (${satisfactionComp[0]?.organizer}/5) egyaránt magas.`}
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={satisfactionComp} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="group" tick={{ fontSize: 11 }} width={150} />
              <Tooltip formatter={(val: number) => [val.toFixed(2), ""]} />
              <Legend
                formatter={(value) => value === "youth" ? "Fiatalok" : "Hallgatók"}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="youth" fill={YOUTH_COLOR} radius={[0, 2, 2, 0]} barSize={22} name="youth" />
              <Bar dataKey="organizer" fill={ORG_COLOR} radius={[0, 2, 2, 0]} barSize={22} name="organizer" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Statistical notes */}
      <div className="mt-4 chart-card">
        <h3 className="text-sm font-display font-semibold text-primary mb-2">Megjegyzések a statisztikai elemzéshez</h3>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
          <li>Az adatok Likert-skálán (1–5) mért önértékelésből származnak, utánkövetéses felmérés alapján.</li>
          <li>A csoportok közötti összehasonlítás leíró statisztikai jellegű — a mintanagyság (N<sub>fiatalok</sub>=78, N<sub>hallgatók</sub>=42) korlátozott inferenciális elemzést tesz lehetővé.</li>
          <li>Az összehasonlított dimenziók nem azonos kérdésekből származnak, hanem tartalmilag hasonló konstruktumokat mérnek.</li>
          <li className="text-significance font-semibold">* A szignifikancia-vizsgálatokhoz Mann-Whitney U teszt vagy Kruskal-Wallis teszt ajánlott a nem normális eloszlás miatt.</li>
        </ul>
      </div>
    </div>
  );
}
