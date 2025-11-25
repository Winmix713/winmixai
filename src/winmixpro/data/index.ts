export interface WinmixUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "elemzo" | "megfigyelo";
  roleLabel: string;
  status: "Aktív" | "Szunnyadó" | "Meghívott";
  lastSeenMinutes: number;
  segments: string[];
  locale: string;
}

export const winmixUserMetrics = {
  active: 18,
  analysts: 7,
  invites: 3,
};

export const winmixUsers: WinmixUser[] = [
  {
    id: "usr-1001",
    name: "Kovács Lilla",
    email: "lilla.kovacs@winmix.hu",
    role: "admin",
    roleLabel: "Admin",
    status: "Aktív",
    lastSeenMinutes: 4,
    segments: ["Premier League", "Piaci overlay"],
    locale: "HU",
  },
  {
    id: "usr-1002",
    name: "Szabó Márton",
    email: "marton.szabo@winmix.hu",
    role: "elemzo",
    roleLabel: "Elemző",
    status: "Aktív",
    lastSeenMinutes: 11,
    segments: ["Serie A", "Fázis 9"],
    locale: "HU",
  },
  {
    id: "usr-1003",
    name: "Farkas Petra",
    email: "petra.farkas@winmix.hu",
    role: "megfigyelo",
    roleLabel: "Megfigyelő",
    status: "Szunnyadó",
    lastSeenMinutes: 1380,
    segments: ["Bundesliga"],
    locale: "DE",
  },
  {
    id: "usr-1004",
    name: "Horváth Ákos",
    email: "akos.horvath@winmix.hu",
    role: "elemzo",
    roleLabel: "Elemző",
    status: "Aktív",
    lastSeenMinutes: 26,
    segments: ["NB I", "Ifjúsági"],
    locale: "HU",
  },
  {
    id: "usr-1005",
    name: "Tóth Nóra",
    email: "nora.toth@winmix.hu",
    role: "admin",
    roleLabel: "Admin",
    status: "Meghívott",
    lastSeenMinutes: 0,
    segments: ["Integrációk"],
    locale: "EN",
  },
  {
    id: "usr-1006",
    name: "Varga Sándor",
    email: "sandor.varga@winmix.hu",
    role: "elemzo",
    roleLabel: "Elemző",
    status: "Aktív",
    lastSeenMinutes: 42,
    segments: ["Market intelligence"],
    locale: "HU",
  },
  {
    id: "usr-1007",
    name: "Pap Eszter",
    email: "eszter.pap@winmix.hu",
    role: "megfigyelo",
    roleLabel: "Megfigyelő",
    status: "Aktív",
    lastSeenMinutes: 68,
    segments: ["Women Champions League"],
    locale: "EN",
  },
  {
    id: "usr-1008",
    name: "Balogh Levente",
    email: "levente.balogh@winmix.hu",
    role: "elemzo",
    roleLabel: "Elemző",
    status: "Aktív",
    lastSeenMinutes: 7,
    segments: ["Adatminőség"],
    locale: "HU",
  },
];

export interface WinmixJob {
  id: string;
  name: string;
  category: "Import" | "Modellezés" | "Minőség" | "Piac";
  schedule: string;
  status: "fut" | "sikeres" | "várakozik";
  progress: number;
  owner: string;
  duration: string;
  sla: string;
}

export const winmixJobStats = {
  running: 4,
  automationScore: 93,
  avgDuration: "12p 18mp",
};

