// Analysis types for pattern detection and alerts

export interface PatternCondition {
  id: string
  type: 'halftime_score' | 'fulltime_score' | 'goal_difference' | 'total_goals' | 'team' | 'custom' | 'score_change'
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not_contains'
  value: string
  field?: string
  target?: string
  customFormula?: string
}

export interface PatternDefinition {
  id: string
  name: string
  description: string
  conditions: PatternCondition[]
  createdAt: string
  updatedAt: string
}

export interface PatternOccurrence {
  matchId: string
  date: string
  homeTeam: string
  awayTeam: string
  htHomeScore: number
  htAwayScore: number
  ftHomeScore: number
  ftAwayScore: number
  confidence: number
}

export interface StatisticalSignificance {
  pValue: number
  isSignificant: boolean
  confidenceLevel: number
}

export interface PatternAnalysisResult {
  patternId: string
  patternName: string
  occurrences: number
  totalMatches: number
  frequency: number
  confidenceInterval: [number, number]
  statisticalSignificance?: StatisticalSignificance
  occurrenceDetails: PatternOccurrence[]
  teamFrequencies?: Record<string, number>
  seasonalTrends?: Record<string, number>
}

export interface AnalysisJob {
  id: string
  patternIds: string[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime?: string
  endTime?: string
  results?: Record<string, PatternAnalysisResult>
  error?: string
  dataSourceId?: string
}

export interface AlertCondition {
  type: 'frequency' | 'occurrences' | 'confidence' | 'trend' | 'occurrence_count'
  operator: '>' | '<' | '=' | '>=' | '<='
  value: number
  field?: string
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'notification' | 'log'
  config: Record<string, any>
}

export interface Alert {
  id: string
  name: string
  patternId: string
  conditions: AlertCondition[]
  actions: AlertAction[]
  isActive: boolean
  lastTriggered?: string
}

export interface DataSource {
  id: string
  name: string
  type: 'csv' | 'database' | 'api'
  config: Record<string, any>
  lastSynced?: string
}

export interface AnalysisFilter {
  startDate?: Date
  endDate?: Date
  teams?: string[]
  minConfidence?: number
  dateRange?: { start: Date; end: Date }
  seasons?: string[]
}
