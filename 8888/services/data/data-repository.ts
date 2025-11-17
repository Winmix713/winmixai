// Data repository for managing match data
import type { Match } from '@/types/league.types'

export class DataRepository {
  private matches: Match[] = []

  constructor(initialMatches: Match[] = []) {
    this.matches = initialMatches
  }

  getAllMatches(): Match[] {
    return [...this.matches]
  }

  getMatches(): Match[] {
    return this.getAllMatches()
  }

  getLeagueById(leagueId: string): Match[] {
    return this.matches.filter(match => match.league === leagueId)
  }

  addMatch(match: Match): void {
    this.matches.push(match)
  }

  addMatches(matches: Match[]): void {
    this.matches.push(...matches)
  }

  updateMatch(index: number, match: Match): void {
    if (index >= 0 && index < this.matches.length) {
      this.matches[index] = match
    }
  }

  deleteMatch(index: number): void {
    if (index >= 0 && index < this.matches.length) {
      this.matches.splice(index, 1)
    }
  }

  clearMatches(): void {
    this.matches = []
  }

  getMatchCount(): number {
    return this.matches.length
  }

  getMatchesByTeam(teamName: string): Match[] {
    return this.matches.filter(
      match => match.home_team === teamName || match.away_team === teamName
    )
  }

  getMatchesByDateRange(startDate: Date, endDate: Date): Match[] {
    return this.matches.filter(match => {
      const matchDate = new Date(match.match_time)
      return matchDate >= startDate && matchDate <= endDate
    })
  }
}
