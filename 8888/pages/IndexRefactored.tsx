import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, FileUp, BarChart, Bell } from 'lucide-react'
import { LeagueHeader } from '@/components/league/LeagueHeader'
import { EditLeagueModal } from '@/components/league/EditLeagueModal'
import { DeleteLeagueDialog } from '@/components/league/DeleteLeagueDialog'
import { CompleteLeagueDialog } from '@/components/league/CompleteLeagueDialog'
import { NewLeagueModal } from '@/components/NewLeagueModal'
import { CSVUpload } from '@/components/CSVUpload'
import { LeagueTable } from '@/components/LeagueTable'
import { LeagueDetails } from '@/components/LeagueDetails'
import { PatternAnalysisPage } from '@/components/PatternAnalysisPage'
import { AlertManagementPanel } from '@/components/alerts/AlertManagementPanel'
import { CreateAlertModal } from '@/components/alerts/CreateAlertModal'
import { useServices } from '@/contexts/ServicesContext'
import { useLeagueManagement } from '@/hooks/useLeagueManagement'
import { useToast } from '@/hooks/use-toast'
import type { LeagueData, Match } from '@/types/league.types'
import type { AnalysisJob } from '@/analysis/types'

export default function IndexRefactored() {
  const { toast } = useToast()
  const {
    leagues,
    patternDefinitions,
    alerts,
    patternAnalysisService,
    dataRepository,
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
  } = useServices()

  const {
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
  } = useLeagueManagement()

  const [isCSVUploadOpen, setIsCSVUploadOpen] = useState(false)
  const [analysisJobs, setAnalysisJobs] = useState<AnalysisJob[]>([])
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    league.season.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateLeague = async (leagueId: string) => {
    const league: LeagueData = {
      id: `league-${Date.now()}`,
      name: leagueId,
      season: new Date().getFullYear().toString(),
      status: 'In Progress',
      winner: '',
      secondPlace: '',
      thirdPlace: '',
    }
    addLeague(league)
    toast({
      title: 'League Created',
      description: `${league.name} has been created successfully.`,
    })
  }

  const handleUpdateLeague = (leagueId: string, updates: Partial<LeagueData>) => {
    updateLeague(leagueId, updates)
    toast({
      title: 'League Updated',
      description: 'League information has been updated.',
    })
  }

  const handleDeleteLeague = (leagueId: string) => {
    deleteLeague(leagueId)
    if (selectedLeague?.id === leagueId) {
      setSelectedLeague(null)
    }
    toast({
      title: 'League Deleted',
      description: 'The league has been permanently deleted.',
    })
  }

  const handleCompleteLeague = (leagueId: string) => {
    updateLeague(leagueId, { status: 'Completed' })
    toast({
      title: 'League Completed',
      description: 'The league has been marked as completed.',
    })
  }

  const handleMatchesImported = (matches: Match[]) => {
    addMatches(matches)
    toast({
      title: 'Import Successful',
      description: `${matches.length} matches have been imported.`,
    })
    setIsCSVUploadOpen(false)
  }

  const handleRunAnalysisJob = (job: AnalysisJob) => {
    setAnalysisJobs(prev => [...prev, job])
    toast({
      title: 'Analysis Started',
      description: 'Pattern analysis is running...',
    })
  }

  const handleToggleAlert = (alertId: string, isActive: boolean) => {
    const alert = alerts.find(a => a.id === alertId)
    if (alert) {
      updateAlert({ ...alert, isActive })
      toast({
        title: isActive ? 'Alert Activated' : 'Alert Deactivated',
        description: `Alert "${alert.name}" has been ${isActive ? 'activated' : 'deactivated'}.`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <LeagueHeader season="2023/24" />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="leagues" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="leagues" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Leagues
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart className="h-4 w-4 mr-2" />
              Pattern Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Leagues Tab */}
          <TabsContent value="leagues" className="space-y-6">
            {!selectedLeague ? (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-foreground">League Management</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Create and manage your soccer league data
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsCSVUploadOpen(true)}
                          variant="outline"
                          className="bg-card border-border text-foreground hover:bg-muted"
                        >
                          <FileUp className="h-4 w-4 mr-2" />
                          Import CSV
                        </Button>
                        <Button onClick={openNewLeagueModal} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <Plus className="h-4 w-4 mr-2" />
                          New League
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search leagues..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-background border-border text-foreground"
                        />
                      </div>
                    </div>

                    <LeagueTable
                      leagues={filteredLeagues}
                      onLeagueAction={(leagueId, action) => {
                        const league = leagues.find(l => l.id === leagueId)
                        if (!league) return
                        
                        switch (action) {
                          case 'view':
                            setSelectedLeague(league)
                            break
                          case 'edit':
                            openEditLeagueModal(league)
                            break
                          case 'delete':
                            openDeleteDialog(league)
                            break
                          case 'complete':
                            openCompleteDialog(league)
                            break
                        }
                      }}
                      onSearch={setSearchQuery}
                      onNewLeague={openNewLeagueModal}
                    />
                  </CardContent>
                </Card>

                {isCSVUploadOpen && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Import Match Data</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Upload a CSV file containing match results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CSVUpload onMatchesImported={handleMatchesImported} />
                      <Button
                        variant="outline"
                        onClick={() => setIsCSVUploadOpen(false)}
                        className="mt-4"
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <LeagueDetails
                league={selectedLeague}
                onBack={() => setSelectedLeague(null)}
                dataRepository={dataRepository}
                onUpdateMatches={(leagueId, matches) => {
                  addMatches(matches)
                }}
                patternAnalysisService={patternAnalysisService}
                alertService={{ alerts: [] } as any}
                dataImportService={{ importData: async () => {} } as any}
                patternDefinitions={patternDefinitions}
                analysisJobs={analysisJobs}
                alerts={alerts}
                onAddPattern={addPattern}
                onUpdatePattern={updatePattern}
                onDeletePattern={deletePattern}
                onRunAnalysisJob={handleRunAnalysisJob}
                onAddAlert={addAlert}
                onUpdateAlert={updateAlert}
                onDeleteAlert={deleteAlert}
              />
            )}
          </TabsContent>

          {/* Pattern Analysis Tab */}
          <TabsContent value="patterns">
            <PatternAnalysisPage
              matches={dataRepository.getAllMatches()}
              leagues={leagues}
              patternAnalysisService={patternAnalysisService}
              patternDefinitions={patternDefinitions}
              analysisJobs={analysisJobs}
              onAddPattern={addPattern}
              onUpdatePattern={updatePattern}
              onDeletePattern={deletePattern}
              onRunAnalysisJob={handleRunAnalysisJob}
            />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertManagementPanel
              alerts={alerts}
              patterns={patternDefinitions}
              onAddAlert={() => setIsAlertModalOpen(true)}
              onEditAlert={(alert) => {
                // TODO: Implement edit functionality
                toast({ title: 'Edit Alert', description: 'Edit functionality coming soon!' })
              }}
              onDeleteAlert={deleteAlert}
              onToggleAlert={handleToggleAlert}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals and Dialogs */}
      <NewLeagueModal
        open={isNewLeagueModalOpen}
        onClose={closeNewLeagueModal}
        onCreateLeague={handleCreateLeague}
      />

      <EditLeagueModal
        open={isEditLeagueModalOpen}
        onClose={closeEditLeagueModal}
        league={editingLeague}
        onSave={handleUpdateLeague}
      />

      <DeleteLeagueDialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        league={leagueToDelete}
        onConfirm={handleDeleteLeague}
      />

      <CompleteLeagueDialog
        open={isCompleteDialogOpen}
        onClose={closeCompleteDialog}
        league={leagueToComplete}
        onConfirm={handleCompleteLeague}
      />

      <CreateAlertModal
        open={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        patterns={patternDefinitions}
        onSave={addAlert}
      />
    </div>
  )
}
