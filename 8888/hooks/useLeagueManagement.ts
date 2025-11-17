import { useState, useCallback } from 'react'
import type { LeagueData, Match } from '@/types/league.types'

export interface UseLeagueManagementResult {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedLeague: LeagueData | null
  setSelectedLeague: (league: LeagueData | null) => void
  isNewLeagueModalOpen: boolean
  openNewLeagueModal: () => void
  closeNewLeagueModal: () => void
  isEditLeagueModalOpen: boolean
  openEditLeagueModal: (league: LeagueData) => void
  closeEditLeagueModal: () => void
  editingLeague: LeagueData | null
  isDeleteDialogOpen: boolean
  openDeleteDialog: (league: LeagueData) => void
  closeDeleteDialog: () => void
  leagueToDelete: LeagueData | null
  isCompleteDialogOpen: boolean
  openCompleteDialog: (league: LeagueData) => void
  closeCompleteDialog: () => void
  leagueToComplete: LeagueData | null
}

export function useLeagueManagement(): UseLeagueManagementResult {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLeague, setSelectedLeague] = useState<LeagueData | null>(null)
  const [isNewLeagueModalOpen, setIsNewLeagueModalOpen] = useState(false)
  const [isEditLeagueModalOpen, setIsEditLeagueModalOpen] = useState(false)
  const [editingLeague, setEditingLeague] = useState<LeagueData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [leagueToDelete, setLeagueToDelete] = useState<LeagueData | null>(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [leagueToComplete, setLeagueToComplete] = useState<LeagueData | null>(null)

  const openNewLeagueModal = useCallback(() => setIsNewLeagueModalOpen(true), [])
  const closeNewLeagueModal = useCallback(() => setIsNewLeagueModalOpen(false), [])

  const openEditLeagueModal = useCallback((league: LeagueData) => {
    setEditingLeague(league)
    setIsEditLeagueModalOpen(true)
  }, [])

  const closeEditLeagueModal = useCallback(() => {
    setIsEditLeagueModalOpen(false)
    setEditingLeague(null)
  }, [])

  const openDeleteDialog = useCallback((league: LeagueData) => {
    setLeagueToDelete(league)
    setIsDeleteDialogOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false)
    setLeagueToDelete(null)
  }, [])

  const openCompleteDialog = useCallback((league: LeagueData) => {
    setLeagueToComplete(league)
    setIsCompleteDialogOpen(true)
  }, [])

  const closeCompleteDialog = useCallback(() => {
    setIsCompleteDialogOpen(false)
    setLeagueToComplete(null)
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    selectedLeague,
    setSelectedLeague,
    isNewLeagueModalOpen,
    openNewLeagueModal,
    closeNewLeagueModal,
    isEditLeagueModalOpen,
    openEditLeagueModal,
    closeEditLeagueModal,
    editingLeague,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    leagueToDelete,
    isCompleteDialogOpen,
    openCompleteDialog,
    closeCompleteDialog,
    leagueToComplete,
  }
}
