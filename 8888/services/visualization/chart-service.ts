import type { PatternAnalysisResult } from '@/analysis/types'

export class ChartService {
  generateOccurrenceDistribution(result: PatternAnalysisResult) {
    return {
      labels: ['Occurrences', 'Non-Occurrences'],
      data: [result.occurrences, result.totalMatches - result.occurrences]
    }
  }

  generateTeamFrequencies(result: PatternAnalysisResult) {
    const teamFrequencies = result.teamFrequencies || {}
    return {
      labels: Object.keys(teamFrequencies),
      data: Object.values(teamFrequencies)
    }
  }

  generateSeasonalTrends(result: PatternAnalysisResult) {
    const seasonalTrends = result.seasonalTrends || {}
    return {
      labels: Object.keys(seasonalTrends),
      data: Object.values(seasonalTrends)
    }
  }

  generateOccurrenceChart(result: PatternAnalysisResult): any {
    return {
      type: "line",
      data: result.occurrenceDetails.map((detail, index) => ({
        x: index,
        y: detail.confidence,
      })),
    }
  }

  generateTrendChart(results: PatternAnalysisResult[]): any {
    return {
      type: "bar",
      data: results.map((result) => ({
        label: result.patternName,
        value: result.occurrences,
      })),
    }
  }

  generateDistributionChart(result: PatternAnalysisResult): any {
    return {
      type: "pie",
      data: [
        { label: "High Confidence", value: result.occurrenceDetails.filter((d) => d.confidence > 0.8).length },
        {
          label: "Medium Confidence",
          value: result.occurrenceDetails.filter((d) => d.confidence >= 0.5 && d.confidence <= 0.8).length,
        },
        { label: "Low Confidence", value: result.occurrenceDetails.filter((d) => d.confidence < 0.5).length },
      ],
    }
  }
}
