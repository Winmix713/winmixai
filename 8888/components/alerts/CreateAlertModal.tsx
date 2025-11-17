import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import type { Alert, AlertCondition, AlertAction, PatternDefinition } from '@/analysis/types'

const alertSchema = z.object({
  name: z.string().min(1, 'Alert name is required'),
  patternId: z.string().min(1, 'Please select a pattern'),
})

type AlertFormData = z.infer<typeof alertSchema>

interface CreateAlertModalProps {
  open: boolean
  onClose: () => void
  patterns: PatternDefinition[]
  onSave: (alert: Alert) => void
}

const CONDITION_TYPES = [
  { value: 'frequency', label: 'Frequency (%)' },
  { value: 'occurrences', label: 'Occurrences Count' },
  { value: 'confidence', label: 'Confidence Level' },
]

const OPERATORS = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '=', label: '=' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
]

const ACTION_TYPES = [
  { value: 'notification', label: 'In-App Notification' },
  { value: 'log', label: 'Console Log' },
  { value: 'email', label: 'Email (Placeholder)' },
  { value: 'webhook', label: 'Webhook (Placeholder)' },
]

export function CreateAlertModal({ open, onClose, patterns, onSave }: CreateAlertModalProps) {
  const [conditions, setConditions] = useState<AlertCondition[]>([])
  const [actions, setActions] = useState<AlertAction[]>([])

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      name: '',
      patternId: '',
    },
  })

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        type: 'frequency',
        operator: '>',
        value: 0,
      },
    ])
  }

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, updates: Partial<AlertCondition>) => {
    setConditions(conditions.map((c, i) => (i === index ? { ...c, ...updates } : c)))
  }

  const addAction = () => {
    setActions([
      ...actions,
      {
        type: 'notification',
        config: {},
      },
    ])
  }

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const updateAction = (index: number, type: string) => {
    setActions(actions.map((a, i) => (i === index ? { ...a, type: type as any } : a)))
  }

  const onSubmit = (data: AlertFormData) => {
    if (conditions.length === 0) {
      form.setError('patternId', { message: 'Please add at least one condition' })
      return
    }

    if (actions.length === 0) {
      form.setError('patternId', { message: 'Please add at least one action' })
      return
    }

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      name: data.name,
      patternId: data.patternId,
      conditions,
      actions,
      isActive: true,
    }

    onSave(alert)
    form.reset()
    setConditions([])
    setActions([])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Alert</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up alerts to be notified when patterns match specific conditions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Alert Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="High scoring matches alert" className="bg-background border-border text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patternId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Pattern</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select a pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {patterns.map(pattern => (
                        <SelectItem key={pattern.id} value={pattern.id} className="text-foreground">
                          {pattern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-muted-foreground">
                    The pattern to monitor for this alert
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Trigger Conditions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCondition} className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Condition
                </Button>
              </div>

              {conditions.map((condition, index) => (
                <Card key={index} className="bg-muted/30 border-border">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Condition {index + 1}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeCondition(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Select value={condition.type} onValueChange={value => updateCondition(index, { type: value as any })}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {CONDITION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value} className="text-foreground">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={condition.operator} onValueChange={value => updateCondition(index, { operator: value as any })}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {OPERATORS.map(op => (
                            <SelectItem key={op.value} value={op.value} className="text-foreground">
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input type="number" value={condition.value} onChange={e => updateCondition(index, { value: parseFloat(e.target.value) })} placeholder="Value" className="bg-background border-border text-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Alert Actions</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAction} className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action
                </Button>
              </div>

              {actions.map((action, index) => (
                <Card key={index} className="bg-muted/30 border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Select value={action.type} onValueChange={value => updateAction(index, value)}>
                        <SelectTrigger className="bg-background border-border text-foreground flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {ACTION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value} className="text-foreground">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeAction(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Alert
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
