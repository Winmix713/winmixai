# WinmixPro State Hooks & Data Layer

This document describes the localStorage-driven state architecture for WinmixPro, including theme management, feature flags, and typed mock data.

## Architecture Overview

The WinmixPro state management system consists of:

1. **Core Hooks** - Type-safe localStorage persistence hooks
2. **Providers** - React Context providers for theme and feature flags
3. **Library Modules** - Theme manager, feature flags, utilities
4. **Type Definitions** - Comprehensive TypeScript types
5. **Mock Data** - Typed datasets for all pages
6. **Tests** - Unit tests for hooks and utilities

## Core Hooks

### `useLocalStorage<T>`

Type-safe localStorage hook with SSR support and storage event synchronization.

```typescript
import { useLocalStorage } from "@/winmixpro/hooks/useLocalStorage";

const [value, setValue, removeValue] = useLocalStorage("my-key", "default");

// Update value
setValue("new-value");

// Remove from storage
removeValue();
```

### `useTheme`

Access theme management functionality throughout the app.

```typescript
import { useTheme } from "@/winmixpro/hooks/useTheme";

const { currentTheme, setTheme, presets, favorites, toggleFavorite, exportCSS, exportJSON, resetTheme } = useTheme();

// Change theme
setTheme("aurora");

// Add to favorites
toggleFavorite("fjord");

// Export theme as CSS
const css = exportCSS();
```

### `useFeatureFlags`

Manage feature flags with dependency checking and validation.

```typescript
import { useFeatureFlags } from "@/winmixpro/hooks/useFeatureFlags";

const { isEnabled, getValue, toggleFlag, updateFlag, exportFlags, importFlags, resetFlags } = useFeatureFlags();

// Check if feature is enabled
if (isEnabled("enable-phase9-collaborative")) {
  // Feature code here
}

// Get metadata value
const decayRate = getValue<number>("enable-temporal-decay", "decayRate");

// Toggle a flag
toggleFlag("enable-auto-refresh");
```

## Providers

### `WinmixProProviders`

Wraps the entire WinmixPro app with theme and feature flag providers.

```typescript
import { WinmixProProviders } from "@/winmixpro/providers";

<WinmixProProviders>
  <YourApp />
</WinmixProProviders>
```

## Theme Management

### Available Themes

1. **Aurora** (Default) - Emerald + cyan gradient, stable
2. **Neon Ember** - Orange + pink gradient, experimental
3. **Fjord** - Sky blue + indigo gradient, stable
4. **Slate Glow** - Neutral slate tones, experimental
5. **Midnight Purple** - Purple tones for AI surfaces, stable
6. **Forest Mint** - Green tones for data quality, experimental

### Theme Structure

```typescript
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  palette: ThemePalette;
  glass: GlassSettings;
  status: "stable" | "experimental";
}
```

### Applying Themes

Themes are automatically applied via CSS variables when changed:

- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--glass-blur`
- `--glass-opacity`
- etc.

## Feature Flags

### Default Flags

13 feature flags are available by default:

- **Phase 9 Collaborative Weights** (enabled, 100%)
- **Market Overlay** (enabled, 80%)
- **Temporal Decay** (enabled, 100%)
- **Advanced Health Heatmap** (disabled, 25% - experiment)
- **Real-time Alerts** (enabled, 100% - operational)
- **Dark Mode Only** (enabled, 100%)
- **Champion vs Challenger Comparison** (enabled, 100%)
- **Feedback Inbox** (enabled, 90%)
- **Auto Refresh Data** (disabled, 0% - experiment)
- **Theme Customization** (enabled, 100%)
- **Sentry Integration** (enabled, 100% - operational)
- **Prediction Confidence Scores** (enabled, 100%)
- **Market API Killswitch** (disabled, 0% - killswitch)

### Flag Categories

- `feature` - Standard features
- `experiment` - A/B test experiments
- `killswitch` - Emergency off switches
- `operational` - Infrastructure/monitoring

### Flag Dependencies

Flags can depend on other flags. Example:

```typescript
{
  id: "enable-market-overlay",
  dependencies: ["enable-phase9-collaborative"],
  // Will only be enabled if phase9-collaborative is also enabled
}
```

## Mock Data

All mock data is organized into modules under `src/winmixpro/data/`:

- `dashboard.ts` - KPIs and metrics (1248 users, 3 active jobs, 87.3% accuracy)
- `users.ts` - User list with roles and segments
- `jobs.ts` - Scheduled jobs and timeline
- `models.ts` - ML models (champion/challenger/shadow)
- `health.ts` - Service health heatmap and alerts
- `integrations.ts` - External integrations (GitHub, Slack, Linear, Sentry)
- `stats.ts` - League statistics, goal distributions
- `feedback.ts` - User feedback entries
- `predictions.ts` - Prediction accuracy and upcoming matches
- `phase9.ts` - Phase 9 settings and defaults
- `themes.ts` - Theme presets (legacy format)
- `components.ts` - UI control dependencies

All data is strongly typed and includes Hungarian labels as specified.

## Storage Keys

All localStorage keys are centralized in `STORAGE_KEYS`:

- `winmixpro-theme` - Current theme ID
- `winmixpro-theme-favorites` - Array of favorite theme IDs
- `winmixpro-feature-flags` - Feature flags configuration
- `winmixpro-users-filter` - Users page filter state
- `winmixpro-users-active` - Users page "active only" toggle
- `winmixpro-job-filter` - Jobs page filter
- `winmixpro-integrations-verified` - Integrations verification state
- `winmixpro-feedback-status` - Feedback inbox filters
- `winmixpro-phase9-settings` - Phase 9 configuration
- `winmixpro-ui-pins` - Pinned UI controls
- `winmixpro-stats-league` - Selected league for stats
- `winmixpro-stats-range` - Selected time range for stats
- `winmixpro-prediction-range` - Prediction time range

## Utility Functions

### Formatters

```typescript
import { formatPercent, formatShortNumber, formatDuration, formatRelativeTime } from "@/winmixpro/lib/utils";

