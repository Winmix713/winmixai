// Alert service for managing pattern alerts
import type { Alert, PatternAnalysisResult } from './types'

export class AlertService {
  private alerts: Alert[] = []

  constructor(initialAlerts: Alert[] = []) {
    this.alerts = initialAlerts
  }

  addAlert(alert: Alert): void {
    this.alerts.push(alert)
  }

  updateAlert(alert: Alert): void {
    const index = this.alerts.findIndex(a => a.id === alert.id)
    if (index !== -1) {
      this.alerts[index] = alert
    }
  }

  deleteAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId)
  }

  getAllAlerts(): Alert[] {
    return [...this.alerts]
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => a.isActive)
  }

  checkAlerts(analysisResults: PatternAnalysisResult[]): Alert[] {
    const triggeredAlerts: Alert[] = []

    for (const alert of this.getActiveAlerts()) {
      const result = analysisResults.find(r => r.patternId === alert.patternId)
      if (!result) continue

      const shouldTrigger = alert.conditions.every(condition => {
        switch (condition.type) {
          case 'frequency':
            return this.compareValues(result.frequency, condition.operator, condition.value)
          case 'occurrences':
            return this.compareValues(result.occurrences, condition.operator, condition.value)
          case 'confidence':
            return this.compareValues(
              result.statisticalSignificance?.confidenceLevel || 0,
              condition.operator,
              condition.value
            )
          default:
            return false
        }
      })

      if (shouldTrigger) {
        triggeredAlerts.push(alert)
        this.executeAlertActions(alert, result)
      }
    }

    return triggeredAlerts
  }

  private compareValues(actual: number, operator: string, expected: number): boolean {
    switch (operator) {
      case '>': return actual > expected
      case '<': return actual < expected
      case '=': return actual === expected
      case '>=': return actual >= expected
      case '<=': return actual <= expected
      default: return false
    }
  }

  private executeAlertActions(alert: Alert, result: PatternAnalysisResult): void {
    for (const action of alert.actions) {
      switch (action.type) {
        case 'log':
          console.log(`Alert triggered: ${alert.name}`, result)
          break
        case 'notification':
          // Implement notification logic
          console.log(`Notification for alert: ${alert.name}`)
          break
        case 'email':
          // Implement email logic
          console.log(`Email alert: ${alert.name}`)
          break
        case 'webhook':
          // Implement webhook logic
          console.log(`Webhook for alert: ${alert.name}`)
          break
      }
    }
  }
}
