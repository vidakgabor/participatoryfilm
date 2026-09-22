import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";
import {
  youthWordFreq, organizerWordFreq,
  youthWordAssociations, organizerWordAssociations,
  youthChangeResponses, youthMemorableExperiences,
  organizerTransformativeExperiences, organizerSkillDevelopment,
  getWordFrequencies,
} from "@/data/openEndedData";

const YOUTH_COLOR = "#2563eb";
const ORG_COLOR = "#059669";
const YOUTH_LIGHT = "#93c5fd";
const ORG_LIGHT = "#6ee7b7";

const nonEmpty = (arr: string[]) => arr.filter(t => t && t.trim().length > 0).length;

function WordCloud({ words, color, lightColor }: { words: { word: string; count: number }[]; color: string; lightColor: string }) {
  const maxCount = words[0]?.count || 1;
  const top30 = words.slice(0, 30);

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center py-4 px-2">
      {top30.map((w, i) => {
        const ratio = w.count / maxCount;
        const fontSize = 11 + ratio * 22;
        const opacity = 0.4 + ratio * 0.6;
        const isTop = i < 5;
        return (
          <span
            key={w.word}
            className="inline-block px-2 py-0.5 rounded transition-transform hover:scale-110 cursor-default"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isTop ? 700 : ratio > 0.5 ? 600 : 400,
              color: isTop ? color : lightColor,
              opacity,
              fontFamily: "'Source Sans Pro', sans-serif",
            }}
            title={`${w.word}: ${w.count}×`}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
}

export function OpenEndedSection() {
  const youthTopWords = useMemo(() => youthWordFreq.slice(0, 15), []);
  const orgTopWords = useMemo(() => organizerWordFreq.slice(0, 15), []);

  const combinedWords = useMemo(() => {
    const allYouth = getWordFrequencies(youthWordAssociations);
    const allOrg = getWordFrequencies(organizerWordAssociations);
    const allWords = new Set([...allYouth.map(w => w.word), ...allOrg.map(w => w.word)]);
    return Array.from(allWords).map(word => ({
      word,
      youth: allYouth.find(w => w.word === word)?.count || 0,
      organizer: allOrg.find(w => w.word === word)?.count || 0,
    })).sort((a, b) => (b.youth + b.organizer) - (a.youth + a.organizer)).slice(0, 12);
  }, []);

  const yAssocN = nonEmpty(youthWordAssociations);
  const oAssocN = nonEmpty(organizerWordAssociations);

  return (
    <div data-pdf-section="openended">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Nyitott kérdések — feltáró szövegelemzés</h2>
        <p className="text-sm text-muted-foreground">
          Automatikus kulcsszógyakoriság és szó szerinti idézetek mindkét csoport szabad szöveges válaszaiból
        </p>
      </div>

      <div className="chart-card mb-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Módszertani megjegyzés: </span>
          az alábbi ábrák <span className="font-semibold text-foreground">automatikus kulcsszó-előfordulást</span> mutatnak
          (magyar stopszavak kiszűrésével és néhány egyszerű szóalak-összevonással), nem dokumentált, kódkönyv alapján végzett
          kvalitatív tematikus elemzést. Az előfordulási számok tehát nem témák gyakoriságát, hanem szavak említésszámát jelentik,
          és arányszámként vagy rangsorként nem értelmezhetők. A szöveges válaszok teljes állománya nem letölthető és nem kereshető
          a dashboardon; csak összesített gyakoriságok és rövid, azonosításra nem alkalmas idézetek jelennek meg.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Válaszdarabszámok: fiatalok asszociációi n={yAssocN}, észlelt változás n={nonEmpty(youthChangeResponses)}, emlékezetes élmény n={nonEmpty(youthMemorableExperiences)};
          hallgatók asszociációi n={oAssocN}, meghatározó élmény n={nonEmpty(organizerTransformativeExperiences)}, készségek n={nonEmpty(organizerSkillDevelopment)}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Szófelhő — Fiatalok asszociációi (6. kérdés)"
          id="youth-wordcloud"
          insight={`A leggyakrabban előforduló kifejezések: „${youthWordFreq[0]?.word}" (${youthWordFreq[0]?.count}×), „${youthWordFreq[1]?.word}" (${youthWordFreq[1]?.count}×), „${youthWordFreq[2]?.word}" (${youthWordFreq[2]?.count}×). Az adat szóelőfordulás, nem témagyakoriság.`}
        >
          <WordCloud words={youthWordFreq} color="#2563eb" lightColor="#60a5fa" />
        </ChartCard>

        <ChartCard
          title="Szófelhő — Hallgatók asszociációi (33. kérdés)"
          id="org-wordcloud"
          insightVariant="organizer"
          insight={`A leggyakrabban előforduló kifejezések: „${organizerWordFreq[0]?.word}" (${organizerWordFreq[0]?.count}×), „${organizerWordFreq[1]?.word}" (${organizerWordFreq[1]?.count}×), „${organizerWordFreq[2]?.word}" (${organizerWordFreq[2]?.count}×). Az adat szóelőfordulás, nem témagyakoriság.`}
        >
          <WordCloud words={organizerWordFreq} color="#059669" lightColor="#34d399" />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Leggyakoribb 15 kifejezés — Fiatalok"
          id="youth-word-freq"
          insight="A lista a szavak nyers említésszámát mutatja a szabad szöveges válaszokban; az eredmény feltáró jellegű."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={youthTopWords} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="word" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={120} />
              <Tooltip formatter={(val: number) => [`${val}×`, "Előfordulás"]} />
              <Bar dataKey="count" fill={YOUTH_COLOR} radius={[0, 3, 3, 0]} barSize={14} animationDuration={600}>
                {youthTopWords.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? YOUTH_COLOR : YOUTH_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Leggyakoribb 15 kifejezés — Hallgatók"
          id="org-word-freq"
          insightVariant="organizer"
          insight="A lista a szavak nyers említésszámát mutatja a szabad szöveges válaszokban; az eredmény feltáró jellegű."
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={orgTopWords} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="word" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={120} />
              <Tooltip formatter={(val: number) => [`${val}×`, "Előfordulás"]} />
              <Bar dataKey="count" fill={ORG_COLOR} radius={[0, 3, 3, 0]} barSize={14} animationDuration={600}>
                {orgTopWords.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? ORG_COLOR : ORG_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard
        title="Szóhasználat egymás mellett — Fiatalok és hallgatók"
        id="word-comparison"
        insight="A két csoport eltérő kérdésre válaszolt, ezért az oszlopok egymás melletti leíró bemutatást szolgálnak, nem csoportkülönbséget mérnek."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combinedWords}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="word" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-25} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 10 }} label={{ value: "említés", position: "insideLeft", fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="youth" name="Fiatalok" fill={YOUTH_COLOR} radius={[3, 3, 0, 0]} barSize={16} />
            <Bar dataKey="organizer" name="Hallgatók" fill={ORG_COLOR} radius={[3, 3, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="chart-card">
          <h3 className="text-sm font-display font-semibold text-primary mb-1">Illusztratív idézetek — Fiatalok</h3>
          <p className="text-[10px] text-muted-foreground mb-3">
            Szó szerinti, de illusztratív válogatás; nem reprezentatív mintája a válaszoknak.
          </p>
          <div className="space-y-2">
            {[
              "„Magabiztosabb lettem másokkal való kommunikációban”",
              "„Befogadóbb vagyok az idegenekkel szemben”",
              "„Végre találtam egy hobbit amiből talán meg is tudok majd élni”",
              "„Rájöttem hogy a filmezés nagyon szuper dolog”",
              "„Nem félek ha idegen emberekkel találkozok”",
            ].map((q, i) => (
              <p key={i} className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3 py-1">
                {q}
              </p>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="text-sm font-display font-semibold text-emerald-700 mb-1">Illusztratív idézetek — Hallgatók</h3>
          <p className="text-[10px] text-muted-foreground mb-3">
            Szó szerinti, de illusztratív válogatás; nem reprezentatív mintája a válaszoknak.
          </p>
          <div className="space-y-2">
            {[
              "„Személyes jelenlét és a közös munka egészen más megismerési lehetőség, mint a médiából értesülni”",
              "„Nem bíztam a pedagógiai készségeimben, de alaptalan volt a félelmem”",
              "„Csoportvezető készség fejlődött, magabiztosabban állok az ilyenhez”",
              "„Jó volt látni, hogy ők is igazából ugyanolyanok, mint amilyen én voltam ennyi idősen”",
              "„Volt egy pont ahol megértették, hogy mi miattuk jöttünk oda”",
            ].map((q, i) => (
              <p key={i} className="text-xs text-muted-foreground italic border-l-2 border-emerald-500/30 pl-3 py-1">
                {q}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
