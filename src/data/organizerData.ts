// ELTE hallgatók / szervezők — utánkövető kérdőív (N=42)
// Forrás: hosszutavu_szervezők_tisztitva.xlsx / "Munka1" munkalap.
// Minden Likert-tétel 1–5 skálán; a hiányzó válasz null, és kizárásra kerül az átlagokból.
// A 15. tétel fordított megfogalmazású ("A workshop nem változtatott a gondolkodásomon"),
// ezért nyers értékként jelenik meg, külön jelöléssel — nincs átpontozva.
import { avgOf, distributionOf, positivePct, validN, type DistBin } from "./statsHelpers";

export interface OrganizerRow {
  gender: string;
  age: number | null;
  location: string;
  workshopDate: string;
  responseDate: string;
  followUpDays: number;
  preparation: string;
  priorExperience: string;
  q6: number | null; q7: number | null; q8: number | null; q9: number | null;
  q10: number | null; q11: number | null; q12: number | null; q13: number | null;
  q14: number | null; q15: number | null; q16: number | null; q17: number | null;
  q18: number | null; q19: number | null; q20: number | null; q21: number | null;
  q22: number | null; q23: number | null; q24: number | null; q25: number | null;
  q26: number | null; q27: number | null; q28: number | null;
  volunteered: string;
  workedWithGroup: string;
  wouldParticipateAgain: number | null;
  overallImpact: number | null;
}

