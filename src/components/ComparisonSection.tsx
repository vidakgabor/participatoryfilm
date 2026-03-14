import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Label,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { youthData, getAvg, type YouthRow } from "@/data/youthData";
import { organizerData, getOrgAvg, type OrganizerRow } from "@/data/organizerData";
import { mannWhitneyU, formatP } from "@/lib/mannWhitney";

interface ComparisonSectionProps {
  selectedLocation: string;
}

const YOUTH_COLOR = "#2563EB";
const ORG_COLOR = "#059669";
const SIG_COLOR = "#DC2626";

interface CompDimension {
  youthKey: keyof YouthRow;
  orgKey: keyof OrganizerRow;
  label: string;
}

const dimensions: CompDimension[] = [
  { label: "Együttműködés", youthKey: "q13", orgKey: "q26" },
  { label: "Kommunikáció", youthKey: "q9", orgKey: "q23" },
  { label: "Önbizalom", youthKey: "q10", orgKey: "q24" },
  { label: "Nyitottság", youthKey: "q15", orgKey: "q21" },
  { label: "Konfliktuskezelés", youthKey: "q14", orgKey: "q25" },
  { label: "Önismeret", youthKey: "q22", orgKey: "q27" },
];

function extractValues(data: readonly (YouthRow | OrganizerRow)[], key: string): number[] {
  return data.map(d => (d as unknown as Record<string, number>)[key]).filter(v => !isNaN(v) && v >= 1 && v <= 5);
}

