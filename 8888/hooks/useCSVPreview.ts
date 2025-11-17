import { useState, useCallback } from "react"
import Papa from "papaparse"
import type { CSVParseResult, CSVValidationResult, CSVError, CSVMatchRow } from "@/types/csv.types"
import type { Match } from "@/types/league.types"

async function parseCSV(file: File): Promise<CSVParseResult<CSVMatchRow>> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVMatchRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const errors: CSVError[] = results.errors.map((err: any) => ({
          type: err.type || "Unknown",
          code: err.code || "UNKNOWN_ERROR",
          message: err.message || "An unknown error occurred",
          row: err.row !== undefined ? err.row : -1,
        }))

        resolve({
          data: results.data,
          errors,
          meta: results.meta,
        })
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`))
      },
    })
  })
}

function validateCSVData(data: CSVMatchRow[], parseErrors: CSVError[]): CSVValidationResult {
  const errors: CSVError[] = [...parseErrors]
  const warnings: CSVError[] = []
  const parsedData: Match[] = []

  const requiredFields: (keyof CSVMatchRow)[] = [
    "match_time",
    "home_team",
    "away_team",
    "half_time_home_goals",
    "half_time_away_goals",
    "full_time_home_goals",
    "full_time_away_goals",
  ]

  data.forEach((row, index) => {
    const rowNumber = index + 1

    const missingFields = requiredFields.filter((field) => {
      const value = row[field]
      return value === undefined || value === null || value === ""
    })

    if (missingFields.length > 0) {
      errors.push({
        type: "Validation",
        code: "MISSING_FIELD",
        message: `Row ${rowNumber}: Missing required field(s): ${missingFields.join(", ")}`,
        row: rowNumber,
      })
      return
    }

    const halfTimeHome = parseInt(row.half_time_home_goals, 10)
    const halfTimeAway = parseInt(row.half_time_away_goals, 10)
    const fullTimeHome = parseInt(row.full_time_home_goals, 10)
    const fullTimeAway = parseInt(row.full_time_away_goals, 10)

    if (isNaN(halfTimeHome) || isNaN(halfTimeAway) || isNaN(fullTimeHome) || isNaN(fullTimeAway)) {
      errors.push({
        type: "Validation",
        code: "INVALID_NUMBER",
        message: `Row ${rowNumber}: Goal values must be valid numbers`,
        row: rowNumber,
      })
      return
    }

    if (halfTimeHome < 0 || halfTimeAway < 0 || fullTimeHome < 0 || fullTimeAway < 0) {
      errors.push({
        type: "Validation",
        code: "NEGATIVE_GOALS",
        message: `Row ${rowNumber}: Goal values cannot be negative`,
        row: rowNumber,
      })
      return
    }

    if (fullTimeHome < halfTimeHome || fullTimeAway < halfTimeAway) {
      warnings.push({
        type: "Validation",
        code: "GOAL_INCONSISTENCY",
        message: `Row ${rowNumber}: Full-time goals (${fullTimeHome}-${fullTimeAway}) should be >= half-time goals (${halfTimeHome}-${halfTimeAway})`,
        row: rowNumber,
      })
    }

    const match: Match = {
      match_time: row.match_time.trim(),
      home_team: row.home_team.trim(),
      away_team: row.away_team.trim(),
      half_time_home_goals: halfTimeHome,
      half_time_away_goals: halfTimeAway,
      full_time_home_goals: fullTimeHome,
      full_time_away_goals: fullTimeAway,
      ht_home_score: halfTimeHome,
      ht_away_score: halfTimeAway,
      home_score: fullTimeHome,
      away_score: fullTimeAway,
      round: row.round,
      league: row.league,
      venue: row.venue,
      referee: row.referee,
    }

    parsedData.push(match)
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    parsedData,
  }
}

export interface UseCSVPreviewResult {
  isLoading: boolean
  parsedData: Match[] | null
  validationResult: CSVValidationResult | null
  fileName: string | null
  parseFile: (file: File) => Promise<void>
  resetPreview: () => void
}

export function useCSVPreview(): UseCSVPreviewResult {
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState<Match[] | null>(null)
  const [validationResult, setValidationResult] = useState<CSVValidationResult | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const parseFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setFileName(file.name)
    setParsedData(null)
    setValidationResult(null)

    try {
      const parseResults: CSVParseResult<CSVMatchRow> = await parseCSV(file)
      const validation = validateCSVData(parseResults.data, parseResults.errors)

      setValidationResult(validation)
      if (validation.isValid) {
        setParsedData(validation.parsedData as Match[])
      } else {
        setParsedData(null)
      }
    } catch (error: any) {
      console.error("Error during CSV parsing:", error)
      setValidationResult({
        isValid: false,
        errors: [
          {
            type: "Parsing",
            code: "PARSE_ERROR",
            message: error.message || "An unknown error occurred during CSV parsing.",
            row: -1,
          },
        ],
        warnings: [],
        parsedData: [],
      })
      setParsedData(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPreview = useCallback(() => {
    setIsLoading(false)
    setParsedData(null)
    setValidationResult(null)
    setFileName(null)
  }, [])

  return {
    isLoading,
    parsedData,
    validationResult,
    fileName,
    parseFile,
    resetPreview,
  }
}
