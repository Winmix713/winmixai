# WinmixPro Admin Prototípus

A WinmixPro admin felület (oldalak 5–15) egy teljesen kliens oldali prototípus, amely a `src/winmixpro` könyvtár alatt található komponensekre, adathalmazokra és segédfüggvényekre épül. A cél az volt, hogy a végleges dashboard élmény (oldalanként magyar tartalommal) demózható legyen valódi backend kapcsolat nélkül.

## Elérhető oldalak és útvonalak

| Útvonal | Modul | Rövid leírás |
| --- | --- | --- |
| `/winmixpro/users` | **Felhasználók** | Jogosultságok, szűrők, aktív státuszok, szerepkör alapú lokalizált táblázat |
| `/winmixpro/jobs` | **Folyamatok** | Job kártyák, állapot kapcsolók, timeline widget |
| `/winmixpro/models` | **Model vezérlő** | Champion/challenger idősor, trafikelosztás, kártyák |
| `/winmixpro/health` | **Rendszer egészség** | Heatmap, aktív riasztások, SLA metrikák |
| `/winmixpro/integrations` | **Integrációk** | GitHub/Linear/Slack/Sentry mock státusz, ellenőrzés gomb |
| `/winmixpro/stats` | **Adatstatisztikák** | Gól eloszlás grafikon, scoreline lista, minőségi zászlók |
| `/winmixpro/feedback` | **Visszajelzés inbox** | Magyar inbox lista, státusz kapcsolás localStorage-ból |
| `/winmixpro/predictions` | **Predikciók** | Pontosság összevetés (model vs crowd vs piac) + közelgő mérkőzések |
| `/winmixpro/phase9` | **Phase 9 vezérlő** | Temporal decay, crowd súly és piaci mód beállítások |
| `/winmixpro/themes` | **Téma könyvtár** | Glass preset kártyák, kedvencek és reset action |
| `/winmixpro/ui-controls` | **UI kontroll mátrix** | Függőségi mátrix és pin lista |

A belső navigáció metaadatait a `src/winmixpro/constants.ts` fájlban található `WINMIX_PRO_NAV_SECTIONS` tömb tartalmazza; ezt használja a desktop sidebar és a mobil sheet menü is, így minden útvonal egységesen kap aktív állapotot.

## Mock adatok

- A teljes adatforrás a `src/winmixpro/data/index.ts` fájlban él (felhasználók, job timeline, modellek, integrációk, statisztikák stb.).
- A típusdefiníciók ugyanebben a fájlban találhatók, így a lapok típusbiztosan dolgoznak a mintákkal.
- Szükség esetén új mezők / magyar szövegek itt egészíthetők ki, minden oldal kizárólag innen olvas.

## localStorage kulcsok és reset

A módosítható állapotokat a `usePersistentState` hook írja-olvassa. A kulcsok listája a `WINMIX_PRO_STORAGE_KEYS` konstansban érhető el (pl. `winmixpro-users-filter`, `winmixpro-job-state`, `winmixpro-theme-active`).

- A **Téma könyvtár** oldalon található „localStorage reset” gomb végigiterál ezen a listán és törli az összes WinmixPro kulcsot.
- Dokumentációs célra a `docs/winmixpro.md` is rögzíti ezt a folyamatot – manuális resethez a böngésző konzolban futtatható: `WINMIX_PRO_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))`.

## Reszponzív viselkedés és animációk

- Mobilon a sidebar automatikusan eltűnik, helyette a `WinmixProMobileHeader` egy `Sheet` alapú menüt kínál.
- A fő tartalom `winmixpro-scroll` osztályt kapott, amely egyedi, vékony görgetősávval jelenik meg.
- A `WinmixProPage` komponens minden oldalon shimmer skeletont és finom `fade-in` animációt használ a mock betöltés érzékeltetéséhez.
- A kártyák „glass” stílusúak (`glass-card` utility), és grid elrendezésben 1 oszlopról 2/3 oszlopra váltanak nagyobb kijelzőn.

## Navigáció és belépési pont

A WinmixPro felület bármely oldaláról elérhető a `/winmixpro` útvonal, a router automatikusan a felhasználói oldalra (`/winmixpro/users`) irányítja a látogatót. A meglévő admin felület (`/admin`) továbbra is Supabase-alapú, a WinmixPro rész OTT fut, ahol a prototípusokra van szükség.

## QA és parancsok

Az új felület kizárólag frontend oldalon fut, így a klasszikus minőségbiztosítás továbbra is:

```bash
npm run lint
npm run test
npm run build
```

A `finish` folyamat automatikusan futtatja ezeket, így a WinmixPro kód hozzáadása nem igényel extra lépést.
