// Performance metrics types for pattern tracking

export interface PatternPerformanceMetrics {
  id: string;
  patternId: string;
  successRate: number; // 0-100%
  totalOccurrences: number;
  successfulPredictions: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  reliabilityScore: number; // 0-10
  avgConfidence: number;
  lastSeenDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatternTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: any[];
  isTemplate: boolean;
  isPublic: boolean;
}

export interface PatternComparison {
  patterns: string[]; // Pattern IDs being compared
  overlapAnalysis: {
    matchIds: string[];
    overlapPercentage: number;
  };
  correlationMatrix: Record<string, Record<string, number>>;
  performanceRanking: Array<{
    patternId: string;
    patternName: string;
    score: number;
    metrics: PatternPerformanceMetrics;
  }>;
}

export interface PatternOccurrenceDetail {
  id: string;
  patternId: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  htHomeScore: number;
  htAwayScore: number;
  confidence: number;
  metadata: Record<string, any>;
}

export interface AISuggestedPattern {
  name: string;
  description: string;
  category: string;
  frequency: number;
  conditions: any[];
  confidence: number;
}
