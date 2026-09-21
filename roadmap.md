# Adatjavítási roadmap (hosszú távú dashboard)

## Kész
- [x] `src/data/statsHelpers.ts` — közös leíró statisztika, hiányzó érték = null (nem 0)
- [x] `src/data/youthData.ts` — újragenerálva az Excelből (N=78), Q24 Likert, Q25 igen/nem, Q26 n=77 nullable, időbélyeg + utánkövetési napok
- [x] `src/data/organizerData.ts` — újragenerálva az Excelből (N=42), Q29–Q32 helyes leképezés, Q15 nyers fordított tétel

## Hátralévő
- [ ] `YouthSection.tsx` — helyes tételcímkék, Q21/Q22/Q23 értelmezés, Q24 vs Q25 szétválasztása, valós időtáv szöveg
- [ ] `AcceptanceFutureSection.tsx` — Q26 helyes jelentés (továbbtanulási döntés, n=77), 0-kategória törlése
- [ ] `OrganizerSection.tsx` — pontos arányok/nevezők, Q15 fordított tétel jelölése, retrospektív megfogalmazás
- [ ] `ComparisonSection.tsx` — Mann–Whitney eltávolítása, leíró tartalmi összevetés
- [ ] `OpenEndedSection.tsx` — kulcsszógyakoriság egyértelmű jelölése, nem dokumentált tematikus kódolás eltávolítása
- [ ] Módszertani megjegyzés (változó időtávú retrospektív utánkövetés) + típusellenőrzés/build
