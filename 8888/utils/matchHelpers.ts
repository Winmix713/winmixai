// Helper functions to normalize match data
import type { Match } from '@/types/league.types'

export function getMatchDate(match: Match): string {
  return match.date || match.match_time
}

export function getHomeScore(match: Match): number {
  return match.home_score ?? match.full_time_home_goals
}

export function getAwayScore(match: Match): number {
  return match.away_score ?? match.full_time_away_goals
}

export function getHalfTimeHomeScore(match: Match): number {
  return match.ht_home_score ?? match.half_time_home_goals
}

export function getHalfTimeAwayScore(match: Match): number {
  return match.ht_away_score ?? match.half_time_away_goals
}

export function normalizeMatch(match: Match): Match {
  return {
    ...match,
    date: getMatchDate(match),
    home_score: getHomeScore(match),
    away_score: getAwayScore(match),
    ht_home_score: getHalfTimeHomeScore(match),
    ht_away_score: getHalfTimeAwayScore(match)
  }
}
