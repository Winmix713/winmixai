# WinMix TipsterHub – Integrated Intelligence Platform (Phases 3–9)

WinMix TipsterHub is an end-to-end football analytics and prediction platform that now consolidates every capability delivered across phases 3 through 9 into a single cohesive system. The application blends automated data ingestion, model evaluation, cross-league intelligence, monitoring, and self-improving market collaboration features on top of a modern React + Supabase stack.

---

## 🏗️ Platform Architecture

| Layer | Technologies | Responsibilities |
| --- | --- | --- |
| **Frontend** | React (Vite), TypeScript, Tailwind, shadcn-ui, TanStack Query, React Router | SPA experience with feature-specific dashboards (jobs, analytics, models, cross-league, monitoring, phase 9). Manages routing, state, visualizations, real-time feedback, and user interactions. |
| **Integrations** | Supabase SDK, Supabase Edge Functions | Secure data operations (auth, tables) and custom Edge Functions for jobs, analytics, and phase 9 services. Edge Functions expose REST-like endpoints that the client consumes via the `supabase.functions.invoke` calls. |
| **Domain Logic** | `/src/integrations`, `/src/lib`, `/src/types` | Encapsulates domain-specific contracts (job definitions, model metrics, monitoring KPIs, phase 9 intelligence) and shared utilities that standardize payloads across features. |
| **Analytics & Automation** | Supabase tables, background jobs | Phase 3 cron scheduling, Phase 4 feedback loop aggregation, Champion/Challenger orchestration, temporal decay, and collaborative market learning pipelines. |

Key data flow:
1. **Scheduled Jobs (Phase 3)** wake via Supabase Edge Functions and emit job state/log updates that the frontend consumes via TanStack Query.
2. **Feedback Loop (Phase 4)** pushes prediction outcomes back into Supabase tables, feeding analytics, model comparisons, and dashboards.
3. **Champion / Challenger Framework (Phase 6)** monitors model families, triggering promotions, demotions, and retraining requests.
4. **Cross-League Intelligence (Phase 7)** unifies league feeds to produce correlation heatmaps, radar differentials, and strategic insights.
5. **Monitoring & Visualization (Phase 8)** exposes system health, data freshness, compute loads, and anomaly detection dashboards.
6. **Collaborative Market Intelligence (Phase 9)** layers temporal decay weighting, self-improvement loops, and market blending to enhance predictive precision.

---

## 🚀 Feature Overview by Phase

### Phase 3 – Scheduled Jobs & Automation
- Jobs list, status controls, manual triggers, log viewers (`/jobs`).
- Supabase Edge Functions: `jobs-list`, `jobs-logs`, `jobs-toggle`, `jobs-trigger`.
- UI components: `JobStatusCard`, `JobLogsDialog`, adaptive skeleton loaders.

### Phase 4 – Feedback Loop & Model Evaluation
- Analytics workspace (`/analytics`) with model performance charts, feedback forms, and post-match evaluation flows.
- Integrations for performance snapshots, calibration metrics, automated retraining flags.
- Supabase-driven feedback loop that closes the model refinement process.

### Phase 6 – Champion / Challenger Framework
- Model management hub (`/models`) for champion/challenger insights, promotions, audit history, and feature experiments.
- Domain types under `src/types/models.ts` and service helpers in `src/integrations/models/service.ts`.

### Phase 7 – Cross-League Intelligence
- Cross-league dashboard (`/crossleague`) with correlation heatmaps, league comparison radar charts, and meta-pattern surfacing.
- Smart refetching, league filters, and storyline highlights for analysts.

### Phase 8 – Monitoring & Visualization
- Real-time monitoring center (`/monitoring`) showing compute loads, system health cards, anomaly watchlists, and SLA tracking.
- Visual components under `src/components/monitoring`.

### Phase 9 – Advanced Collaborative Market Intelligence
- Holistic intelligence suite (`/phase9`) combining collaborative analysis, market integration, temporal decay, and self-improving loops.
- Modular components in `src/components/phase9` and API layer in `src/lib/phase9-api.ts`.
- Automated tests in `src/test/phase9.test.ts` covering core behaviors.

### Evaluation Logging & ID Tracking
- **Robust Prediction Tracking**: Every prediction gets a unique UUIDv4 for end-to-end tracking from prediction to result reconciliation.
- **CSV-based Event Sourcing**: Evaluation log stored as `/tmp/evaluation_log.csv` with atomic append operations for data integrity.
- **Schema**: `prediction_id,timestamp,model_version,team_a,team_b,predicted_result,actual_result,confidence`
- **Model Versioning**: Automatic git commit hash tracking or configurable model versions.
- **Result Reconciliation**: Separate workflow for logging actual results, enabling accuracy analysis over time.
- **Testing Suite**: Comprehensive test script (`test-evaluation-logging.ts`) validates logging, validation, and reconciliation workflows.
- **Retention Policy**: Safe to archive/delete rows older than 90 days for performance management.

---

