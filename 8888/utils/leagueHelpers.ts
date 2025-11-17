// League calculation helpers
import type { Match, StandingsEntry, TeamForm } from '@/types/league.types'
import { LeagueStatsCalculator } from './leagueStats'

export const calculateStandings = (matches: Match[]): StandingsEntry[] => {
  const calculator = new LeagueStatsCalculator(matches)
  return calculator.getStandings()
}

export const calculateTeamForms = (matches: Match[]): TeamForm[] => {
  const calculator = new LeagueStatsCalculator(matches)
  return calculator.getStandings().map(standing => ({
    position: standing.position,
    team: standing.team,
    played: standing.played,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    goalDifference: standing.goalDifference,
    points: standing.points,
    form: standing.form,
  }))
}