export const winmixJobs: WinmixJob[] = [
  {
    id: "job-premier-sync",
    name: "Premier League adat szinkron",
    category: "Import",
    schedule: "15 percenként",
    status: "fut",
    progress: 78,
    owner: "Adatcsapat",
    duration: "02:41",
    sla: "12:00",
  },
  {
    id: "job-challenger-eval",
    name: "Challenger értékelés",
    category: "Modellezés",
    schedule: "óránként",
    status: "sikeres",
    progress: 100,
    owner: "ML műveletek",
    duration: "08:14",
    sla: "15:00",
  },
  {
    id: "job-feedback-digest",
    name: "Visszajelzés feldolgozás",
    category: "Minőség",
    schedule: "napi 4x",
    status: "várakozik",
    progress: 0,
    owner: "Minőség biztosítás",
    duration: "--",
    sla: "20:00",
  },
  {
    id: "job-market-blend",
    name: "Piaci odds összevetés",
    category: "Piac",
    schedule: "30 percenként",
    status: "fut",
    progress: 42,
    owner: "Phase 9",
    duration: "03:58",
    sla: "09:30",
  },
  {
    id: "job-cross-league",
    name: "Kereszt-liga korreláció",
    category: "Modellezés",
    schedule: "2 óránként",
    status: "sikeres",
    progress: 100,
    owner: "Elemzői központ",
    duration: "11:02",
    sla: "16:30",
  },
];

export interface WinmixJobTimelineEntry {
  id: string;
  label: string;
  time: string;
  status: "siker" | "figyelmeztetes" | "hiba";
  detail: string;
}

export const winmixJobTimeline: WinmixJobTimelineEntry[] = [
  {
    id: "tl-1",
    label: "Premier import lezárva",
    time: "08:05",
    status: "siker",
    detail: "1 248 rekord frissült a legújabb fordulóból.",
  },
  {
    id: "tl-2",
    label: "Model újrakalibrálás",
    time: "08:20",
    status: "figyelmeztetes",
    detail: "Challenger eltérés 2.8%-kal nőtt, manuális ellenőrzés szükséges.",
  },
  {
    id: "tl-3",
    label: "Market API limit",
    time: "08:32",
    status: "hiba",
    detail: "BetRadar endpoint 429-et adott, visszakapcsolás 3 perc múlva.",
  },
  {
    id: "tl-4",
    label: "Heatmap újraszámolva",
    time: "08:40",
    status: "siker",
    detail: "Phase 9 dashboard friss metrikákkal szolgál.",
  },
];

export interface WinmixModel {
  id: string;
  name: string;
  type: "champion" | "challenger" | "shadow";
  accuracy: number;
  trend: number;
  league: string;
  freshness: string;
  trafficShare: number;
}

export const winmixModels: WinmixModel[] = [
  {
    id: "mdl-nexus",
    name: "Nexus v3.1",
    type: "champion",
    accuracy: 92.1,
    trend: 1.8,
    league: "Premier League",
    freshness: "22 perc",
    trafficShare: 64,
  },
  {
    id: "mdl-orbit",
    name: "Orbit Pioneer",
    type: "challenger",
    accuracy: 89.4,
    trend: 2.4,
    league: "Serie A",
    freshness: "12 perc",
    trafficShare: 24,
  },
  {
    id: "mdl-vektor",
    name: "Vektor NB",
    type: "shadow",
    accuracy: 84.6,
    trend: -0.4,
    league: "NB I",
    freshness: "41 perc",
    trafficShare: 12,
  },
];

export interface WinmixModelSeriesPoint {
  week: string;
  champion: number;
  challenger: number;
  market: number;
}

export const winmixModelSeries: WinmixModelSeriesPoint[] = [
  { week: "H", champion: 90, challenger: 86, market: 81 },
  { week: "K", champion: 91, challenger: 87, market: 82 },
  { week: "Sze", champion: 92, challenger: 88, market: 83 },
  { week: "Cs", champion: 92.4, challenger: 89.1, market: 83.4 },
  { week: "P", champion: 91.7, challenger: 88.6, market: 82.9 },
  { week: "Szo", champion: 92.8, challenger: 89.4, market: 83.1 },
  { week: "V", champion: 93.2, challenger: 89.9, market: 83.7 },
];

export type HealthLevel = "ok" | "warning" | "critical";

export interface WinmixHealthMetricCell {
  label: string;
  value: string;
  level: HealthLevel;
}

export interface WinmixHealthRow {
  service: string;
  metrics: Record<string, WinmixHealthMetricCell>;
}

