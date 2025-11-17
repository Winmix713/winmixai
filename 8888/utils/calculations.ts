// Calculation utilities for statistics

export const calculateWinPercentage = (wins: number, total: number): number => {
  return total > 0 ? (wins / total) * 100 : 0
}

export const calculateDrawPercentage = (draws: number, total: number): number => {
  return total > 0 ? (draws / total) * 100 : 0
}

export const calculateLossPercentage = (losses: number, total: number): number => {
  return total > 0 ? (losses / total) * 100 : 0
}

export const calculateGoalDifference = (goalsFor: number, goalsAgainst: number): number => {
  return goalsFor - goalsAgainst
}

export const calculatePoints = (wins: number, draws: number): number => {
  return wins * 3 + draws
}

export const calculateAverageGoals = (totalGoals: number, matches: number): number => {
  return matches > 0 ? totalGoals / matches : 0
}

export const calculateConfidenceInterval = (
  proportion: number,
  sampleSize: number,
  confidenceLevel = 0.95
): [number, number] => {
  if (sampleSize === 0) return [0, 0]
  
  const z = confidenceLevel === 0.95 ? 1.96 : 2.576
  const margin = z * Math.sqrt((proportion * (1 - proportion)) / sampleSize)
  
  return [
    Math.max(0, proportion - margin),
    Math.min(1, proportion + margin)
  ]
}

export const calculateStatisticalSignificance = (
  observedFrequency: number,
  expectedFrequency: number,
  sampleSize: number
): { pValue: number; isSignificant: boolean } => {
  if (sampleSize === 0) return { pValue: 1, isSignificant: false }
  
  const chiSquare = Math.pow(observedFrequency - expectedFrequency, 2) / expectedFrequency
  const pValue = 1 - (1 / (1 + Math.exp(-chiSquare / 2)))
  
  return {
    pValue,
    isSignificant: pValue < 0.05
  }
}