export const organizerData: OrganizerRow[] = [
  {"gender": "nő", "age": 20, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-04", "followUpDays": 326, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 3, "q9": 3, "q10": 4, "q11": 4, "q12": 4, "q13": 5, "q14": 4, "q15": 1, "q16": 4, "q17": 5, "q18": 3, "q19": 3, "q20": 3, "q21": 5, "q22": 4, "q23": 5, "q24": 4, "q25": 4, "q26": 4, "q27": 4, "q28": 4, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 25, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-04", "followUpDays": 326, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 5, "q8": 3, "q9": 3, "q10": 4, "q11": 4, "q12": 4, "q13": 4, "q14": 5, "q15": 5, "q16": 4, "q17": 5, "q18": 5, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 3, "q24": 4, "q25": 4, "q26": 4, "q27": 5, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 22, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-04", "followUpDays": 326, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 4, "q13": 4, "q14": 5, "q15": 4, "q16": 4, "q17": 4, "q18": 3, "q19": 4, "q20": 3, "q21": 4, "q22": 4, "q23": 4, "q24": 5, "q25": 4, "q26": 4, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 22, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2024-04-04", "followUpDays": 109, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 5, "q7": 5, "q8": 5, "q9": 4, "q10": 3, "q11": 3, "q12": 3, "q13": 4, "q14": 4, "q15": 3, "q16": 4, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 3, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 4, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 22, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2024-04-04", "followUpDays": 109, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 5, "q9": 4, "q10": 3, "q11": 3, "q12": 4, "q13": 3, "q14": 5, "q15": 4, "q16": 5, "q17": 5, "q18": 4, "q19": 3, "q20": 3, "q21": 4, "q22": 4, "q23": 3, "q24": 4, "q25": 4, "q26": 4, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 22, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2024-04-04", "followUpDays": 109, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 3, "q8": 3, "q9": 4, "q10": 4, "q11": 3, "q12": 4, "q13": 3, "q14": 4, "q15": 3, "q16": 4, "q17": 4, "q18": 3, "q19": 4, "q20": 4, "q21": 5, "q22": 3, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 4, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 21, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2024-04-04", "followUpDays": 109, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 3, "q9": 3, "q10": 4, "q11": 3, "q12": 3, "q13": 3, "q14": 3, "q15": 3, "q16": 3, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 4, "q22": 3, "q23": 4, "q24": 4, "q25": 3, "q26": 3, "q27": 4, "q28": 4, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 3},
  {"gender": "nő", "age": 26, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-04", "followUpDays": 676, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 3, "q9": 3, "q10": 3, "q11": 3, "q12": 3, "q13": 4, "q14": 4, "q15": 4, "q16": 4, "q17": 4, "q18": 4, "q19": 3, "q20": 3, "q21": 4, "q22": 4, "q23": 4, "q24": 5, "q25": 4, "q26": 4, "q27": 4, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 24, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-05", "followUpDays": 677, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 3, "q9": 3, "q10": 4, "q11": 3, "q12": 3, "q13": 4, "q14": 4, "q15": 4, "q16": 4, "q17": 4, "q18": 3, "q19": 4, "q20": 3, "q21": 4, "q22": 4, "q23": 4, "q24": 4, "q25": 4, "q26": 3, "q27": 4, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 1, "overallImpact": 3},
  {"gender": "nő", "age": 21, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-11", "followUpDays": 683, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 4, "q13": 4, "q14": 5, "q15": 5, "q16": 5, "q17": 5, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 3, "q24": 3, "q25": 4, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 23, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-23", "followUpDays": 695, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 3, "q13": 4, "q14": 4, "q15": 4, "q16": 5, "q17": 5, "q18": 4, "q19": 4, "q20": 4, "q21": 5, "q22": 3, "q23": 4, "q24": 4, "q25": 4, "q26": 5, "q27": 5, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 48, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-23", "followUpDays": 695, "preparation": "igen", "priorExperience": "nem volt", "q6": 5, "q7": 4, "q8": 5, "q9": 3, "q10": 3, "q11": 2, "q12": 3, "q13": 4, "q14": 4, "q15": 3, "q16": 4, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 4, "q22": 3, "q23": 3, "q24": 3, "q25": 3, "q26": 4, "q27": 4, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 3},
  {"gender": "férfi", "age": 21, "location": "Sárosd", "workshopDate": "2022.12.09-11.", "responseDate": "2024-04-23", "followUpDays": 499, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 3, "q9": 3, "q10": 2, "q11": 3, "q12": 3, "q13": 3, "q14": 4, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 3, "q20": 3, "q21": 4, "q22": 4, "q23": 4, "q24": 3, "q25": 3, "q26": 4, "q27": 4, "q28": 3, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 4},
  {"gender": "nő", "age": 23, "location": "Sárosd", "workshopDate": "2022.12.09-11.", "responseDate": "2024-04-23", "followUpDays": 499, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 3, "q7": 3, "q8": 3, "q9": 3, "q10": 4, "q11": 4, "q12": 4, "q13": 5, "q14": 5, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 4, "q20": 4, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 4, "q28": 4, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 21, "location": "Sárosd", "workshopDate": "2022.12.09-11.", "responseDate": "2024-04-24", "followUpDays": 500, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 2, "q7": 3, "q8": 2, "q9": 2, "q10": 3, "q11": 3, "q12": 3, "q13": 4, "q14": 4, "q15": 1, "q16": 3, "q17": 3, "q18": 4, "q19": 3, "q20": 3, "q21": 4, "q22": 3, "q23": 2, "q24": 2, "q25": 3, "q26": 4, "q27": 3, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 3},
  {"gender": "nő", "age": 22, "location": "Sárosd", "workshopDate": "2022.12.09-11.", "responseDate": "2024-04-24", "followUpDays": 500, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 4, "q8": 3, "q9": 3, "q10": 3, "q11": 4, "q12": 4, "q13": 4, "q14": 5, "q15": 1, "q16": 5, "q17": 5, "q18": 4, "q19": 4, "q20": 5, "q21": 5, "q22": 5, "q23": 4, "q24": 5, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 25, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-25", "followUpDays": 347, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 5, "q9": 4, "q10": 5, "q11": 3, "q12": 3, "q13": 3, "q14": 5, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 3, "q24": 3, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 22, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-25", "followUpDays": 347, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 5, "q11": 3, "q12": 3, "q13": 2, "q14": 5, "q15": 1, "q16": 4, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 4, "q22": 3, "q23": 3, "q24": 3, "q25": 3, "q26": 4, "q27": 4, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 24, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-25", "followUpDays": 347, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 4, "q9": 4, "q10": 5, "q11": 3, "q12": 3, "q13": 4, "q14": 5, "q15": 1, "q16": 4, "q17": 5, "q18": 3, "q19": 3, "q20": 3, "q21": 4, "q22": 3, "q23": 4, "q24": 4, "q25": 4, "q26": 5, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "férfi", "age": 22, "location": "Kémes", "workshopDate": "2022.05.27-29.", "responseDate": "2024-04-26", "followUpDays": 698, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 5, "q9": 4, "q10": 4, "q11": 3, "q12": 3, "q13": 3, "q14": 4, "q15": 1, "q16": 4, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 3, "q23": 3, "q24": 4, "q25": 4, "q26": 5, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 21, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-04-27", "followUpDays": 349, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 3, "q9": 3, "q10": 4, "q11": 3, "q12": 3, "q13": 4, "q14": 4, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 4, "q20": 4, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 4, "q26": 4, "q27": 4, "q28": 4, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 21, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2024-05-03", "followUpDays": 355, "preparation": "igen", "priorExperience": "nem volt", "q6": 5, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 4, "q13": 4, "q14": 4, "q15": 1, "q16": 3, "q17": 4, "q18": 3, "q19": 3, "q20": 3, "q21": 4, "q22": 4, "q23": 5, "q24": 5, "q25": 5, "q26": 5, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 23, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2025-05-12", "followUpDays": 512, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 4, "q13": 4, "q14": 5, "q15": 1, "q16": 5, "q17": 5, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 4, "q26": 4, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 22, "location": "Mágocs", "workshopDate": "2023.05.12-14.", "responseDate": "2025-05-14", "followUpDays": 731, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 4, "q12": 3, "q13": 3, "q14": 5, "q15": 1, "q16": 4, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 4, "q26": 4, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 24, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2025-06-02", "followUpDays": 533, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 4, "q8": 4, "q9": 4, "q10": 4, "q11": 2, "q12": 3, "q13": 2, "q14": 4, "q15": 1, "q16": 3, "q17": 3, "q18": 3, "q19": 3, "q20": 3, "q21": 4, "q22": 3, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 4, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 22, "location": "Pécs", "workshopDate": "2024.05.24-26.", "responseDate": "2025-06-02", "followUpDays": 372, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 3, "q7": 4, "q8": 5, "q9": 3, "q10": 4, "q11": 3, "q12": 4, "q13": 4, "q14": 5, "q15": 1, "q16": 4, "q17": 4, "q18": 3, "q19": 4, "q20": 3, "q21": 4, "q22": 3, "q23": 4, "q24": 4, "q25": 4, "q26": 5, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 22, "location": "Gilvánfa", "workshopDate": "2024.11.15-17.", "responseDate": "2025-06-02", "followUpDays": 197, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 4, "q9": 4, "q10": 3, "q11": 3, "q12": 2, "q13": 2, "q14": 3, "q15": 3, "q16": 3, "q17": 3, "q18": 3, "q19": 3, "q20": 3, "q21": 4, "q22": 3, "q23": 4, "q24": 3, "q25": 4, "q26": 3, "q27": 3, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 4},
  {"gender": "nő", "age": 26, "location": "Pécs", "workshopDate": "2024.05.24-26.", "responseDate": "2025-06-02", "followUpDays": 372, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 4, "q9": 3, "q10": 3, "q11": 3, "q12": 3, "q13": 2, "q14": 5, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 5, "q20": 4, "q21": 5, "q22": 4, "q23": 4, "q24": 5, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 21, "location": "Pécs", "workshopDate": "2024.05.24-26.", "responseDate": "2025-06-03", "followUpDays": 373, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 5, "q9": 4, "q10": 4, "q11": 3, "q12": 3, "q13": 4, "q14": 5, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 4},
  {"gender": "férfi", "age": 22, "location": "Gilvánfa", "workshopDate": "2024.11.15-17.", "responseDate": "2025-11-27", "followUpDays": 375, "preparation": "nem", "priorExperience": "alkalomszerűen", "q6": 3, "q7": 3, "q8": 4, "q9": 4, "q10": 4, "q11": 3, "q12": 3, "q13": 3, "q14": 4, "q15": 1, "q16": 3, "q17": 4, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 3, "q25": 3, "q26": 5, "q27": 5, "q28": 4, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 4},
  {"gender": "nő", "age": 21, "location": "Pécs", "workshopDate": "2024.05.24-26.", "responseDate": "2025-11-27", "followUpDays": 550, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 5, "q8": 5, "q9": 4, "q10": 3, "q11": 4, "q12": 4, "q13": 3, "q14": 5, "q15": 1, "q16": 5, "q17": 5, "q18": 5, "q19": 5, "q20": 4, "q21": 5, "q22": 4, "q23": 4, "q24": 5, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 20, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2025-11-27", "followUpDays": 186, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 2, "q8": 3, "q9": 2, "q10": 3, "q11": 2, "q12": 2, "q13": 2, "q14": 2, "q15": 3, "q16": 3, "q17": 3, "q18": 3, "q19": 2, "q20": 2, "q21": 3, "q22": 2, "q23": 3, "q24": 3, "q25": 3, "q26": 3, "q27": 2, "q28": 4, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 3},
  {"gender": "nő", "age": 26, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2025-11-27", "followUpDays": 186, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 4, "q8": 5, "q9": 3, "q10": 4, "q11": 4, "q12": 3, "q13": 4, "q14": 5, "q15": 4, "q16": 4, "q17": 5, "q18": 4, "q19": 3, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 5, "q25": 4, "q26": 5, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "nő", "age": 23, "location": "Gilvánfa", "workshopDate": "2024.11.15-17.", "responseDate": "2025-11-27", "followUpDays": 375, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 5, "q8": 5, "q9": 3, "q10": 4, "q11": 4, "q12": 3, "q13": 4, "q14": 4, "q15": 1, "q16": 4, "q17": 5, "q18": 4, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 5, "q25": 4, "q26": 5, "q27": 5, "q28": 5, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 24, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2025-11-28", "followUpDays": 187, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 4, "q8": 4, "q9": 3, "q10": 3, "q11": 3, "q12": 3, "q13": 2, "q14": 5, "q15": 3, "q16": 4, "q17": 5, "q18": 3, "q19": 4, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 3, "q26": 4, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "férfi", "age": 23, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2025-11-29", "followUpDays": 188, "preparation": "igen", "priorExperience": "nem volt", "q6": 3, "q7": 3, "q8": 4, "q9": 3, "q10": 4, "q11": 3, "q12": 3, "q13": 3, "q14": 5, "q15": 1, "q16": 4, "q17": 4, "q18": 4, "q19": 3, "q20": 3, "q21": 5, "q22": 4, "q23": 4, "q24": 4, "q25": 3, "q26": 5, "q27": 5, "q28": 5, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 4, "overallImpact": 4},
  {"gender": "férfi", "age": 21, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2026-03-01", "followUpDays": 280, "preparation": "nem", "priorExperience": "alkalomszerűen", "q6": 3, "q7": 5, "q8": 5, "q9": 3, "q10": 5, "q11": 4, "q12": 5, "q13": 5, "q14": 2, "q15": 4, "q16": 4, "q17": 4, "q18": 4, "q19": 5, "q20": 4, "q21": 5, "q22": 5, "q23": 2, "q24": 2, "q25": 1, "q26": 2, "q27": 2, "q28": 1, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 3},
  {"gender": "nő", "age": 23, "location": "Istvándi", "workshopDate": "2023.12.15-17.", "responseDate": "2026-03-01", "followUpDays": 805, "preparation": "igen", "priorExperience": "rendszeresen", "q6": 5, "q7": 4, "q8": 5, "q9": 4, "q10": 5, "q11": 5, "q12": 4, "q13": 4, "q14": 4, "q15": 1, "q16": 5, "q17": 5, "q18": 5, "q19": 5, "q20": 5, "q21": 5, "q22": 4, "q23": 4, "q24": 5, "q25": 4, "q26": 5, "q27": 4, "q28": 4, "volunteered": "igen", "workedWithGroup": "igen", "wouldParticipateAgain": 5, "overallImpact": 5},
  {"gender": "férfi", "age": 20, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2026-03-01", "followUpDays": 280, "preparation": "nem", "priorExperience": "nem volt", "q6": 4, "q7": 1, "q8": 5, "q9": 3, "q10": 3, "q11": 4, "q12": 5, "q13": 5, "q14": 3, "q15": 2, "q16": 5, "q17": 3, "q18": 5, "q19": 5, "q20": 5, "q21": 5, "q22": 5, "q23": 2, "q24": 4, "q25": 2, "q26": 4, "q27": 3, "q28": 2, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 3},
  {"gender": "nő", "age": 22, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2026-03-01", "followUpDays": 280, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 4, "q7": 3, "q8": 5, "q9": 5, "q10": 4, "q11": 4, "q12": 3, "q13": 4, "q14": 4, "q15": 3, "q16": 4, "q17": 3, "q18": 4, "q19": 4, "q20": 4, "q21": 4, "q22": 4, "q23": 4, "q24": 5, "q25": 3, "q26": 4, "q27": 4, "q28": 3, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 5, "overallImpact": 4},
  {"gender": "nő", "age": 20, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2026-03-02", "followUpDays": 281, "preparation": "igen", "priorExperience": "alkalomszerűen", "q6": 3, "q7": 4, "q8": 3, "q9": 5, "q10": 3, "q11": 3, "q12": 2, "q13": 4, "q14": 3, "q15": 4, "q16": 4, "q17": 3, "q18": 4, "q19": 4, "q20": 3, "q21": 3, "q22": 2, "q23": 3, "q24": 4, "q25": 2, "q26": 2, "q27": 3, "q28": 4, "volunteered": "igen", "workedWithGroup": "nem", "wouldParticipateAgain": 3, "overallImpact": 2},
  {"gender": "nő", "age": 21, "location": "Somogyszentpál", "workshopDate": "2025.05.23-25.", "responseDate": "2026-03-03", "followUpDays": 282, "preparation": "igen", "priorExperience": "nem volt", "q6": 4, "q7": 3, "q8": 5, "q9": 2, "q10": 3, "q11": 5, "q12": 4, "q13": 5, "q14": 3, "q15": 4, "q16": 4, "q17": 4, "q18": 3, "q19": 4, "q20": 5, "q21": 5, "q22": 4, "q23": 2, "q24": 5, "q25": 3, "q26": 3, "q27": 3, "q28": 2, "volunteered": "nem", "workedWithGroup": "nem", "wouldParticipateAgain": 3, "overallImpact": 2},
];

export const orgLocations: string[] = ["Gilvánfa", "Istvándi", "Kémes", "Mágocs", "Pécs", "Somogyszentpál", "Sárosd"];

export const orgQuestionLabels: Record<string, string> = {
  "q6": "Valódi együttműködés a közös munkában",
  "q7": "Szemléletformáló beszélgetések",
  "q8": "Biztonságérzet a csoportban",
  "q9": "A fiatalok kompetensnek látása",
  "q10": "Feladatok segítették a kölcsönös megismerést",
  "q11": "Árnyaltabb látásmód",
  "q12": "Kevesebb általánosítás",
  "q13": "Tudatosabb gondolkodás társadalmi kérdésekről",
  "q14": "Önismereti fejlődés a program alatt",
  "q15": "„A workshop nem változtatott a gondolkodásomon” (fordított tétel)",
  "q16": "Csökkent távolságtartás",
  "q17": "Korábbi előítéletek felismerése",
  "q18": "Könnyebb belehelyezkedés mások helyzetébe",
  "q19": "Érzékenység a megbélyegző megfogalmazásokra",
  "q20": "Strukturális okokon való gondolkodás",
  "q21": "Nyitottság roma fiatalokkal való munkára",
  "q22": "Tudatosabb szakmai figyelem",
  "q23": "Kommunikációs készség fejlődése",
  "q24": "Magabiztosabb csoportvezetés",
  "q25": "Konfliktuskezelés",
  "q26": "Együttműködési készség",
  "q27": "Önismereti fejlődés",
  "q28": "Új információk, tudás"
};

export const orgQuestionFullText: Record<string, string> = {
  "q6": "6.   A közös munka során valódi együttműködés alakult ki.",
  "q7": "7.  Voltak olyan beszélgetéseim, amelyekből jobban megértettem a fiatalok helyzetét.",
  "q8": "8.  Biztonságban éreztem magam a csoportban.",
  "q9": "9.  A résztvevő fiatalokat kompetensnek és kreatívnak láttam.",
  "q10": "10.  A feladatok segítették a kölcsönös megértést.",
  "q11": "11.  A workshop óta árnyaltabban látom a hátrányos helyzetű fiatalok helyzetét.",
  "q12": "12.  Kevésbé vagyok hajlamos általánosítani egy-egy tapasztalat alapján.",
  "q13": "13.  Tudatosabban gondolok a társadalmi háttér szerepére (szegénység, intézményi hátrányok).",
  "q14": "14. A program alatt fejlődtem önismereti szinten?",
  "q15": "15.  A workshop nem változtatott a gondolkodásomon.",
  "q16": "16.  Csökkent bennem a távolságtartás hasonló csoportokkal szemben.",
  "q17": "17.  A workshop segített felismerni korábbi sztereotípiáimat.",
  "q18": "18.    A workshop óta könnyebben bele tudom képzelni magam hátrányos helyzetű fiatalok élethelyzetébe.",
  "q19": "19.   Érzékenyebb lettem a megbélyegző megnyilvánulásokra.",
  "q20": "20.  Gyakrabban gondolkodom strukturális okokban, nem egyéni hibáztatásban.",
  "q21": "21.  Nyitottabb lettem roma fiatalokkal való együttműködésre.",
  "q22": "22.   A workshop hatására tudatosabban figyelek a saját nyelvhasználatomra.",
  "q23": "23.  Fejlődött a kommunikációs készségem.",
  "q24": "24.  Magabiztosabban vezetek csoportos helyzeteket.",
  "q25": "25.   Jobban tudok konfliktushelyzetben reagálni.",
  "q26": "26.  Fejlődött az együttműködési készségem.",
  "q27": "27.  Fejlődtem önismereti szinten.",
  "q28": "28.  A workshop alatt új információkat tudtam meg magamról.",
  "wouldParticipateAgain": "31.  Szívesen részt vennék újra hasonló programban.",
  "overallImpact": "32.  Mennyire volt hatással Önre a workshop hosszú távon?",
  "volunteered": "29.  A workshop óta vállaltam önkéntes munkát.",
  "workedWithGroup": "30.  A workshop óta dolgoztam/tanultam hátrányos helyzetű csoporttal."
};

export const orgFollowUp = { minDays: 109, maxDays: 805, medianDays: 352 };

export const orgSkillCategories = {
  collaboration: { label: "Együttműködés a workshopon", keys: ["q6", "q7", "q8", "q10"] },
  socialSensitivity: { label: "Társadalmi érzékenység", keys: ["q11", "q12", "q13", "q16", "q17", "q18", "q19", "q20", "q21"] },
  pedagogical: { label: "Szakmai, pedagógiai készségek", keys: ["q22", "q23", "q24", "q25", "q26"] },
  selfDevelopment: { label: "Önismeret és tudás", keys: ["q14", "q27", "q28"] },
};

export type OrganizerKey = keyof OrganizerRow;
export const getOrgAvg = (data: readonly OrganizerRow[], key: OrganizerKey): number => avgOf(data as readonly Record<string, unknown>[], key as string);
export const getOrgValidN = (data: readonly OrganizerRow[], key: OrganizerKey): number => validN(data as readonly Record<string, unknown>[], key as string);
export const getOrgPositivePct = (data: readonly OrganizerRow[], key: OrganizerKey): number => positivePct(data as readonly Record<string, unknown>[], key as string);
export const getOrgDistribution = (data: readonly OrganizerRow[], key: OrganizerKey): DistBin[] => distributionOf(data as readonly Record<string, unknown>[], key as string);