export const winmixHealthMetricKeys = [
  { key: "latency", label: "Válaszidő" },
  { key: "errors", label: "Hibaarány" },
  { key: "cpu", label: "CPU" },
  { key: "freshness", label: "Frissesség" },
];

export const winmixHealthMatrix: WinmixHealthRow[] = [
  {
    service: "Adat betöltés",
    metrics: {
      latency: { label: "210 ms", value: "210 ms", level: "ok" },
      errors: { label: "0.8%", value: "0.8%", level: "warning" },
      cpu: { label: "62%", value: "62%", level: "ok" },
      freshness: { label: "19 perc", value: "19 perc", level: "critical" },
    },
  },
  {
    service: "Model szolgáltatás",
    metrics: {
      latency: { label: "148 ms", value: "148 ms", level: "ok" },
      errors: { label: "0.3%", value: "0.3%", level: "ok" },
      cpu: { label: "71%", value: "71%", level: "warning" },
      freshness: { label: "11 perc", value: "11 perc", level: "ok" },
    },
  },
  {
    service: "Phase 9 blending",
    metrics: {
      latency: { label: "182 ms", value: "182 ms", level: "ok" },
      errors: { label: "1.3%", value: "1.3%", level: "warning" },
      cpu: { label: "83%", value: "83%", level: "warning" },
      freshness: { label: "6 perc", value: "6 perc", level: "ok" },
    },
  },
  {
    service: "Vizualizáció",
    metrics: {
      latency: { label: "302 ms", value: "302 ms", level: "warning" },
      errors: { label: "0.2%", value: "0.2%", level: "ok" },
      cpu: { label: "51%", value: "51%", level: "ok" },
      freshness: { label: "15 perc", value: "15 perc", level: "warning" },
    },
  },
];

export interface WinmixHealthAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  timestamp: string;
}

export const winmixHealthAlerts: WinmixHealthAlert[] = [
  {
    id: "alert-1",
    severity: "warning",
    title: "Piaci API limit elérése",
    description: "BetRadar 429-es választ adott, 3 perc múlva újrapróbáljuk.",
    timestamp: "08:32",
  },
  {
    id: "alert-2",
    severity: "info",
    title: "Frissesség küszöb közelében",
    description: "Premier League feed 19 perce frissült, backup útvonal kész.",
    timestamp: "08:40",
  },
];

export interface WinmixIntegration {
  id: string;
  name: string;
  owner: string;
  status: "configured" | "partial" | "missing";
  keys: string[];
  lastSync: string;
  description: string;
}

export const winmixIntegrations: WinmixIntegration[] = [
  {
    id: "gh",
    name: "GitHub Actions",
    owner: "DevOps",
    status: "configured",
    keys: ["GITHUB_TOKEN", "GITHUB_REPOSITORY"],
    lastSync: "08:15",
    description: "Model pipeline build + release.",
  },
  {
    id: "linear",
    name: "Linear",
    owner: "PMO",
    status: "partial",
    keys: ["LINEAR_API_KEY"],
    lastSync: "07:58",
    description: "Roadmap synk, backlog import.",
  },
  {
    id: "slack",
    name: "Slack",
    owner: "Ops",
    status: "configured",
    keys: ["SLACK_WEBHOOK_URL"],
    lastSync: "08:34",
    description: "Figyelmeztetések és Phase 9 update.",
  },
  {
    id: "sentry",
    name: "Sentry",
    owner: "Frontend",
    status: "partial",
    keys: ["VITE_SENTRY_DSN"],
    lastSync: "07:41",
    description: "UI hibák, mobil fallback.",
  },
  {
    id: "cf",
    name: "Cloudflare Turnstile",
    owner: "Security",
    status: "missing",
    keys: ["VITE_TURNSTILE_KEY"],
    lastSync: "--",
    description: "Belépési védelmi réteg aktiválása.",
  },
];

export const winmixStatLeagues = ["Premier League", "Serie A", "NB I"] as const;
export const winmixStatRanges = ["Utolsó 5 forduló", "30 nap", "Szezon"] as const;

