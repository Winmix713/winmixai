import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { PatternCondition } from '@/analysis/types'

interface PatternConditionBuilderProps {
  conditions: PatternCondition[]
  onChange: (conditions: PatternCondition[]) => void
}

const CONDITION_TYPES = [
  { value: 'halftime_score', label: 'Halftime Score' },
  { value: 'fulltime_score', label: 'Fulltime Score' },
  { value: 'goal_difference', label: 'Goal Difference' },
  { value: 'total_goals', label: 'Total Goals' },
  { value: 'team', label: 'Team Name' },
  { value: 'score_change', label: 'Score Change' },
  { value: 'custom', label: 'Custom Formula' },
]

const OPERATORS = [
  { value: '=', label: 'Equals (=)' },
  { value: '!=', label: 'Not Equals (≠)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '>=', label: 'Greater or Equal (≥)' },
  { value: '<=', label: 'Less or Equal (≤)' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Not Contains' },
]

export function PatternConditionBuilder({ conditions, onChange }: PatternConditionBuilderProps) {
  const addCondition = () => {
    const newCondition: PatternCondition = {
      id: `condition-${Date.now()}`,
      type: 'halftime_score',
      operator: '=',
      value: '',
    }
    onChange([...conditions, newCondition])
  }

  const removeCondition = (id: string) => {
    onChange(conditions.filter(c => c.id !== id))
  }

  const updateCondition = (id: string, updates: Partial<PatternCondition>) => {
    onChange(conditions.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">Pattern Conditions</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCondition}
          className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 && (
        <Card className="bg-muted/30 border-border border-dashed">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No conditions defined. Click "Add Condition" to start building your pattern.
            </p>
          </CardContent>
        </Card>
      )}

      {conditions.map((condition, index) => (
        <Card key={condition.id} className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Condition {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCondition(condition.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <Select
                  value={condition.type}
                  onValueChange={(value) => updateCondition(condition.id, { type: value as any })}
                >
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
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Operator</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(condition.id, { operator: value as any })}
                >
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
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Value</Label>
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                  placeholder="Enter value"
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            {condition.type === 'custom' && (
              <div>
                <Label className="text-xs text-muted-foreground">Custom Formula</Label>
                <Input
                  value={condition.customFormula || ''}
                  onChange={(e) => updateCondition(condition.id, { customFormula: e.target.value })}
                  placeholder="e.g., home_goals > away_goals && total_goals > 3"
                  className="bg-background border-border text-foreground font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {conditions.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Logic:</strong> All conditions must be met (AND logic)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
