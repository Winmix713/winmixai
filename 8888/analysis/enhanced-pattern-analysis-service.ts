// Enhanced pattern analysis service
import type { Match } from '@/types/league.types'
import type { PatternDefinition, PatternAnalysisResult, PatternOccurrence } from './types'
import { calculateConfidenceInterval, calculateStatisticalSignificance } from '@/utils/calculations'

export class EnhancedPatternAnalysisService {
  analyzePattern(pattern: PatternDefinition, matches: Match[]): PatternAnalysisResult {
    const occurrences: PatternOccurrence[] = []

    // Find all matches that match the pattern
    for (const match of matches) {
      if (this.matchesPattern(match, pattern)) {
        occurrences.push({
          matchId: `${match.home_team}-${match.away_team}-${match.match_time}`,
          date: match.match_time,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          htHomeScore: match.half_time_home_goals,
          htAwayScore: match.half_time_away_goals,
          ftHomeScore: match.full_time_home_goals,
          ftAwayScore: match.full_time_away_goals,
          confidence: 1.0
        })
      }
    }

    const totalMatches = matches.length
    const occurrenceCount = occurrences.length
    const frequency = totalMatches > 0 ? occurrenceCount / totalMatches : 0
    const confidenceInterval = calculateConfidenceInterval(frequency, totalMatches)
    
    const expectedFrequency = totalMatches * 0.1 // Assume 10% baseline
    const significance = calculateStatisticalSignificance(occurrenceCount, expectedFrequency, totalMatches)

    return {
      patternId: pattern.id,
      patternName: pattern.name,
      occurrences: occurrenceCount,
      totalMatches,
      frequency,
      confidenceInterval,
      statisticalSignificance: {
        pValue: significance.pValue,
        isSignificant: significance.isSignificant,
        confidenceLevel: 0.95
      },
      occurrenceDetails: occurrences
    }
  }

  private matchesPattern(match: Match, pattern: PatternDefinition): boolean {
    return pattern.conditions.every(condition => {
      switch (condition.type) {
        case 'halftime_score':
          return this.checkScoreCondition(
            match.half_time_home_goals,
            match.half_time_away_goals,
            condition.operator,
            condition.value
          )
        case 'fulltime_score':
          return this.checkScoreCondition(
            match.full_time_home_goals,
            match.full_time_away_goals,
            condition.operator,
            condition.value
          )
        case 'total_goals':
          const totalGoals = match.full_time_home_goals + match.full_time_away_goals
          return this.checkNumericCondition(totalGoals, condition.operator, Number(condition.value))
        case 'goal_difference':
          const goalDiff = Math.abs(match.full_time_home_goals - match.full_time_away_goals)
          return this.checkNumericCondition(goalDiff, condition.operator, Number(condition.value))
        case 'team':
          return this.checkTeamCondition(match, condition.operator, String(condition.value))
        default:
          return true
      }
    })
  }

  private checkScoreCondition(
    homeScore: number,
    awayScore: number,
    operator: string,
    value: string | number
  ): boolean {
    const scoreString = `${homeScore}-${awayScore}`
    if (operator === '=') return scoreString === String(value)
    if (operator === '!=') return scoreString !== String(value)
    return false
  }

  private checkNumericCondition(actualValue: number, operator: string, expectedValue: number): boolean {
    switch (operator) {
      case '=': return actualValue === expectedValue
      case '!=': return actualValue !== expectedValue
      case '>': return actualValue > expectedValue
      case '<': return actualValue < expectedValue
      case '>=': return actualValue >= expectedValue
      case '<=': return actualValue <= expectedValue
      default: return false
    }
  }

  private checkTeamCondition(match: Match, operator: string, teamName: string): boolean {
    const hasTeam = match.home_team === teamName || match.away_team === teamName
    if (operator === 'contains') return hasTeam
    if (operator === 'not_contains') return !hasTeam
    return false
  }
  discoverPatterns(matches: Match[], minSupport = 0.1): PatternDefinition[] {
    const patterns: PatternDefinition[] = []
    
    // Discover common score patterns
    const scorePatterns = new Map<string, number>()
    for (const match of matches) {
      const htScore = `${match.half_time_home_goals}-${match.half_time_away_goals}`
      scorePatterns.set(htScore, (scorePatterns.get(htScore) || 0) + 1)
    }
    
    for (const [score, count] of scorePatterns) {
      const frequency = count / matches.length
      if (frequency >= minSupport) {
        patterns.push({
          id: `pattern-ht-${score}-${Date.now()}`,
          name: `Half-time ${score}`,
          description: `Matches with half-time score ${score}`,
          conditions: [{
            id: `cond-${Date.now()}`,
            type: 'halftime_score',
            operator: '=',
            value: score
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    return patterns
  }
}
