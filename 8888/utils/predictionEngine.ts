
import { TeamStatistics, PredictionResult, PredictionInput } from '@/types/sportradar';

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
}

export const predictionEngine = new PredictionEngine();
