import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ChartCard } from "./ChartCard";
import {
  youthWordFreq, organizerWordFreq,
  youthThemes, organizerSkillThemes,
  youthWordAssociations, organizerWordAssociations,
  getWordFrequencies,
} from "@/data/openEndedData";

const YOUTH_COLOR = "#2563eb";
const ORG_COLOR = "#059669";
const YOUTH_LIGHT = "#93c5fd";
const ORG_LIGHT = "#6ee7b7";

// CSS Word Cloud component
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
  // Top 15 words for bar charts
  const youthTopWords = useMemo(() => youthWordFreq.slice(0, 15), []);
  const orgTopWords = useMemo(() => organizerWordFreq.slice(0, 15), []);

  // Combined word cloud comparison
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

  // Filter out "Nem észlelt változást" for the positive themes
  const positiveYouthThemes = useMemo(() =>
    youthThemes.filter(t => t.theme !== "Nem észlelt változást"),
  []);
  const noChangeRate = useMemo(() =>
    youthThemes.find(t => t.theme === "Nem észlelt változást")?.pct || 0,
  []);

  return (
    <div data-pdf-section="openended">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-primary">Nyitott kérdések elemzése</h2>
        <p className="text-sm text-muted-foreground">Szöveges válaszok tematikus és szógyakorisági elemzése — mindkét csoport</p>
      </div>

      {/* Word Clouds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Szófelhő — Fiatalok asszociációi"
          id="youth-wordcloud"
          insight={`A fiatalok leggyakrabban a „${youthWordFreq[0]?.word}" (${youthWordFreq[0]?.count}×), „${youthWordFreq[1]?.word}" (${youthWordFreq[1]?.count}×) és „${youthWordFreq[2]?.word}" (${youthWordFreq[2]?.count}×) szavakat említették a workshoppal kapcsolatban.`}
        >
          <WordCloud words={youthWordFreq} color="#2563eb" lightColor="#60a5fa" />
        </ChartCard>

        <ChartCard
          title="Szófelhő — Szervezők asszociációi"
          id="org-wordcloud"
          insightVariant="organizer"
          insight={`A szervezők leggyakrabban a „${organizerWordFreq[0]?.word}" (${organizerWordFreq[0]?.count}×), „${organizerWordFreq[1]?.word}" (${organizerWordFreq[1]?.count}×) és „${organizerWordFreq[2]?.word}" (${organizerWordFreq[2]?.count}×) szavakat társították a programhoz.`}
        >
          <WordCloud words={organizerWordFreq} color="#059669" lightColor="#34d399" />
        </ChartCard>
      </div>

      {/* Word Frequency Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Top 15 szó — Fiatalok"
          id="youth-word-freq"
          insight="A fiatalok válaszaiban a szórakozás, barátság és a filmezéshez kapcsolódó szavak dominálnak — a program pozitív élményként rögzült."
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
          title="Top 15 szó — Szervezők"
          id="org-word-freq"
          insightVariant="organizer"
          insight="A szervezők asszociációiban a közösség, kreativitás és a gyerekek dominálnak — a szakmai élmény és a társadalmi hatás egyaránt megjelenik."
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

      {/* Thematic Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Tematikus elemzés — Fiatalok változásai (Q27)"
          id="youth-themes"
          insight={`A fiatalok ${100 - noChangeRate}%-a észlelt változást: a kommunikáció és a kapcsolatok erősödése a leggyakoribb téma. ${noChangeRate}% nem tudott konkrét változást megnevezni.`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={positiveYouthThemes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: "említések száma", position: "insideBottom", fontSize: 10, offset: -2 }} />
              <YAxis type="category" dataKey="theme" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={160} />
              <Tooltip
                formatter={(val: number, _name: string, props: any) => {
                  const item = positiveYouthThemes[props.index];
                  return [`${val} említés (${item?.pct}%)`, ""];
                }}
              />
              <Bar dataKey="count" fill={YOUTH_COLOR} radius={[0, 3, 3, 0]} barSize={16} animationDuration={600}>
                {positiveYouthThemes.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? YOUTH_COLOR : YOUTH_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Készségfejlődés témái — Szervezők (Q35)"
          id="org-skill-themes"
          insightVariant="organizer"
          insight="A szervezők leginkább a kommunikáció, csoportvezetés és együttműködés terén észleltek fejlődést — ezek a facilitátori szerep kulcskompetenciái."
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={organizerSkillThemes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: "említések száma", position: "insideBottom", fontSize: 10, offset: -2 }} />
              <YAxis type="category" dataKey="theme" tick={{ fontSize: 10, fontFamily: "'Source Sans Pro'" }} width={140} />
              <Tooltip
                formatter={(val: number, _name: string, props: any) => {
                  const item = organizerSkillThemes[props.index];
                  return [`${val} említés (${item?.pct}%)`, ""];
                }}
              />
              <Bar dataKey="count" fill={ORG_COLOR} radius={[0, 3, 3, 0]} barSize={16} animationDuration={600}>
                {organizerSkillThemes.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? ORG_COLOR : ORG_LIGHT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Comparative word usage */}
      <ChartCard
        title="Szóhasználat összehasonlítása — Fiatalok vs. Szervezők"
        id="word-comparison"
        insight="A fiatalok a szórakozás és barátság szavakat használják leggyakrabban, míg a szervezők a közösség, kreativitás és a gyerekek szavakat — a két csoport eltérő perspektívából értékeli a programot."
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combinedWords}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="word" tick={{ fontSize: 9, fontFamily: "'Source Sans Pro'" }} angle={-25} textAnchor="end" height={70} />
            <YAxis tick={{ fontSize: 10 }} label={{ value: "említések", position: "insideLeft", fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="youth" name="Fiatalok" fill={YOUTH_COLOR} radius={[3, 3, 0, 0]} barSize={16} />
            <Bar dataKey="organizer" name="Szervezők" fill={ORG_COLOR} radius={[3, 3, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Notable quotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="chart-card">
          <h3 className="text-sm font-display font-semibold text-primary mb-3">Kiemelkedő válaszok — Fiatalok</h3>
          <div className="space-y-2">
            {[
              "\u201EMagabiztosabb lettem m\u00E1sokkal val\u00F3 kommunik\u00E1ci\u00F3ban\u201D",
              "\u201EBefogad\u00F3bb vagyok az idegenekkel szemben\u201D",
              "\u201EV\u00E9gre tal\u00E1ltam egy hobbit amib\u0151l tal\u00E1n meg is tudok majd \u00E9lni\u201D",
              "\u201ER\u00E1j\u00F6ttem hogy a filmez\u00E9s nagyon szuper dolog\u201D",
              "\u201ENem f\u00E9lek ha idegen emberekkel tal\u00E1lkozok\u201D",
              "\u201ENagyon nyitott szem\u00E9lyis\u00E9g vagyok \u00E9s tanuls\u00E1gos volt megismerni az ottani emberek \u00E9letfelfog\u00E1s\u00E1t\u201D",
            ].map((q, i) => (
              <p key={i} className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3 py-1">
                {q}
              </p>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="text-sm font-display font-semibold text-emerald-700 mb-3">Kiemelkedő válaszok — Szervezők</h3>
          <div className="space-y-2">
            {[
              "\u201ESzem\u00E9lyes jelenl\u00E9t \u00E9s a k\u00F6z\u00F6s munka eg\u00E9szen m\u00E1s megismer\u00E9si lehet\u0151s\u00E9g, mint a m\u00E9di\u00E1b\u00F3l \u00E9rtes\u00FClni\u201D",
              "\u201ER\u00E1j\u00F6ttem hogy mennyire m\u00E1sk\u00E9pp l\u00E1tj\u00E1k a vil\u00E1got, a vide\u00F3k elk\u00E9sz\u00EDt\u00E9s\u00E9vel ki tudt\u00E1k adni magukb\u00F3l az \u00E9rz\u00E9seiket\u201D",
              "\u201ENem b\u00EDztam a pedag\u00F3giai k\u00E9szs\u00E9geimben, de alaptalan volt a f\u00E9lelmem\u201D",
              "\u201ECsoportvezet\u0151 k\u00E9szs\u00E9g fejl\u0151d\u00F6tt, magabiztosabban \u00E1llok az ilyenhez\u201D",
              "\u201EJ\u00F3 volt l\u00E1tni, hogy \u0151k is igaz\u00E1b\u00F3l ugyanolyanok, mint amilyen \u00E9n voltam ennyi id\u0151sen\u201D",
              "\u201EVolt egy pont ahol meg\u00E9rtett\u00E9k, hogy mi miattuk j\u00F6tt\u00FCnk oda\u201D",
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
