import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CSVValidationResult } from '@/types/csv.types'

interface EnhancedCSVValidationProps {
  validation: CSVValidationResult
}

export function EnhancedCSVValidation({ validation }: EnhancedCSVValidationProps) {
  const { errors, warnings, parsedData } = validation
  const totalRows = parsedData.length + errors.length

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            {validation.isValid ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Validation Successful
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                Validation Failed
              </>
            )}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {totalRows} total rows • {parsedData.length} valid • {errors.length} errors • {warnings.length} warnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {parsedData.length} Valid Rows
            </Badge>
            {errors.length > 0 && (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                {errors.length} Errors
              </Badge>
            )}
            {warnings.length > 0 && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {warnings.length} Warnings
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errors Found</AlertTitle>
          <AlertDescription>
            <ScrollArea className="h-[200px] mt-2">
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm bg-destructive/5 p-2 rounded border border-destructive/20">
                    <span className="font-medium">Row {error.row}:</span> {error.message}
                    {error.code && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {error.code}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert className="bg-warning/10 border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning">Warnings</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            <ScrollArea className="h-[150px] mt-2">
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="text-sm bg-warning/5 p-2 rounded border border-warning/20">
                    <span className="font-medium">Row {warning.row}:</span> {warning.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AlertDescription>
        </Alert>
      )}

      {/* Info */}
      {validation.isValid && errors.length === 0 && (
        <Alert className="bg-primary/10 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Ready to Import</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            All rows passed validation. Click "Import Data" to add these matches to your league.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