export type WinmixLeague = (typeof winmixStatLeagues)[number];

export const winmixGoalDistributions: Record<WinmixLeague, Array<{ range: string; matches: number }>> = {
  "Premier League": [
    { range: "0-1 gól", matches: 6 },
    { range: "2-3 gól", matches: 14 },
    { range: "4-5 gól", matches: 5 },
    { range: "6+ gól", matches: 1 },
  ],
  "Serie A": [
    { range: "0-1 gól", matches: 5 },
    { range: "2-3 gól", matches: 11 },
    { range: "4-5 gól", matches: 4 },
    { range: "6+ gól", matches: 0 },
  ],
  "NB I": [
    { range: "0-1 gól", matches: 4 },
    { range: "2-3 gól", matches: 9 },
    { range: "4-5 gól", matches: 3 },
    { range: "6+ gól", matches: 1 },
  ],
};

export const winmixScorelineLeaders: Record<WinmixLeague, Array<{ scoreline: string; count: number; trend: number }>> = {
  "Premier League": [
    { scoreline: "2-1", count: 5, trend: 1 },
    { scoreline: "1-1", count: 4, trend: -1 },
    { scoreline: "3-1", count: 3, trend: 0 },
  ],
  "Serie A": [
    { scoreline: "1-0", count: 6, trend: 2 },
    { scoreline: "2-0", count: 3, trend: 0 },
    { scoreline: "1-1", count: 3, trend: -1 },
  ],
  "NB I": [
    { scoreline: "2-1", count: 4, trend: 1 },
    { scoreline: "3-2", count: 2, trend: 1 },
    { scoreline: "1-0", count: 2, trend: 0 },
  ],
};

export interface WinmixQualityFlag {
  id: string;
  league: WinmixLeague;
  description: string;
  severity: "medium" | "high";
}

export const winmixQualityFlags: WinmixQualityFlag[] = [
  {
    id: "flag-1",
    league: "Premier League",
    description: "Chelsea - Spurs mérkőzéshez hiányzó piaci odds.",
    severity: "high",
  },
  {
    id: "flag-2",
    league: "Serie A",
    description: "1-1 scoreline duplikáció az Empoli meccssorban.",
    severity: "medium",
  },
];

export interface WinmixFeedbackEntry {
  id: string;
  submitter: string;
  channel: string;
  message: string;
  status: "nyitott" | "feldolgozva";
  priority: "magas" | "közepes" | "alacsony";
  submittedAt: string;
}

export const winmixFeedbackEntries: WinmixFeedbackEntry[] = [
  {
    id: "fb-1",
    submitter: "marton.szabo@winmix.hu",
    channel: "Slack #phase9",
    message: "Az új underdog jelzés túl agresszívan blokkol.",
    status: "nyitott",
    priority: "magas",
    submittedAt: "08:18",
  },
  {
    id: "fb-2",
    submitter: "eszter.pap@winmix.hu",
    channel: "Email",
    message: "Hiányzik női BL scoreboard a stat lapról.",
    status: "nyitott",
    priority: "közepes",
    submittedAt: "07:56",
  },
  {
    id: "fb-3",
    submitter: "lilla.kovacs@winmix.hu",
    channel: "Linear",
    message: "Dashboard hero chart mobilon elcsúszik.",
    status: "feldolgozva",
    priority: "alacsony",
    submittedAt: "06:42",
  },
];

export interface WinmixPredictionPoint {
  label: string;
  model: number;
  crowd: number;
  market: number;
}

export const winmixPredictionAccuracy: WinmixPredictionPoint[] = [
  { label: "H", model: 91, crowd: 84, market: 82 },
  { label: "K", model: 92, crowd: 85, market: 82.5 },
  { label: "Sze", model: 92.4, crowd: 84.2, market: 82.1 },
  { label: "Cs", model: 91.8, crowd: 83.9, market: 81.7 },
  { label: "P", model: 93.1, crowd: 85.3, market: 82.2 },
  { label: "Szo", model: 93.4, crowd: 85.6, market: 82.4 },
  { label: "V", model: 93.8, crowd: 85.9, market: 82.7 },
];

