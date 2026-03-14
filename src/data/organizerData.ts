// Parsed and aggregated data from the ELTE organizers Excel (N=42)

export interface OrganizerRow {
  gender: string;
  age: number;
  location: string;
  priorExperience: string;
  q6: number; q7: number; q8: number; q9: number; q10: number;
  q11: number; q12: number; q13: number; q14: number; q15: number;
  q16: number; q17: number; q18: number; q19: number; q20: number;
  q21: number; q22: number; q23: number; q24: number; q25: number;
  q26: number; q27: number; q28: number;
  volunteered: string;
  workedWithDisadvantaged: string;
  wouldParticipateAgain: number;
  overallImpact: number;
}

const rawRows: string[][] = [
  ["nő","20","Mágocs","nem volt","4","4","3","3","4","4","4","5","4","1","4","5","3","3","3","5","4","5","4","4","4","4","4","igen","nem","5","4"],
  ["férfi","25","Mágocs","nem volt","4","5","3","3","4","4","4","4","5","5","4","5","5","4","3","5","4","3","4","4","4","5","4","nem","nem","5","4"],
  ["férfi","22","Mágocs","nem volt","4","4","5","4","4","4","4","4","5","4","4","4","3","4","3","4","4","4","5","4","4","5","5","igen","igen","5","5"],
  ["nő","22","Istvándi","alkalomszerűen","5","5","5","4","3","3","3","4","4","3","4","4","4","4","3","5","3","4","4","3","4","4","5","igen","igen","5","5"],
  ["nő","22","Istvándi","alkalomszerűen","4","5","5","4","3","3","4","3","5","4","5","5","4","3","3","4","4","3","4","4","4","5","5","igen","igen","5","4"],
  ["nő","22","Istvándi","alkalomszerűen","4","3","3","4","4","3","4","3","4","3","4","4","3","4","4","5","3","4","4","3","4","4","5","igen","igen","5","4"],
  ["nő","21","Istvándi","nem volt","3","3","3","3","4","3","3","3","3","3","3","4","4","4","3","4","3","4","4","3","3","4","4","igen","nem","4","3"],
  ["nő","26","Kémes","nem volt","3","3","3","3","3","3","3","4","4","4","4","4","4","3","3","4","4","4","5","4","4","4","5","igen","igen","5","4"],
  ["férfi","24","Kémes","nem volt","4","4","3","3","4","3","3","4","4","4","4","4","3","4","3","4","4","4","4","4","3","4","5","nem","nem","1","3"],
  ["nő","21","Kémes","nem volt","4","4","5","4","4","4","4","4","5","5","5","5","4","4","3","5","4","3","3","4","4","5","5","nem","nem","5","4"],
  ["férfi","23","Kémes","nem volt","4","4","5","4","4","4","3","4","4","4","5","5","4","4","4","5","3","4","4","4","5","5","4","nem","nem","5","4"],
  ["nő","48","Kémes","nem volt","5","4","5","3","3","2","3","4","4","3","4","4","4","4","3","4","3","3","3","3","4","4","4","nem","nem","5","3"],
  ["férfi","21","Sárosd","nem volt","3","3","3","3","2","3","3","3","4","1","4","5","4","3","3","4","4","4","3","3","4","4","3","nem","nem","4","4"],
  ["nő","23","Sárosd","alkalomszerűen","3","3","3","3","4","4","4","5","5","1","4","5","4","4","4","5","4","4","4","3","4","4","4","igen","igen","5","5"],
  ["nő","21","Sárosd","alkalomszerűen","2","3","2","2","3","3","3","4","4","1","3","3","4","3","3","4","3","2","2","3","4","3","4","nem","nem","4","3"],
  ["nő","22","Sárosd","nem volt","3","4","3","3","3","4","4","4","5","1","5","5","4","4","5","5","5","4","5","3","4","5","5","nem","nem","5","5"],
  ["nő","25","Mágocs","alkalomszerűen","4","5","5","4","5","3","3","3","5","1","4","5","4","4","3","5","4","3","3","3","4","5","5","nem","nem","5","4"],
  ["nő","22","Mágocs","alkalomszerűen","4","4","5","4","5","3","3","2","5","1","4","4","4","4","3","4","3","3","3","3","4","4","4","nem","nem","5","4"],
  ["nő","24","Mágocs","alkalomszerűen","4","5","4","4","5","3","3","4","5","1","4","5","3","3","3","4","3","4","4","4","5","5","5","igen","igen","5","5"],
  ["férfi","22","Kémes","alkalomszerűen","4","5","5","4","4","3","3","3","4","1","4","4","4","4","3","5","3","3","4","4","5","5","5","igen","igen","5","5"],
  ["nő","21","Mágocs","nem volt","3","3","3","3","4","3","3","4","4","1","4","5","4","4","4","5","4","4","4","4","4","4","4","igen","igen","5","5"],
  ["nő","21","Mágocs","nem volt","5","4","5","4","4","4","4","4","4","1","3","4","3","3","3","4","4","5","5","5","5","5","5","igen","igen","5","5"],
  ["nő","23","Istvándi","nem volt","4","4","5","4","4","4","4","4","5","1","5","5","4","4","3","5","4","4","4","4","4","5","5","igen","igen","5","5"],
  ["nő","22","Mágocs","nem volt","4","4","5","4","4","4","3","3","5","1","4","4","4","4","3","5","4","4","4","4","4","5","5","igen","igen","5","5"],
  ["nő","24","Istvándi","alkalomszerűen","4","4","4","4","4","2","3","2","4","1","3","3","3","3","3","4","3","4","4","3","4","4","5","igen","igen","5","4"],
  ["nő","22","Pécs","alkalomszerűen","3","4","5","3","4","3","4","4","5","1","4","4","3","4","3","4","3","4","4","4","5","5","5","igen","igen","5","5"],
  ["nő","22","Gilvánfa","alkalomszerűen","4","5","4","4","3","3","2","2","3","3","3","3","3","3","3","4","3","4","3","4","3","3","4","nem","nem","4","4"],
  ["nő","26","Pécs","nem volt","3","3","4","3","3","3","3","2","5","1","4","5","4","5","4","5","4","4","5","3","4","5","5","nem","nem","5","4"],
  ["férfi","21","Pécs","nem volt","4","4","5","4","4","3","3","4","5","1","4","5","4","4","3","5","4","4","4","3","4","5","5","nem","nem","4","4"],
  ["férfi","22","Gilvánfa","alkalomszerűen","3","3","4","4","4","3","3","3","4","1","3","4","4","4","3","5","4","4","3","3","5","5","4","nem","nem","4","4"],
  ["nő","21","Pécs","alkalomszerűen","4","5","5","4","3","4","4","3","5","1","5","5","5","5","4","5","4","4","5","3","4","5","5","nem","nem","5","5"],
  ["nő","20","Somogyszentpál","alkalomszerűen","4","2","3","2","3","2","2","2","2","3","3","3","3","2","2","3","2","3","3","3","3","2","4","igen","nem","4","3"],
  ["nő","26","Somogyszentpál","alkalomszerűen","4","4","5","3","4","4","3","4","5","4","4","5","4","3","3","5","4","4","5","4","5","5","5","nem","nem","5","5"],
  ["nő","23","Gilvánfa","nem volt","4","5","5","3","4","4","3","4","4","1","4","5","4","4","3","5","4","4","5","4","5","5","5","igen","nem","5","4"],
  ["nő","24","Somogyszentpál","nem volt","4","4","4","3","3","3","3","2","5","3","4","5","3","4","3","5","4","4","4","3","4","5","5","nem","nem","5","4"],
  ["férfi","23","Somogyszentpál","nem volt","3","3","4","3","4","3","3","3","5","1","4","4","4","3","3","5","4","4","4","3","5","5","5","nem","nem","4","4"],
  ["férfi","21","Somogyszentpál","alkalomszerűen","3","5","5","3","5","4","5","5","2","4","4","4","4","5","4","5","5","2","2","1","2","2","1","nem","nem","5","3"],
  ["nő","23","Istvándi","rendszeresen","5","4","5","4","5","5","4","4","4","1","5","5","5","5","5","5","4","4","5","4","5","4","4","igen","igen","5","5"],
  ["férfi","20","Somogyszentpál","nem volt","4","1","5","3","3","4","5","5","3","2","5","3","5","5","5","5","5","2","4","2","4","3","2","igen","nem","5","3"],
  ["nő","22","Somogyszentpál","alkalomszerűen","4","3","5","5","4","4","3","4","4","3","4","3","4","4","4","4","4","4","5","3","4","4","3","nem","nem","5","4"],
  ["nő","20","Somogyszentpál","alkalomszerűen","3","4","3","5","3","3","2","4","3","4","4","3","4","4","3","3","2","3","4","2","2","3","4","igen","nem","3","2"],
  ["nő","21","Somogyszentpál","nem volt","4","3","5","2","3","5","4","5","3","4","4","4","3","4","5","5","4","2","5","3","3","3","2","nem","nem","3","2"],
];

