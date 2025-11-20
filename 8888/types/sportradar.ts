
export interface Competition {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    country_code: string;
  };
}

export interface Season {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  year: string;
  competition_id: string;
}

export interface Competitor {
  id: string;
  name: string;
  country: string;
  country_code: string;
  abbreviation: string;
}

export interface TeamStatistics {
  competitor: Competitor;
  statistics: {
    matches_played: number;
    goals_scored: number;
    goals_conceded: number;
    goals_scored_home: number;
    goals_scored_away: number;
    goals_conceded_home: number;
    goals_conceded_away: number;
    shots_total: number;
    shots_on_target: number;
    shots_off_target: number;
    corner_kicks: number;
    yellow_cards: number;
    red_cards: number;
    matches_won: number;
    matches_drawn: number;
    matches_lost: number;
    ball_possession_avg: number;
    over_goals?: {
      over_0_5: number;
      over_1_5: number;
      over_2_5: number;
      over_3_5: number;
    };
    btts?: {
      both_teams_scored: number;
      both_teams_not_scored: number;
    };
  };
}

export interface ApiResponse<T> {
  generated_at: string;
  data: T;
}

export interface PredictionInput {
  homeTeam: TeamStatistics;
  awayTeam: TeamStatistics;
  h2hMatches?: number;
}

export interface PredictionResult {
  btts: {
    probability: number;
    recommendation: 'YES' | 'NO';
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  over25: {
    probability: number;
    recommendation: 'OVER' | 'UNDER';
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}

export type PredictionStatus = 'active' | 'uncertain' | 'blocked';
export type PredictionOutcome = 'HOME' | 'DRAW' | 'AWAY' | 'home_win' | 'draw' | 'away_win';

export interface ExplanationFactor {
  factor: string;
  weight: number;
  contribution: string;
  details: string;
}

export interface ConfidenceBreakdown {
  base_confidence: number;
  pattern_boost: number;
  final_confidence: number;
}

export interface PredictionExplanation {
  summary: string;
  key_factors: ExplanationFactor[];
  decision_tree: string[];
  confidence_breakdown: ConfidenceBreakdown;
}

export interface DecisionNode {
  id: number;
  type: 'root' | 'branch' | 'leaf';
  condition: string;
  result?: boolean;
  outcome?: PredictionOutcome;
  confidence_contribution?: number;
  next_node?: number;
}

export interface DecisionPath {
  nodes: DecisionNode[];
}

export interface OverconfidenceCheckResult {
  should_block: boolean;
  reason?: string;
  downgraded_confidence?: number;
  alternate_outcome?: PredictionOutcome;
  prior_failure_date?: string;
}

export interface EnhancedPrediction extends PredictionResult {
  explanation?: PredictionExplanation;
  decision_path?: DecisionPath;
  prediction_status?: PredictionStatus;
  overconfidence_flag?: boolean;
  blocked_reason?: string;
  alternate_outcome?: PredictionOutcome;
  downgraded_from_confidence?: number;
  confidence_score?: number;
}
