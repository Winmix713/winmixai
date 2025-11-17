// Data import service for CSV and other formats
import type { Match } from '@/types/league.types'

export class DataImportService {
  async importFromCSV(file: File): Promise<Match[]> {
    const text = await file.text()
    const lines = text.split('\n')
    const matches: Match[] = []

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = this.parseCSVLine(line)
      if (columns.length < 7) continue

      const match: Match = {
        match_time: columns[0] || new Date().toISOString(),
        home_team: columns[1] || '',
        away_team: columns[2] || '',
        half_time_home_goals: parseInt(columns[3]) || 0,
        half_time_away_goals: parseInt(columns[4]) || 0,
        full_time_home_goals: parseInt(columns[5]) || 0,
        full_time_away_goals: parseInt(columns[6]) || 0,
        round: columns[7],
        league: columns[8],
        venue: columns[9],
        referee: columns[10]
      }

      matches.push(match)
    }

    return matches
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  exportToCSV(matches: Match[]): string {
    const headers = [
      'Date',
      'Home Team',
      'Away Team',
      'HT Home Goals',
      'HT Away Goals',
      'FT Home Goals',
      'FT Away Goals',
      'Round',
      'League',
      'Venue',
      'Referee'
    ]

    const rows = matches.map(match => [
      match.match_time,
      match.home_team,
      match.away_team,
      match.half_time_home_goals,
      match.half_time_away_goals,
      match.full_time_home_goals,
      match.full_time_away_goals,
      match.round || '',
      match.league || '',
      match.venue || '',
      match.referee || ''
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}
