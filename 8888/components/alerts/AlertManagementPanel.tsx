import { useState } from 'react'
import { Bell, Plus, Edit2, Trash2, Power, PowerOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { Alert, PatternDefinition } from '@/analysis/types'
import { format } from 'date-fns'

interface AlertManagementPanelProps {
  alerts: Alert[]
  patterns: PatternDefinition[]
  onAddAlert: () => void
  onEditAlert: (alert: Alert) => void
  onDeleteAlert: (alertId: string) => void
  onToggleAlert: (alertId: string, isActive: boolean) => void
}

export function AlertManagementPanel({
  alerts,
  patterns,
  onAddAlert,
  onEditAlert,
  onDeleteAlert,
  onToggleAlert,
}: AlertManagementPanelProps) {
  const [deleteAlertId, setDeleteAlertId] = useState<string | null>(null)

  const getPatternName = (patternId: string) => {
    return patterns.find(p => p.id === patternId)?.name || 'Unknown Pattern'
  }

  const handleDeleteConfirm = () => {
    if (deleteAlertId) {
      onDeleteAlert(deleteAlertId)
      setDeleteAlertId(null)
    }
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-primary" />
                Alert Management
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure alerts to be notified when patterns match specific conditions
              </CardDescription>
            </div>
            <Button
              onClick={onAddAlert}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No alerts configured</p>
              <Button
                onClick={onAddAlert}
                variant="outline"
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {alerts.map(alert => (
                  <Card key={alert.id} className="bg-muted/30 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{alert.name}</h3>
                            <Badge
                              variant="outline"
                              className={
                                alert.isActive
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-muted text-muted-foreground border-border'
                              }
                            >
                              {alert.isActive ? (
                                <>
                                  <Power className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <PowerOff className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <strong className="text-foreground">Pattern:</strong>{' '}
                              {getPatternName(alert.patternId)}
                            </p>
                            <p>
                              <strong className="text-foreground">Conditions:</strong>{' '}
                              {alert.conditions.length} condition{alert.conditions.length !== 1 ? 's' : ''}
                            </p>
                            <p>
                              <strong className="text-foreground">Actions:</strong>{' '}
                              {alert.actions.map(a => a.type).join(', ')}
                            </p>
                            {alert.lastTriggered && (
                              <p>
                                <strong className="text-foreground">Last Triggered:</strong>{' '}
                                {format(new Date(alert.lastTriggered), 'PPp')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={(checked) => onToggleAlert(alert.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditAlert(alert)}
                            className="text-foreground hover:bg-muted"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteAlertId(alert.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteAlertId} onOpenChange={() => setDeleteAlertId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Alert</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this alert? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
