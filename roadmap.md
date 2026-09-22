# Adatjavítási roadmap (hosszú távú dashboard)

## Kész
- [x] `src/data/statsHelpers.ts` — közös leíró statisztika, hiányzó érték = null (nem 0)
- [x] `src/data/youthData.ts` — újragenerálva az Excelből (N=78), Q24 Likert, Q25 igen/nem, Q26 n=77 nullable, időbélyeg + utánkövetési napok
- [x] `src/data/organizerData.ts` — újragenerálva az Excelből (N=42), Q29–Q32 helyes leképezés, Q15 nyers fordított tétel
- [x] `YouthSection.tsx` — helyes tételcímkék, Q21–Q23 értelmezés, Q24 és Q25 szétválasztva, valós időtáv
- [x] `AcceptanceFutureSection.tsx` — Q26 helyes jelentés (továbbtanulási döntés, n=77), 0-kategória törölve
- [x] `OrganizerSection.tsx` — pontos arányok és nevezők, Q15 fordított tétel külön ábrán, retrospektív megfogalmazás
- [x] `ComparisonSection.tsx` — Mann–Whitney eltávolítva, leíró tartalmi összevetés tételszövegekkel
- [x] `OpenEndedSection.tsx` — kulcsszógyakoriságként jelölve, nem dokumentált tematikus kódolás törölve
- [x] `src/lib/mannWhitney.ts` törölve; típusellenőrzés és böngészős ellenőrzés lefutott
- [x] Ellenőrző értékek egyeznek (elégedettség 4,87; Q21 4,37 / 89,7%; Q26 2,83 n=77; szervezői Q15 2,24; Q32 4,07)

## Nyitott
- (nincs)
