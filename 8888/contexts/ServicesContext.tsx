import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { DataRepository } from '@/services/data/data-repository'
import { EnhancedPatternAnalysisService } from '@/analysis/enhanced-pattern-analysis-service'
import { AlertService } from '@/analysis/alert-service'
import { DataImportService } from '@/analysis/data-import-service'
import type { Match, LeagueData } from '@/types/league.types'
import type { PatternDefinition, Alert } from '@/analysis/types'

interface ServicesContextValue {
  dataRepository: DataRepository
  patternAnalysisService: EnhancedPatternAnalysisService
  alertService: AlertService
  dataImportService: DataImportService
  
  // State management
  leagues: LeagueData[]
  patternDefinitions: PatternDefinition[]
  alerts: Alert[]
  
  // Actions
  addLeague: (league: LeagueData) => void
  updateLeague: (leagueId: string, updates: Partial<LeagueData>) => void
  deleteLeague: (leagueId: string) => void
  addMatches: (matches: Match[]) => void
  addPattern: (pattern: PatternDefinition) => void
  updatePattern: (pattern: PatternDefinition) => void
  deletePattern: (patternId: string) => void
  addAlert: (alert: Alert) => void
  updateAlert: (alert: Alert) => void
  deleteAlert: (alertId: string) => void
}

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined)

export function ServicesProvider({ children }: { children: ReactNode }) {
  // Initialize services
  const [dataRepository] = useState(() => new DataRepository())
  const [patternAnalysisService] = useState(() => new EnhancedPatternAnalysisService())
  const [alertService] = useState(() => new AlertService())
  const [dataImportService] = useState(() => new DataImportService())
  
  // State
  const [leagues, setLeagues] = useState<LeagueData[]>([])
  const [patternDefinitions, setPatternDefinitions] = useState<PatternDefinition[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  // Load initial placeholder data
  useEffect(() => {
    // Load from localStorage if available
    const savedLeagues = localStorage.getItem('soccer-leagues')
    const savedPatterns = localStorage.getItem('soccer-patterns')
    const savedAlerts = localStorage.getItem('soccer-alerts')
    const savedMatches = localStorage.getItem('soccer-matches')
    
    if (savedLeagues) {
      setLeagues(JSON.parse(savedLeagues))
    }
    if (savedPatterns) setPatternDefinitions(JSON.parse(savedPatterns))
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts))
    if (savedMatches) {
      const matches = JSON.parse(savedMatches)
      dataRepository.addMatches(matches)
    }
  }, [dataRepository])
  
  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('soccer-leagues', JSON.stringify(leagues))
  }, [leagues])
  
  useEffect(() => {
    localStorage.setItem('soccer-patterns', JSON.stringify(patternDefinitions))
  }, [patternDefinitions])
  
  useEffect(() => {
    localStorage.setItem('soccer-alerts', JSON.stringify(alerts))
  }, [alerts])
  
  // League actions
  const addLeague = (league: LeagueData) => {
    setLeagues(prev => [...prev, league])
  }
  
  const updateLeague = (leagueId: string, updates: Partial<LeagueData>) => {
    setLeagues(prev => prev.map(league => 
      league.id === leagueId ? { ...league, ...updates } : league
    ))
  }
  
  const deleteLeague = (leagueId: string) => {
    setLeagues(prev => prev.filter(league => league.id !== leagueId))
  }
  
  const addMatches = (matches: Match[]) => {
    dataRepository.addMatches(matches)
    // Save matches to localStorage
    const allMatches = dataRepository.getAllMatches()
    localStorage.setItem('soccer-matches', JSON.stringify(allMatches))
  }
  
  // Pattern actions
  const addPattern = (pattern: PatternDefinition) => {
    setPatternDefinitions(prev => [...prev, pattern])
  }
  
  const updatePattern = (pattern: PatternDefinition) => {
    setPatternDefinitions(prev => prev.map(p => 
      p.id === pattern.id ? pattern : p
    ))
  }
  
  const deletePattern = (patternId: string) => {
    setPatternDefinitions(prev => prev.filter(p => p.id !== patternId))
  }
  
  // Alert actions
  const addAlert = (alert: Alert) => {
    setAlerts(prev => [...prev, alert])
  }
  
  const updateAlert = (alert: Alert) => {
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? alert : a
    ))
  }
  
  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }
  
  const value: ServicesContextValue = {
    dataRepository,
    patternAnalysisService,
    alertService,
    dataImportService,
    leagues,
    patternDefinitions,
    alerts,
    addLeague,
    updateLeague,
    deleteLeague,
    addMatches,
    addPattern,
    updatePattern,
    deletePattern,
    addAlert,
    updateAlert,
    deleteAlert,
  }
  
  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServicesContext)
  if (!context) {
    throw new Error('useServices must be used within ServicesProvider')
  }
  return context
}
