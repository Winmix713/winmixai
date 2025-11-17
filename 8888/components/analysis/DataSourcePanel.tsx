import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Database, FileText, Globe, Trash, Edit, RefreshCw, Info } from "lucide-react"
import type { DataSource } from "@/analysis/types"

interface DataSourcePanelProps {
  dataSources: DataSource[]
  onAddDataSource: (dataSource: DataSource) => void
  onUpdateDataSource: (dataSource: DataSource) => void
  onDeleteDataSource: (dataSourceId: string) => void
  onSyncDataSource: (dataSourceId: string) => void
}

export function DataSourcePanel({
  dataSources,
  onAddDataSource,
  onUpdateDataSource,
  onDeleteDataSource,
  onSyncDataSource,
}: DataSourcePanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDataSourceId, setEditingDataSourceId] = useState<string | null>(null)
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: "",
    type: "csv",
    config: {},
  })

  const resetNewDataSourceForm = () => {
    setNewDataSource({
      name: "",
      type: "csv",
      config: {},
    })
  }

  const handleAddDataSource = () => {
    if (!newDataSource.name || !newDataSource.type) return

    const dataSource: DataSource = {
      id: `ds-${Date.now()}`,
      name: newDataSource.name,
      type: newDataSource.type,
      config: newDataSource.config || {},
      lastSynced: undefined,
    }

    onAddDataSource(dataSource)
    setIsAddDialogOpen(false)
    resetNewDataSourceForm()
  }

  const handleEditDataSource = (dataSource: DataSource) => {
    setEditingDataSourceId(dataSource.id)
    setNewDataSource({
      name: dataSource.name,
      type: dataSource.type,
      config: dataSource.config,
    })
  }

  const handleUpdateDataSource = () => {
    if (!editingDataSourceId || !newDataSource.name || !newDataSource.type) return

    const updatedDataSource: DataSource = {
      id: editingDataSourceId,
      name: newDataSource.name,
      type: newDataSource.type,
      config: newDataSource.config || {},
      lastSynced: dataSources.find((ds) => ds.id === editingDataSourceId)?.lastSynced,
    }

    onUpdateDataSource(updatedDataSource)
    setEditingDataSourceId(null)
    resetNewDataSourceForm()
  }

  const getDataSourceIcon = (type: DataSource["type"]) => {
    switch (type) {
      case "csv":
        return <FileText className="h-5 w-5" />
      case "api":
        return <Globe className="h-5 w-5" />
      case "database":
        return <Database className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-500" />
          Data Sources
        </h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Source
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0f14] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription className="text-gray-400">
                Connect a new data source to import match data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ds-name">Name</Label>
                <Input
                  id="ds-name"
                  value={newDataSource.name}
                  onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
                  className="bg-black/30 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="ds-type">Type</Label>
                <Select
                  value={newDataSource.type}
                  onValueChange={(value: DataSource["type"]) => setNewDataSource({ ...newDataSource, type: value })}
                >
                  <SelectTrigger className="bg-black/30 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDataSource} className="bg-blue-600 hover:bg-blue-700">
                Add Source
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getDataSourceIcon(source.type)}
                {source.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">Type: {source.type.toUpperCase()}</p>
              {source.lastSynced && (
                <p className="text-xs text-gray-500 mt-1">
                  Last synced: {new Date(source.lastSynced).toLocaleString()}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSyncDataSource(source.id)}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditDataSource(source)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteDataSource(source.id)}>
                <Trash className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
