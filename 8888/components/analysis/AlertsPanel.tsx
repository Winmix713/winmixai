import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Bell, Trash, Edit, Mail, Globe } from "lucide-react"
import type { Alert, AlertCondition, AlertAction, PatternDefinition } from "@/analysis/types"

interface AlertsPanelProps {
  alerts: Alert[]
  patterns: PatternDefinition[]
  onAddAlert: (alert: Alert) => void
  onUpdateAlert: (alert: Alert) => void
  onDeleteAlert: (alertId: string) => void
}

export function AlertsPanel({ alerts, patterns, onAddAlert, onUpdateAlert, onDeleteAlert }: AlertsPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null)
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    name: "",
    patternId: "",
    conditions: [],
    actions: [],
    isActive: true,
  })

  const resetNewAlertForm = () => {
    setNewAlert({
      name: "",
      patternId: "",
      conditions: [],
      actions: [],
      isActive: true,
    })
  }

  const handleAddAlert = () => {
    if (!newAlert.name || !newAlert.patternId) return

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      name: newAlert.name,
      patternId: newAlert.patternId,
      conditions: newAlert.conditions || [],
      actions: newAlert.actions || [],
      isActive: newAlert.isActive !== undefined ? newAlert.isActive : true,
    }

    onAddAlert(alert)
    setIsAddDialogOpen(false)
    resetNewAlertForm()
  }

  const handleEditAlert = (alert: Alert) => {
    setEditingAlertId(alert.id)
    setNewAlert({
      name: alert.name,
      patternId: alert.patternId,
      conditions: alert.conditions,
      actions: alert.actions,
      isActive: alert.isActive,
    })
  }

  const handleUpdateAlert = () => {
    if (!editingAlertId || !newAlert.name || !newAlert.patternId) return

    const updatedAlert: Alert = {
      id: editingAlertId,
      name: newAlert.name,
      patternId: newAlert.patternId,
      conditions: newAlert.conditions || [],
      actions: newAlert.actions || [],
      isActive: newAlert.isActive !== undefined ? newAlert.isActive : true,
    }

    onUpdateAlert(updatedAlert)
    setEditingAlertId(null)
    resetNewAlertForm()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-amber-500" />
          Alerts
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0f14] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription className="text-gray-400">
                Set up automated notifications based on pattern occurrences
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input
                  id="alert-name"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  className="bg-black/30 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="pattern-select">Pattern</Label>
                <Select value={newAlert.patternId} onValueChange={(value) => setNewAlert({ ...newAlert, patternId: value })}>
                  <SelectTrigger className="bg-black/30 border-white/10">
                    <SelectValue placeholder="Select a pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {patterns.map((pattern) => (
                      <SelectItem key={pattern.id} value={pattern.id}>
                        {pattern.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="alert-active">Active</Label>
                <Switch
                  id="alert-active"
                  checked={newAlert.isActive}
                  onCheckedChange={(checked) => setNewAlert({ ...newAlert, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAlert} className="bg-blue-600 hover:bg-blue-700">
                Create Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>{alert.name}</span>
                <Switch checked={alert.isActive} onCheckedChange={(checked) => onUpdateAlert({ ...alert, isActive: checked })} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Pattern: {patterns.find((p) => p.id === alert.patternId)?.name || "Unknown"}
              </p>
              <p className="text-gray-400 text-sm mt-1">Conditions: {alert.conditions.length}</p>
              <p className="text-gray-400 text-sm">Actions: {alert.actions.length}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEditAlert(alert)} className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteAlert(alert.id)} className="flex-1">
                <Trash className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
