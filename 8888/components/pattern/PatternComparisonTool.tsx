import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GitCompare, TrendingUp, Target, Activity, BarChart } from 'lucide-react';
import type { PatternDefinition, PatternAnalysisResult } from '@/analysis/types';
import { Progress } from '@/components/ui/progress';

interface PatternComparisonToolProps {
  patterns: PatternDefinition[];
  analysisResults: Record<string, PatternAnalysisResult>;
}

export function PatternComparisonTool({ patterns, analysisResults }: PatternComparisonToolProps) {
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);

  const togglePattern = (patternId: string) => {
    setSelectedPatterns(prev =>
      prev.includes(patternId)
        ? prev.filter(id => id !== patternId)
        : prev.length < 4
        ? [...prev, patternId]
        : prev
    );
  };

  const comparisonData = useMemo(() => {
    if (selectedPatterns.length < 2) return null;

    // Get analysis results for selected patterns
    const selectedResults = selectedPatterns
      .map(id => analysisResults[id])
      .filter(Boolean);

    if (selectedResults.length < 2) return null;

    // Calculate overlap (matches that satisfy multiple patterns)
    const occurrenceSets = selectedResults.map(result =>
      new Set(result.occurrenceDetails.map(occ => occ.matchId))
    );

    const overlapMatches = Array.from(occurrenceSets[0]).filter(matchId =>
      occurrenceSets.slice(1).every(set => set.has(matchId))
    );

    // Calculate correlation matrix
    const correlationMatrix: Record<string, Record<string, number>> = {};
    selectedPatterns.forEach((p1, i) => {
      correlationMatrix[p1] = {};
      selectedPatterns.forEach((p2, j) => {
        if (i === j) {
          correlationMatrix[p1][p2] = 1;
        } else {
          const set1 = occurrenceSets[i];
          const set2 = occurrenceSets[j];
          const intersection = Array.from(set1).filter(id => set2.has(id)).length;
          const union = new Set([...set1, ...set2]).size;
          correlationMatrix[p1][p2] = union > 0 ? intersection / union : 0;
        }
      });
    });

    // Performance ranking
    const ranking = selectedResults
      .map((result, idx) => ({
        patternId: selectedPatterns[idx],
        patternName: result.patternName,
        score: calculatePerformanceScore(result),
        result,
      }))
      .sort((a, b) => b.score - a.score);

    return {
      overlapMatches,
      overlapPercentage: (overlapMatches.length / Math.max(...occurrenceSets.map(s => s.size))) * 100,
      correlationMatrix,
      ranking,
    };
  }, [selectedPatterns, analysisResults]);

  const calculatePerformanceScore = (result: PatternAnalysisResult): number => {
    const frequencyScore = result.frequency * 100;
    const significanceScore = result.statisticalSignificance?.isSignificant ? 20 : 0;
    const occurrenceScore = Math.min((result.occurrences / result.totalMatches) * 100, 30);
    return frequencyScore * 0.5 + significanceScore + occurrenceScore * 0.5;
  };

  return (
    <div className="space-y-6">
      {/* Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Pattern Comparison
          </CardTitle>
          <CardDescription>
            Select 2-4 patterns to compare (Selected: {selectedPatterns.length}/4)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {patterns.map(pattern => {
                const result = analysisResults[pattern.id];
                const isSelected = selectedPatterns.includes(pattern.id);
                const isDisabled = !isSelected && selectedPatterns.length >= 4;

                return (
                  <div
                    key={pattern.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-accent'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !isDisabled && togglePattern(pattern.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={() => togglePattern(pattern.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{pattern.name}</div>
                      {result && (
                        <div className="text-sm text-muted-foreground">
                          {result.occurrences} occurrences ({(result.frequency * 100).toFixed(1)}%)
                        </div>
                      )}
                    </div>
                    {result?.statisticalSignificance?.isSignificant && (
                      <Badge variant="secondary">Significant</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonData && (
        <>
          {/* Overlap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Overlap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Matches satisfying all patterns</span>
                  <span className="font-semibold">
                    {comparisonData.overlapMatches.length} matches
                  </span>
                </div>
                <Progress value={comparisonData.overlapPercentage} />
                <p className="text-xs text-muted-foreground mt-1">
                  {comparisonData.overlapPercentage.toFixed(1)}% overlap rate
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Correlation Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Correlation Matrix
              </CardTitle>
              <CardDescription>
                How often patterns occur together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2"></th>
                      {selectedPatterns.map(id => {
                        const pattern = patterns.find(p => p.id === id);
                        return (
                          <th key={id} className="text-left p-2 font-medium">
                            {pattern?.name.substring(0, 20)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatterns.map(id1 => {
                      const pattern1 = patterns.find(p => p.id === id1);
                      return (
                        <tr key={id1}>
                          <td className="p-2 font-medium">{pattern1?.name.substring(0, 20)}</td>
                          {selectedPatterns.map(id2 => {
                            const correlation = comparisonData.correlationMatrix[id1]?.[id2] || 0;
                            return (
                              <td key={id2} className="p-2">
                                <div
                                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                    correlation >= 0.7
                                      ? 'bg-green-500/20 text-green-700'
                                      : correlation >= 0.4
                                      ? 'bg-yellow-500/20 text-yellow-700'
                                      : 'bg-red-500/20 text-red-700'
                                  }`}
                                >
                                  {(correlation * 100).toFixed(0)}%
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Performance Ranking
              </CardTitle>
              <CardDescription>
                Patterns ranked by performance score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonData.ranking.map((item, index) => (
                  <div key={item.patternId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.patternName}</div>
                          <div className="text-sm text-muted-foreground">
                            Score: {item.score.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          {item.result.occurrences} / {item.result.totalMatches}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(item.result.frequency * 100).toFixed(1)}% frequency
                        </div>
                      </div>
                    </div>
                    <Progress value={(item.score / Math.max(...comparisonData.ranking.map(r => r.score))) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedPatterns.length < 2 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select at least 2 patterns to compare</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