formatPercent(87.34); // "87.3%"
formatShortNumber(1248); // "1.2K"
formatDuration(125000); // "2p 5mp"
formatRelativeTime(42); // "42 perce"
```

### State Management

```typescript
import { resetWinmixProState, exportWinmixProState, importWinmixProState } from "@/winmixpro/lib/reset-state";

// Reset all state and reload
resetWinmixProState();

// Export state as JSON
const stateJson = exportWinmixProState();

// Import state from JSON
const result = importWinmixProState(stateJson);
if (result.success) {
  console.log("State imported successfully");
}
```

## Constants

### Glass Presets

```typescript
import { GLASS_PRESETS } from "@/winmixpro/lib/constants";

// GLASS_PRESETS.LIGHT, GLASS_PRESETS.MEDIUM, GLASS_PRESETS.HEAVY
```

### Animation Durations

```typescript
import { ANIMATION_DURATIONS, TRANSITION_CLASSES } from "@/winmixpro/lib/constants";

// ANIMATION_DURATIONS.FAST (150ms)
// ANIMATION_DURATIONS.NORMAL (300ms)
// ANIMATION_DURATIONS.SLOW (500ms)
// ANIMATION_DURATIONS.SHIMMER (2000ms)

// TRANSITION_CLASSES.DEFAULT
// TRANSITION_CLASSES.FAST
// etc.
```

## Testing

Unit tests are provided for core functionality:

```bash
npm test -- src/winmixpro/__tests__
```

Tests cover:

- `useLocalStorage` hook (8 tests)
- Feature flags utilities (21 tests)

## Migration Guide

If you're migrating from `usePersistentState` to `useLocalStorage`:

```typescript
// Old
import { usePersistentState } from "@/winmixpro/hooks/usePersistentState";
const [value, setValue] = usePersistentState("key", "default");

// New
import { useLocalStorage } from "@/winmixpro/hooks/useLocalStorage";
const [value, setValue, removeValue] = useLocalStorage("key", "default");
// Note: removeValue is the third element in the tuple
```

Both hooks remain available for backward compatibility.

## Best Practices

1. **Always use TypeScript types** - All data structures have interfaces
2. **Check feature flags** - Use `isEnabled()` before accessing experimental features
3. **Handle SSR gracefully** - All hooks check for browser environment
4. **Use storage keys constants** - Import from `STORAGE_KEYS` instead of hardcoding
5. **Validate imported data** - Use validation helpers when importing configs
6. **Test state persistence** - Clear localStorage in tests with `beforeEach()`

## Example Usage in Pages

```typescript
import { useTheme, useFeatureFlags } from "@/winmixpro/providers";
import { dashboardMetrics } from "@/winmixpro/data/dashboard";
import { formatPercent } from "@/winmixpro/lib/utils";

const MyPage = () => {
  const { currentTheme } = useTheme();
  const { isEnabled } = useFeatureFlags();

  const showAdvancedMetrics = isEnabled("enable-advanced-heatmap");

  return (
    <div>
      <h1>Current Theme: {currentTheme.name}</h1>
      <p>Accuracy: {formatPercent(dashboardMetrics.accuracy)}</p>
      {showAdvancedMetrics && <AdvancedMetrics />}
    </div>
  );
};
```

## Support

For questions or issues with the state management system, contact the DesignOps or Frontend teams.