export interface WinmixPredictionRow {
  id: string;
  match: string;
  league: string;
  kickoff: string;
  modelPick: string;
  confidence: number;
  marketDelta: number;
}

export const winmixUpcomingPredictions: WinmixPredictionRow[] = [
  {
    id: "pred-1",
    match: "Arsenal vs. Newcastle",
    league: "Premier League",
    kickoff: "Ma 20:30",
    modelPick: "Hazai győzelem",
    confidence: 74,
    marketDelta: 6,
  },
  {
    id: "pred-2",
    match: "Inter vs. Bologna",
    league: "Serie A",
    kickoff: "Ma 18:45",
    modelPick: "2.5 gól felett",
    confidence: 68,
    marketDelta: 4,
  },
  {
    id: "pred-3",
    match: "Fradi vs. Kisvárda",
    league: "NB I",
    kickoff: "Holnap 17:00",
    modelPick: "BTTS Igen",
    confidence: 64,
    marketDelta: 3,
  },
];

export interface WinmixPhase9SettingsState {
  collaborative: boolean;
  temporalDecay: number;
  crowdWeight: number;
  marketMode: "off" | "test" | "prod";
  freshnessMinutes: number;
}

export const winmixPhase9Defaults: WinmixPhase9SettingsState = {
  collaborative: true,
  temporalDecay: 32,
  crowdWeight: 38,
  marketMode: "test",
  freshnessMinutes: 24,
};

export interface WinmixThemePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  glass: string;
  contrast: string;
  status: "stabil" | "kísérleti";
}

export const winmixThemeLibrary: WinmixThemePreset[] = [
  {
    id: "theme-aurora",
    name: "Aurora",
    description: "Emerald + indigó átmenet, admin fő téma",
    accent: "from-emerald-400 to-cyan-400",
    glass: "bg-white/10",
    contrast: "sötét",
    status: "stabil",
  },
  {
    id: "theme-neon",
    name: "Neon Ember",
    description: "Narancs árnyalat, piaci fókuszú lapokhoz",
    accent: "from-orange-400 to-pink-500",
    glass: "bg-white/8",
    contrast: "sötét",
    status: "kísérleti",
  },
  {
    id: "theme-fjord",
    name: "Fjord",
    description: "Kék-lila gradient, monitoring nézet",
    accent: "from-sky-400 to-indigo-500",
    glass: "bg-white/12",
    contrast: "világos",
    status: "stabil",
  },
  {
    id: "theme-slate",
    name: "Slate Glow",
    description: "Semleges, audit és riport lapok",
    accent: "from-slate-200 to-slate-50",
    glass: "bg-white/6",
    contrast: "világos",
    status: "kísérleti",
  },
];

export interface WinmixUiControl {
  id: string;
  name: string;
  surface: string;
  status: "stabil" | "figyelni";
  dependsOn: string[];
  owner: string;
}

export const winmixUiControls: WinmixUiControl[] = [
  {
    id: "ui-prediction-card",
    name: "Predikció kártya",
    surface: "Dashboard",
    status: "stabil",
    dependsOn: ["Pontosság grafikon", "Odds modul", "Piaci divergencia"],
    owner: "Frontend",
  },
  {
    id: "ui-market-panel",
    name: "Market overlay",
    surface: "Phase 9",
    status: "figyelni",
    dependsOn: ["Odds modul", "Élő API", "Jogosultság chip"],
    owner: "Phase 9",
  },
  {
    id: "ui-job-timeline",
    name: "Job idővonal",
    surface: "Automatizáció",
    status: "stabil",
    dependsOn: ["Audit log", "SLA badge"],
    owner: "Ops UI",
  },
  {
    id: "ui-theme-tuner",
    name: "Téma menedzser",
    surface: "Design System",
    status: "figyelni",
    dependsOn: ["Glass preset", "Color token"],
    owner: "DesignOps",
  },
];