## 🧭 Navigation & Key Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing experience with quick access to prediction workflows. |
| `/predictions/new` | 8-match wizard for generating fresh predictions. |
| `/predictions` | Review existing predictions, confidence scores, and feedback actions. |
| `/dashboard` | Executive summary of KPIs, win rates, and operational status. |
| `/analytics` | Phase 4 analytics & feedback loop cockpit. |
| `/jobs` | Phase 3 scheduler control plane. |
| `/models` | Phase 6 model governance. |
| `/crossleague` | Phase 7 intelligence dashboard. |
| `/monitoring` | Phase 8 observability portal. |
| `/phase9` | Phase 9 collaborative market intelligence hub. |
| `/teams`, `/matches`, `/leagues` | Core domain exploration views. |

The sidebar (`src/components/Sidebar.tsx`) provides quick access to all major workspaces and reflects the expanded navigation after integration.

---

## 📂 Project Structure Highlights

```
src/
  components/         # Feature-specific component suites (jobs, models, monitoring, phase9, etc.)
  integrations/       # Supabase clients, model services, and domain adapters
  lib/                # Shared utilities (phase 9 API client, helpers)
  pages/              # Route-level pages mapped in App.tsx
  types/              # TypeScript domains for jobs, models, monitoring, phase9
  hooks/              # Shared hooks (e.g., useRealtimeSubscription)
supabase/functions/   # Edge Functions powering jobs and analytics orchestration
```

## 📚 Documentation

- Full index: [docs/INDEX.md](docs/INDEX.md)

### User Guides
- **[📖 Teljes Felhasználói Útmutató](docs/USER_GUIDE.md)** – Comprehensive end-to-end user guide (Hungarian primary, English summaries)
- **[⚡ Gyors Kezdés](docs/QUICK_START.md)** – 10-15 minute quick start guide (Hungarian)
- **[👥 Szerepkörök és Jogosultságok](docs/ROLE_PERMISSIONS.md)** – Role-based access control matrix (Hungarian)

### Technical Documentation
- [🔐 Auth útmutató](docs/AUTHENTICATION.md) – Authentication & authorization implementation
- [WinMix_TipsterHub_Phase_3-9_Components_EN.md](docs/WinMix_TipsterHub_Phase_3-9_Components_EN.md) – deep dive into components per phase.
- [PHASE9_IMPLEMENTATION.md](docs/PHASE9_IMPLEMENTATION.md) – architectural notes on the advanced collaborative intelligence layer.
- [PAGES_OLDALAK_BEMUTATASA_HU.md](docs/PAGES_OLDALAK_BEMUTATASA_HU.md) – src/pages oldalak rövid bemutatása (HU).

### Reviews & Roadmaps
- **[🧭 Projekt állapotértékelés és roadmap (HU)](docs/PROJEKT_ERTEKELES_ES_ROADMAP_HU.md)** – Reális értékelés a teljes repo alapján, fókusz: Streak Analysis és Transition Matrix

### Tooling & Dev Environments
- **[🧰 Alternatív online dev eszközök (GitHub + terminál) – HU](docs/ONLINE_DEVTOOLS_ALTERNATIVES_HU.md)** – Lovable.dev helyetti megoldások, GitHub-integráció és böngészős terminál opciók

---

## 🔐 Authentication & Authorization

The platform now includes Supabase Authentication with role-based access control (RBAC).

### User Roles
- **Admin**: Full system access including scheduled jobs and model management.
- **Analyst**: Can create predictions, access analytics, and view all dashboards.
- **User**: Read-only access to public predictions and match data.

### Authentication Features
- **Email/Password Sign-up & Sign-in**: Baseline authentication flow with validation.
- **Session Management**: Automatic token refresh and persistence via localStorage.
- **Protected Routes**: AuthGate component manages access control with configurable role requirements.
- **Public Demo Access**: Unauthenticated users can view matches, teams, leagues, and public predictions (read-only).
- **OAuth Support (Optional)**: Hooks for Google/GitHub authentication can be configured via Supabase dashboard.

### Creating Your First User
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173/signup`
3. Register with email and password
4. Check your email for verification (Supabase sends confirmation emails)
5. Sign in at `http://localhost:5173/login`