export function ComparisonSection({ selectedLocation }: ComparisonSectionProps) {
  const yData = useMemo(() => {
    if (selectedLocation === "all") return youthData;
    return youthData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  const oData = useMemo(() => {
    if (selectedLocation === "all") return organizerData;
    return organizerData.filter(d => d.location === selectedLocation);
  }, [selectedLocation]);

  // Comparable dimensions with Mann-Whitney U test
  const comparisonData = useMemo(() =>
    dimensions.map(dim => {
      const yVals = extractValues(yData, dim.youthKey);
      const oVals = extractValues(oData, dim.orgKey);
      const test = mannWhitneyU(yVals, oVals);
      return {
        dimension: dim.label,
        dimensionLabel: test.stars ? `${dim.label} ${test.stars}` : dim.label,
        youth: parseFloat(getAvg(yData, dim.youthKey).toFixed(2)),
        organizer: parseFloat(getOrgAvg(oData, dim.orgKey).toFixed(2)),
        U: test.U,
        z: test.z,
        p: test.p,
        stars: test.stars,
        significant: test.significant005,
      };
    }),
  [yData, oData]);

  // Overall satisfaction comparison with test
  const satisfactionTest = useMemo(() => {
    const yVals = yData.map(d => d.satisfaction).filter(v => v >= 1 && v <= 5);
    const oVals = oData.map(d => d.overallImpact).filter(v => v >= 1 && v <= 5);
    return mannWhitneyU(yVals, oVals);
  }, [yData, oData]);

  const satisfactionComp = useMemo(() => [
    {
      group: satisfactionTest.stars
        ? `Elégedettség / Hatás ${satisfactionTest.stars}`
        : "Elégedettség / Hatás",
      youth: parseFloat(getAvg(yData, "satisfaction").toFixed(2)),
      organizer: parseFloat(getOrgAvg(oData, "overallImpact").toFixed(2)),
    },
  ], [yData, oData, satisfactionTest]);

  const sigCount = comparisonData.filter(d => d.significant).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Összehasonlító elemzés</h2>
        <p className="text-sm text-muted-foreground">Résztvevők (N={yData.length}) vs. ELTE hallgatók (N={oData.length}) — Mann-Whitney U teszttel</p>
      </div>

      <ChartCard
        title="Készségfejlődés összehasonlítása — Mann-Whitney U teszt"
        id="comparison-skills"
        insight={`${sigCount} dimenzióban találtunk szignifikáns különbséget (p < .05) a két csoport között. A csillagok jelölik a szignifikancia szintjét: * p < .05, ** p < .01, *** p < .001.`}
      >
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="dimensionLabel"
              tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
                const hasStars = payload.value.includes("*");
                const parts = payload.value.split(" ");
                const label = parts[0];
                const stars = parts.slice(1).join(" ");
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={12} textAnchor="middle" fontSize={11} fontFamily="'Source Sans Pro'" fill="hsl(222 47% 11%)">
                      {label}
                    </text>
                    {hasStars && (
                      <text x={0} y={0} dy={24} textAnchor="middle" fontSize={12} fontWeight="bold" fill={SIG_COLOR}>
                        {stars}
                      </text>
                    )}
                  </g>
                );
              }}
              height={50}
            />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const item = comparisonData.find(d => d.dimensionLabel === label);
                return (
                  <div className="bg-card border border-border rounded p-2 text-xs shadow-md">
                    <p className="font-display font-semibold mb-1">{item?.dimension}</p>
                    <p style={{ color: YOUTH_COLOR }}>Fiatalok: {payload[0]?.value}</p>
                    <p style={{ color: ORG_COLOR }}>Hallgatók: {payload[1]?.value}</p>
                    {item && (
                      <div className="mt-1 pt-1 border-t border-border">
                        <p>U = {item.U.toFixed(0)}, z = {item.z.toFixed(2)}</p>
                        <p className={item.significant ? "text-significance font-semibold" : ""}>
                          p {formatP(item.p)} {item.stars}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }}
            />
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
          insight={`Fiatalok elégedettsége: ${satisfactionComp[0]?.youth}/5, Hallgatók észlelt hatása: ${satisfactionComp[0]?.organizer}/5. Mann-Whitney U teszt: p ${formatP(satisfactionTest.p)} ${satisfactionTest.stars}`}
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={satisfactionComp} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="group" tick={{ fontSize: 11 }} width={180} />
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

      {/* Statistical results table */}
      <div className="mt-4 chart-card">
        <h3 className="text-sm font-display font-semibold text-primary mb-3">Mann-Whitney U teszt eredmények</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-primary">Dimenzió</th>
                <th className="text-right py-2 px-3 font-semibold text-primary">M<sub>fiatalok</sub></th>
                <th className="text-right py-2 px-3 font-semibold text-primary">M<sub>hallgatók</sub></th>
                <th className="text-right py-2 px-3 font-semibold text-primary">U</th>
                <th className="text-right py-2 px-3 font-semibold text-primary">z</th>
                <th className="text-right py-2 px-3 font-semibold text-primary">p</th>
                <th className="text-center py-2 pl-3 font-semibold text-primary">Sig.</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row) => (
                <tr key={row.dimension} className={`border-b border-border/50 ${row.significant ? "bg-significance/5" : ""}`}>
                  <td className="py-1.5 pr-4">{row.dimension}</td>
                  <td className="text-right py-1.5 px-3">{row.youth.toFixed(2)}</td>
                  <td className="text-right py-1.5 px-3">{row.organizer.toFixed(2)}</td>
                  <td className="text-right py-1.5 px-3">{row.U.toFixed(0)}</td>
                  <td className="text-right py-1.5 px-3">{row.z.toFixed(2)}</td>
                  <td className="text-right py-1.5 px-3">{formatP(row.p)}</td>
                  <td className={`text-center py-1.5 pl-3 font-bold ${row.significant ? "text-significance" : "text-muted-foreground"}`}>
                    {row.stars || "n.s."}
                  </td>
                </tr>
              ))}
              <tr className={`border-t-2 border-border ${satisfactionTest.significant005 ? "bg-significance/5" : ""}`}>
                <td className="py-1.5 pr-4 font-semibold">Elégedettség / Hatás</td>
                <td className="text-right py-1.5 px-3">{satisfactionComp[0]?.youth.toFixed(2)}</td>
                <td className="text-right py-1.5 px-3">{satisfactionComp[0]?.organizer.toFixed(2)}</td>
                <td className="text-right py-1.5 px-3">{satisfactionTest.U.toFixed(0)}</td>
                <td className="text-right py-1.5 px-3">{satisfactionTest.z.toFixed(2)}</td>
                <td className="text-right py-1.5 px-3">{formatP(satisfactionTest.p)}</td>
                <td className={`text-center py-1.5 pl-3 font-bold ${satisfactionTest.significant005 ? "text-significance" : "text-muted-foreground"}`}>
                  {satisfactionTest.stars || "n.s."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            <span className="text-significance font-bold">*</span> p &lt; .05 &nbsp;
            <span className="text-significance font-bold">**</span> p &lt; .01 &nbsp;
            <span className="text-significance font-bold">***</span> p &lt; .001 &nbsp;
            <span className="text-muted-foreground">n.s.</span> = nem szignifikáns
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Mann-Whitney U teszt (kétoldali), normál approximáció kötéskorrekcióval. 
            N<sub>fiatalok</sub> = {yData.length}, N<sub>hallgatók</sub> = {oData.length}.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Megjegyzés: Az összehasonlított dimenziók tartalmilag hasonló, de nem azonos kérdésekből származnak.
          </p>
        </div>
      </div>
    </div>
  );
}