export const organizerData: OrganizerRow[] = rawRows.map(r => ({
  gender: r[0],
  age: parseInt(r[1]),
  location: r[2],
  priorExperience: r[3],
  q6: parseInt(r[4]), q7: parseInt(r[5]), q8: parseInt(r[6]),
  q9: parseInt(r[7]), q10: parseInt(r[8]), q11: parseInt(r[9]),
  q12: parseInt(r[10]), q13: parseInt(r[11]), q14: parseInt(r[12]),
  q15: parseInt(r[13]), q16: parseInt(r[14]), q17: parseInt(r[15]),
  q18: parseInt(r[16]), q19: parseInt(r[17]), q20: parseInt(r[18]),
  q21: parseInt(r[19]), q22: parseInt(r[20]), q23: parseInt(r[21]),
  q24: parseInt(r[22]), q25: parseInt(r[23]), q26: parseInt(r[24]),
  q27: parseInt(r[25]), q28: parseInt(r[26]),
  volunteered: r[27],
  workedWithDisadvantaged: r[28],
  wouldParticipateAgain: parseInt(r[29]),
  overallImpact: parseInt(r[30]),
}));

export const orgQuestionLabels: Record<string, string> = {
  q6: "Valódi együttműködés",
  q7: "Fiatalok helyzetének megértése",
  q8: "Biztonságérzet a csoportban",
  q9: "Fiatalok kompetensnek látása",
  q10: "Kölcsönös megértés",
  q11: "Árnyaltabb látásmód",
  q12: "Kevesebb általánosítás",
  q13: "Társadalmi háttér tudatossága",
  q14: "Önismeret fejlődése",
  q15: "Nem változtatott (fordított)",
  q16: "Csökkent távolságtartás",
  q17: "Sztereotípiák felismerése",
  q18: "Empátia növekedése",
  q19: "Érzékenység megbélyegzésre",
  q20: "Strukturális gondolkodás",
  q21: "Roma fiatalokkal nyitottság",
  q22: "Tudatos nyelvhasználat",
  q23: "Kommunikációs készség",
  q24: "Csoportvezetés magabiztossága",
  q25: "Konfliktuskezelés",
  q26: "Együttműködési készség",
  q27: "Önismeret",
  q28: "Új információk magáról",
};

export const orgSkillCategories = {
  collaboration: { label: "Együttműködés a workshopon", keys: ["q6", "q7", "q8", "q9", "q10"] as const },
  socialSensitivity: { label: "Társadalmi érzékenység", keys: ["q11", "q12", "q13", "q16", "q17", "q18", "q19", "q20"] as const },
  pedagogical: { label: "Pedagógiai kompetenciák", keys: ["q21", "q22", "q23", "q24", "q25", "q26"] as const },
  selfDevelopment: { label: "Önfejlődés", keys: ["q14", "q27", "q28"] as const },
};

export const orgLocations = [...new Set(organizerData.map(d => d.location))];

export function getOrgAvg(data: OrganizerRow[], key: keyof OrganizerRow): number {
  const vals = data.map(d => d[key] as number).filter(v => !isNaN(v) && v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}