The first registered user will be assigned the default 'user' role. To promote to admin:
```sql
-- Run in Supabase SQL Editor
UPDATE user_profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Route Access Control
| Route Category | Authentication Required | Default Roles Allowed |
| --- | --- | --- |
| Public (`/`, `/login`, `/signup`) | ❌ No | All visitors |
| Demo Routes (`/predictions`, `/matches`, `/teams`, `/leagues`) | ❌ No (read-only) | All visitors |
| Protected Dashboards (`/dashboard`, `/analytics`, `/models`, `/monitoring`, `/phase9`) | ✅ Yes | admin, analyst, user |
| Job Management (`/jobs`) | ✅ Yes | admin, analyst |
| Prediction Creation (`/predictions/new`) | ✅ Yes | admin, analyst, user |

### Environment Variables
Configure authentication in your `.env` file (see `.env.example`):
```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_key_here"
```

Optional OAuth providers can be configured in the Supabase dashboard under Authentication > Providers.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or bun
- Supabase project (or Supabase CLI) configured with the matching schema & Edge Functions.

### Setup
```bash
npm install
npm run dev
```
- Copy `.env.example` to `.env` and configure with your Supabase credentials.
- Start the Vite dev server at `http://localhost:5173`.
- Ensure Supabase Edge Functions (`supabase/functions/*`) are deployed or running via `supabase functions serve` when testing job and analytics features locally.
- Apply database migrations including the new `user_profiles` table:
  ```bash
  supabase db push --project-ref <YOUR_PROJECT_ID>
  ```

### Testing

The project now includes unit, integration, end-to-end, and Supabase backend checks. Key commands:

| Command | Description |
| --- | --- |
| `npm test` | Run Vitest unit and integration suites with coverage reporting (outputs to `coverage/`). |
| `npm run test:watch` | Execute Vitest in watch mode for rapid iteration. |
| `npm run test:e2e` | Launch Playwright browser flows (dev server is started automatically). |
| `npm run test:supabase` | Execute Deno-based validation for shared Supabase schemas and policies. |
| `npm run test:all` | Run Vitest coverage followed by Supabase backend checks. |

Coverage summaries are printed to the console and detailed HTML/LCOV reports land in `coverage/`. Playwright reads Supabase defaults from `playwright.config.ts`; override via environment variables when targeting real backends.

---

## 📣 Integration Notes
- All feature branches (Phases 3 → 9) have been merged sequentially into `integration/merge-phases-3-4-6-7-8-9` with navigation, routes, and domain types normalized to avoid duplication.
- Shared UI elements (e.g., `Sidebar`, `App.tsx`) have consolidated imports and route registrations to surface every phase feature consistently.
- Documentation now reflects the unified system so reviewers and stakeholders can evaluate the entire product surface area from a single reference.

---

## 📚 Operations & Documentation

### Comprehensive Documentation
- **[System Audit Report](docs/SYSTEM_AUDIT_2025-11.md)** - Complete end-to-end validation of all systems, security, performance, and deployment readiness
- **[Configuration Reference](docs/CONFIGURATION_REFERENCE.md)** - Environment variables, Supabase setup, secrets management, and feature flags
- **[Operations Runbook](docs/OPERATIONS_RUNBOOK.md)** - Build, deploy, troubleshoot, and maintain the platform
- **[Authentication Guide](docs/AUTHENTICATION.md)** - User authentication, authorization, OAuth setup, and security best practices
- **[Evaluation Logging Guide](docs/EVALUATION_LOGGING.md)** - Robust prediction tracking, result reconciliation, and accuracy analysis system

### Quick Commands
```bash
# Development
npm run dev                              # Start local dev server
npm run build                            # Build for production
npm run lint                             # Run ESLint
npm test                                 # Run Vitest suites with coverage
npm run test:supabase                    # Run Supabase (Deno) checks
npm run test:e2e                         # Execute Playwright flows

# Database Operations
supabase db push --project-ref <ID>     # Apply migrations
supabase db dump > backup.sql           # Backup database

# Edge Functions
supabase functions deploy <name>        # Deploy function
supabase functions logs <name>          # View function logs
supabase secrets set KEY=value          # Add secret

# Evaluation Logging
deno run test-evaluation-logging.ts     # Test evaluation logging system
cat /tmp/evaluation_log.csv            # View evaluation log
supabase functions invoke reconcile-prediction-result --data '{"prediction_id":"uuid","actual_result":"home_win"}'  # Reconcile prediction result

# Security
npm audit                               # Check for vulnerabilities
npm audit fix                           # Fix auto-fixable issues
```

### System Status (November 2025)
- ✅ **Build Status:** Success (bundle size: 1.3 MB - optimization recommended)
- ✅ **Database:** 14 migrations applied, 26 tables, RLS enabled on user_profiles
- ✅ **Edge Functions:** 28 functions deployed and operational
- ✅ **Authentication:** Fully functional with RBAC (admin, analyst, user)
- ⚠️ **Security:** 2 moderate npm vulnerabilities (dev-only, fix available)
- ✅ **Production Ready:** After addressing critical items in audit report

---

## 🤝 Contributing
1. Create feature branches off the integration branch (`integration/merge-phases-3-4-6-7-8-9`).
2. Follow the established folder conventions (`components/<feature>`, `pages/<Feature>.tsx`).
3. Use TanStack Query for data synchronization and Supabase Edge Functions for server-side orchestration.
4. Update documentation when introducing new domain concepts or workflows.
5. **Read the [System Audit Report](docs/SYSTEM_AUDIT_2025-11.md)** for known issues and best practices.

By keeping these guidelines in mind, the integrated TipsterHub platform remains maintainable, observable, and ready for further enhancements.
