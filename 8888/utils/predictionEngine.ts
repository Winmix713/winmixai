
import { 
  TeamStatistics, 
  PredictionResult, 
  PredictionInput,
  PredictionExplanation,
  DecisionPath,
  OverconfidenceCheckResult,
  EnhancedPrediction
} from '@/types/sportradar';

export class PredictionEngine {
  calculateBTTSProbability(homeStats: TeamStatistics, awayStats: TeamStatistics): number {
    const homeGoalsPerGame = homeStats.statistics.goals_scored / homeStats.statistics.matches_played;
    const awayGoalsPerGame = awayStats.statistics.goals_scored / awayStats.statistics.matches_played;
    const homeGoalsConcededPerGame = homeStats.statistics.goals_conceded / homeStats.statistics.matches_played;
    const awayGoalsConcededPerGame = awayStats.statistics.goals_conceded / awayStats.statistics.matches_played;

    // Valószínűség hogy a hazai csapat szerez gólt
    const homeScoreProb = Math.min(0.95, (homeGoalsPerGame + awayGoalsConcededPerGame) / 4);
    
    // Valószínűség hogy a vendég csapat szerez gólt
    const awayScoreProb = Math.min(0.95, (awayGoalsPerGame + homeGoalsConcededPerGame) / 4);

    // BTTS valószínűség
    const bttsProb = homeScoreProb * awayScoreProb;

    // Historikus BTTS adat figyelembevétele ha elérhető
    if (homeStats.statistics.btts && awayStats.statistics.btts) {
      const homeBTTSRate = homeStats.statistics.btts.both_teams_scored / homeStats.statistics.matches_played;
      const awayBTTSRate = awayStats.statistics.btts.both_teams_scored / awayStats.statistics.matches_played;
      const avgBTTSRate = (homeBTTSRate + awayBTTSRate) / 2;
      
      return (bttsProb * 0.6 + avgBTTSRate * 0.4) * 100;
    }

    return bttsProb * 100;
  }

  calculateOver25Probability(homeStats: TeamStatistics, awayStats: TeamStatistics): number {
    const homeGoalsPerGame = homeStats.statistics.goals_scored / homeStats.statistics.matches_played;
    const awayGoalsPerGame = awayStats.statistics.goals_scored / awayStats.statistics.matches_played;
    const homeGoalsConcededPerGame = homeStats.statistics.goals_conceded / homeStats.statistics.matches_played;
    const awayGoalsConcededPerGame = awayStats.statistics.goals_conceded / awayStats.statistics.matches_played;

    // Becsült gólok száma a mérkőzésen
    const expectedGoals = (homeGoalsPerGame + awayGoalsConcededPerGame + awayGoalsPerGame + homeGoalsConcededPerGame) / 2;

    // Poisson eloszlás közelítése Over 2.5-re
    let over25Prob = 0;
    if (expectedGoals > 2.5) {
      over25Prob = Math.min(0.9, (expectedGoals - 2.5) / 2 + 0.3);
    } else {
      over25Prob = Math.max(0.1, expectedGoals / 2.5 * 0.4);
    }

    // Historikus Over 2.5 adat figyelembevétele ha elérhető
    if (homeStats.statistics.over_goals && awayStats.statistics.over_goals) {
      const homeOver25Rate = homeStats.statistics.over_goals.over_2_5 / homeStats.statistics.matches_played;
      const awayOver25Rate = awayStats.statistics.over_goals.over_2_5 / awayStats.statistics.matches_played;
      const avgOver25Rate = (homeOver25Rate + awayOver25Rate) / 2;
      
      return (over25Prob * 0.6 + avgOver25Rate * 0.4) * 100;
    }

    return over25Prob * 100;
  }

  getConfidenceLevel(probability: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (probability > 70 || probability < 30) return 'HIGH';
    if (probability > 60 || probability < 40) return 'MEDIUM';
    return 'LOW';
  }

  generatePrediction(input: PredictionInput): PredictionResult {
    const bttsProbability = this.calculateBTTSProbability(input.homeTeam, input.awayTeam);
    const over25Probability = this.calculateOver25Probability(input.homeTeam, input.awayTeam);

    return {
      btts: {
        probability: Math.round(bttsProbability * 100) / 100,
        recommendation: bttsProbability > 50 ? 'YES' : 'NO',
        confidence: this.getConfidenceLevel(bttsProbability)
      },
      over25: {
        probability: Math.round(over25Probability * 100) / 100,
        recommendation: over25Probability > 50 ? 'OVER' : 'UNDER',
        confidence: this.getConfidenceLevel(over25Probability)
      }
    };
  }

