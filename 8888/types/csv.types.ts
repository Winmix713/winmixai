export interface CSVError {
  type: string
  code: string
  message: string
  row: number
}

export interface CSVParseResult<T> {
  data: T[]
  errors: CSVError[]
  meta: {
    fields?: string[]
    [key: string]: any
  }
}

export interface CSVValidationResult {
  isValid: boolean
  errors: CSVError[]
  warnings: CSVError[]
  parsedData: any[]
}

export interface CSVMatchRow {
  match_time: string
  home_team: string
  away_team: string
  half_time_home_goals: string
  half_time_away_goals: string
  full_time_home_goals: string
  full_time_away_goals: string
  round?: string
  league?: string
  venue?: string
  referee?: string
}
