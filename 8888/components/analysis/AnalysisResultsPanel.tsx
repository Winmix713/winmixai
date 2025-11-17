import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart, PieChart } from "lucide-react"
import type { PatternAnalysisResult, AnalysisJob } from "@/analysis/types"
import { ChartService } from "@/services/visualization/chart-service"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ReportService } from "@/services/reporting/report-service"
import { useToast } from "@/components/ui/use-toast"

interface AnalysisResultsPanelProps {
  analysisResults: PatternAnalysisResult[]
  analysisJobs: AnalysisJob[]
}

const chartService = new ChartService()
const reportService = new ReportService()

export function AnalysisResultsPanel({ analysisResults, analysisJobs }: AnalysisResultsPanelProps) {
  const { toast } = useToast()
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)

  const latestCompletedJob = useMemo(() => {
    return analysisJobs
      .filter((job) => job.status === "completed" && job.results)
      .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0]
  }, [analysisJobs])

  const latestRunningJob = useMemo(() => {
    return analysisJobs
      .filter((job) => job.status === "running")
      .sort((a, b) => new Date(b.startTime || 0).getTime() - new Date(a.startTime || 0).getTime())[0]
  }, [analysisJobs])

  const displayResults = useMemo(() => {
    if (expandedResultId) {
      return analysisResults.filter((r) => r.patternId === expandedResultId)
    }
    if (latestCompletedJob && latestCompletedJob.results) {
      return Object.values(latestCompletedJob.results)
    }
    return []
  }, [analysisResults, expandedResultId, latestCompletedJob])

  const handleDownloadReport = (result: PatternAnalysisResult, format: "txt" | "csv") => {
    let content = ""
    let filename = ""

    if (format === "txt") {
      content = reportService.generatePatternSummaryReport(result)
      filename = `${result.patternName.replace(/\s/g, "_")}_summary.txt`
    } else if (format === "csv") {
      content = reportService.generateOccurrencesCsv(result.occurrenceDetails)
      filename = `${result.patternName.replace(/\s/g, "_")}_occurrences.csv`
    }

    const blob = new Blob([content], { type: format === "txt" ? "text/plain" : "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: `${filename} has been downloaded successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      {latestRunningJob && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-amber-400">Analysis in Progress</CardTitle>
            <CardDescription className="text-gray-400">{latestRunningJob.patternIds.length} patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={latestRunningJob.progress || 0} className="h-2" />
            <p className="text-sm text-gray-400 mt-2">{latestRunningJob.progress || 0}% complete</p>
          </CardContent>
        </Card>
      )}

      {displayResults.length > 0 ? (
        <div className="space-y-4">
          {displayResults.map((result) => (
            <Card key={result.patternId} className="bg-black/20 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{result.patternName}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(result, "txt")}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      TXT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReport(result, "csv")}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-gray-400">
                  {result.occurrences} occurrences detected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Occurrences</p>
                    <p className="text-2xl font-bold text-white">{result.occurrences}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Frequency</p>
                    <p className="text-2xl font-bold text-white">{(result.frequency * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Confidence</p>
                    <p className="text-2xl font-bold text-white">{(result.confidenceInterval[0] * 100).toFixed(0)}-{(result.confidenceInterval[1] * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Recent Occurrences</h4>
                  <div className="space-y-2">
                    {result.occurrenceDetails.slice(0, 5).map((occurrence, i) => (
                      <div key={i} className="text-sm text-gray-400 flex justify-between">
                        <span>{occurrence.homeTeam} vs {occurrence.awayTeam}</span>
                        <span>{occurrence.ftHomeScore}-{occurrence.ftAwayScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="py-12">
            <div className="text-center text-gray-400">
              <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analysis results available yet.</p>
              <p className="text-sm mt-2">Run an analysis job to see results here.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
