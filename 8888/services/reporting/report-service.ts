import type { PatternAnalysisResult, PatternOccurrence } from '@/analysis/types'

export class ReportService {
  generatePatternSummaryReport(result: PatternAnalysisResult): string {
    let report = `Pattern Analysis Report: ${result.patternName}\n`
    report += `${"=".repeat(60)}\n\n`
    report += `Occurrence Count: ${result.occurrences}\n`
    report += `Frequency: ${(result.frequency * 100).toFixed(2)}%\n`
    report += `Confidence Interval: [${(result.confidenceInterval[0] * 100).toFixed(2)}% - ${(result.confidenceInterval[1] * 100).toFixed(2)}%]\n`
    report += `Statistical Significance: p=${result.statisticalSignificance?.pValue.toFixed(4)}\n\n`
    return report
  }

  generateOccurrencesCsv(occurrences: PatternOccurrence[]): string {
    let csv = "Date,Home Team,Away Team,HT Score,FT Score,Confidence\n"
    occurrences.forEach((occ) => {
      csv += `${occ.date},${occ.homeTeam},${occ.awayTeam},${occ.htHomeScore}-${occ.htAwayScore},${occ.ftHomeScore}-${occ.ftAwayScore},${occ.confidence}\n`
    })
    return csv
  }

  generateFullReport(results: PatternAnalysisResult[]): string {
    let report = "Full Analysis Report\n"
    report += `${"=".repeat(60)}\n\n`
    results.forEach((result) => {
      report += this.generatePatternSummaryReport(result)
      report += "\n\n"
    })
    return report
  }
}
