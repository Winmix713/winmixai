import { useEffect } from "react"
import { FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCSVPreview } from "@/hooks/useCSVPreview"
import { EnhancedCSVValidation } from "@/components/csv/EnhancedCSVValidation"
import type { Match } from "@/types/league.types"

interface CSVPreviewProps {
  file: File
  onConfirm: (matches: Match[]) => void
  onCancel: () => void
}

export function CSVPreview({ file, onConfirm, onCancel }: CSVPreviewProps) {
  const { isLoading, parsedData, validationResult, parseFile } = useCSVPreview()

  useEffect(() => {
    if (file) {
      parseFile(file)
    }
  }, [file, parseFile])

  const handleConfirm = () => {
    if (parsedData) {
      onConfirm(parsedData)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Parsing CSV file...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!validationResult) {
    return null
  }

  const hasErrors = validationResult.errors.length > 0

  return (
    <div className="space-y-4">
      <EnhancedCSVValidation validation={validationResult} />

      {!hasErrors && parsedData && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileCheck className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {parsedData.length} match{parsedData.length !== 1 ? "es" : ""} found - showing first 10
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {parsedData.slice(0, 10).map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {match.home_team} vs {match.away_team}
                      </p>
                      <p className="text-xs text-muted-foreground">{match.match_time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {match.full_time_home_goals} - {match.full_time_away_goals}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        HT: {match.half_time_home_goals} - {match.half_time_away_goals}
                      </p>
                    </div>
                  </div>
                ))}
                {parsedData.length > 10 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    ... and {parsedData.length - 10} more matches
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {!hasErrors && parsedData && (
          <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Import {parsedData.length} Match{parsedData.length !== 1 ? "es" : ""}
          </Button>
        )}
      </div>
    </div>
  )
}
