import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target, Activity, Calendar } from 'lucide-react';
import type { PatternPerformanceMetrics } from '@/analysis/pattern-performance.types';
import { format } from 'date-fns';

interface PatternPerformanceMetricsProps {
  metrics: PatternPerformanceMetrics;
  patternName: string;
}

export function PatternPerformanceDisplay({ metrics, patternName }: PatternPerformanceMetricsProps) {
  const getTrendIcon = () => {
    switch (metrics.trendDirection) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
        <CardDescription>{patternName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Success Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <span className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</span>
            </div>
            <div className="space-y-1">
              <Progress 
                value={metrics.successRate} 
                className={getSuccessRateColor(metrics.successRate)}
              />
              <p className="text-xs text-muted-foreground">
                {metrics.successfulPredictions} successful out of {metrics.totalOccurrences} occurrences
              </p>
            </div>
          </div>

          {/* Reliability Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reliability Score</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getReliabilityColor(metrics.reliabilityScore)}`}>
                  {metrics.reliabilityScore.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 10</span>
              </div>
            </div>
            <Progress value={(metrics.reliabilityScore / 10) * 100} />
          </div>

          {/* Trend Direction */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-sm font-medium">Trend</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {metrics.trendDirection}
            </Badge>
          </div>

          {/* Average Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg. Confidence</span>
              <span className="text-lg font-semibold">{metrics.avgConfidence.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.avgConfidence} />
          </div>

          {/* Last Seen */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Seen</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {metrics.lastSeenDate 
                ? format(new Date(metrics.lastSeenDate), 'MMM d, yyyy')
                : 'Never'}
            </span>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Occurrences</p>
              <p className="text-2xl font-bold">{metrics.totalOccurrences}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-green-500">
                {metrics.successfulPredictions}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