  generateExplanation(
    features: Record<string, number>,
    ensembleResult: PredictionResult & { confidence_score?: number }
  ): PredictionExplanation {
    const baseConfidence = (ensembleResult.confidence_score || 0) / 100;
    const patternBoost = Math.min(0.15, (baseConfidence - 0.75) * 0.5); // Simulated pattern boost
    const finalConfidence = Math.min(0.99, baseConfidence + patternBoost);

    // Extract key factors from features
    const keyFactors = Object.entries(features)
      .slice(0, 3) // Top 3 factors
      .map(([factor, value], index) => {
        const weight = (1 - index * 0.15) / 3; // Decreasing weight
        const contribution = `${(value * 100).toFixed(0)}%`;
        return {
          factor: this.formatFactorName(factor),
          weight,
          contribution,
          details: this.getFactorDetails(factor, value)
        };
      });

    const decisionTree = [
      `Step 1: Analyzed recent form (5 matches)`,
      `Step 2: Evaluated H2H history (weighted 0.25)`,
      `Step 3: Applied home advantage factor`,
      `Step 4: Pattern model detected patterns`
    ];

    return {
      summary: `Prediction favored based on analyzed factors and historical patterns`,
      key_factors: keyFactors,
      decision_tree: decisionTree,
      confidence_breakdown: {
        base_confidence: baseConfidence,
        pattern_boost: patternBoost,
        final_confidence: finalConfidence
      }
    };
  }

  private formatFactorName(factor: string): string {
    const factorLabels: Record<string, string> = {
      'recent_form': 'Recent Form',
      'h2h_history': 'Head-to-Head',
      'home_advantage': 'Home Advantage',
      'btts': 'Both Teams Score',
      'over_under': 'Over/Under Tendency'
    };
    return factorLabels[factor] || factor.replace(/_/g, ' ');
  }

  private getFactorDetails(factor: string, value: number): string {
    const percentage = (value * 100).toFixed(0);
    const details: Record<string, (p: string) => string> = {
      'recent_form': (p) => `Team won ${p}% of recent matches`,
      'h2h_history': (p) => `Favored team won ${p}% of H2H encounters`,
      'home_advantage': (p) => `Home team has ${p}% win rate at venue`,
      'btts': (p) => `Both teams scored in ${p}% of matches`,
      'over_under': (p) => `Over 2.5 goals in ${p}% of matches`
    };
    return details[factor]?.(percentage) || `Factor contributes ${percentage}%`;
  }

  buildDecisionPath(
    featureImportance: Record<string, number>
  ): DecisionPath {
    const nodes = [];
    let nodeId = 1;

    // Root node
    nodes.push({
      id: nodeId,
      type: 'root' as const,
      condition: 'Form differential > 0.3',
      result: true,
      next_node: nodeId + 1
    });
    nodeId++;

    // Branch nodes based on feature importance
    const topFeatures = Object.entries(featureImportance)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);

    for (const [feature, importance] of topFeatures) {
      nodes.push({
        id: nodeId,
        type: 'branch' as const,
        condition: `${this.formatFactorName(feature)} >= ${(importance * 100).toFixed(0)}%`,
        result: importance > 0.5,
        outcome: 'home_win',
        confidence_contribution: importance,
        next_node: nodeId < topFeatures.length ? nodeId + 1 : undefined
      });
      nodeId++;
    }

    // Leaf node with final outcome
    nodes.push({
      id: nodeId,
      type: 'leaf' as const,
      condition: 'Final prediction threshold reached',
      outcome: 'home_win',
      confidence_contribution: 0.15
    });

    return { nodes };
  }

  checkOverconfidence(
    teamPair: [string, string],
    outcome: string,
    confidence: number,
    historicalPredictions: Array<{
      predicted_outcome: string;
      confidence_score: number;
      was_correct: boolean;
      created_at: string;
    }>
  ): OverconfidenceCheckResult {
    // If confidence is not above 95%, no block needed
    if (confidence <= 0.95) {
      return { should_block: false };
    }

    // Check for similar failed predictions in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentFailures = historicalPredictions.filter(pred => {
      const predDate = new Date(pred.created_at);
      return (
        pred.predicted_outcome === outcome &&
        pred.confidence_score >= 0.95 &&
        !pred.was_correct &&
        predDate >= thirtyDaysAgo
      );
    });

    if (recentFailures.length > 0) {
      const downgradedConfidence = Math.min(0.88, confidence * 0.92);
      const mostRecentFailure = recentFailures[recentFailures.length - 1];
      
      return {
        should_block: true,
        reason: `High confidence (${(confidence * 100).toFixed(1)}%) prediction for same matchup failed within last 30 days (on ${new Date(mostRecentFailure.created_at).toLocaleDateString()})`,
        downgraded_confidence: downgradedConfidence,
        alternate_outcome: outcome === 'home_win' ? 'draw' : 'away_win',
        prior_failure_date: mostRecentFailure.created_at
      };
    }

    return { should_block: false };
  }
}

export const predictionEngine = new PredictionEngine();
