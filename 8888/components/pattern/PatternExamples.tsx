import { Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PatternDefinition } from '@/analysis/types'

const EXAMPLE_PATTERNS: Array<Omit<PatternDefinition, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    name: 'Home Comeback',
    description: 'Home team losing at halftime but winning at fulltime',
    conditions: [
      { id: '1', type: 'halftime_score', operator: '<', value: '0', field: 'home_goal_diff' },
      { id: '2', type: 'fulltime_score', operator: '>', value: '0', field: 'home_goal_diff' },
    ],
  },
  {
    name: 'High Scoring First Half',
    description: 'More than 3 goals scored in the first half',
    conditions: [
      { id: '1', type: 'total_goals', operator: '>', value: '3', target: 'halftime' },
    ],
  },
  {
    name: 'Draw to Win',
    description: 'Match tied at halftime but decided at fulltime',
    conditions: [
      { id: '1', type: 'goal_difference', operator: '=', value: '0', target: 'halftime' },
      { id: '2', type: 'goal_difference', operator: '!=', value: '0', target: 'fulltime' },
    ],
  },
  {
    name: 'Goal Explosion',
    description: 'More than 5 total goals in the match',
    conditions: [
      { id: '1', type: 'total_goals', operator: '>', value: '5', target: 'fulltime' },
    ],
  },
  {
    name: 'Low Scoring Match',
    description: 'Less than 2 total goals in the match',
    conditions: [
      { id: '1', type: 'total_goals', operator: '<', value: '2', target: 'fulltime' },
    ],
  },
]

interface PatternExamplesProps {
  onSelectExample: (pattern: Omit<PatternDefinition, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function PatternExamples({ onSelectExample }: PatternExamplesProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Lightbulb className="h-5 w-5 text-primary" />
          Pattern Examples
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {EXAMPLE_PATTERNS.map((pattern, index) => (
            <Card key={index} className="bg-muted/30 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{pattern.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {pattern.conditions.length} condition{pattern.conditions.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectExample(pattern)}
                    className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  >
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
