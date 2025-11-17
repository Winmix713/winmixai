
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Target, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { sportRadarService } from '@/services/sportRadarApi';
import { TeamStatistics } from '@/types/sportradar';

export const LiveDataDemo = () => {
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');

  // Premier League 2023/24 szezon ID (példa)
  const premierLeagueSeasonId = 'sr:season:118689';

  const { data: competitors, isLoading: competitorsLoading } = useQuery({
    queryKey: ['competitors', premierLeagueSeasonId],
    queryFn: () => sportRadarService.getSeasonCompetitors(premierLeagueSeasonId),
    enabled: !!premierLeagueSeasonId
  });

  const { data: statistics, isLoading: statisticsLoading, error } = useQuery({
    queryKey: ['competitor-statistics', premierLeagueSeasonId, selectedCompetitor],
    queryFn: () => sportRadarService.getCompetitorStatistics(premierLeagueSeasonId, selectedCompetitor),
    enabled: !!selectedCompetitor
  });

  const renderStatisticCard = (title: string, value: number | string, icon: any, color: string) => {
    const IconComponent = icon;
    return (
      <Card className="p-4 bg-gradient-glass backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-${color}/10`}>
            <IconComponent className={`w-5 h-5 text-${color}`} />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <BarChart3 className="w-4 h-4 mr-2" />
            Élő Adatok Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Sportradar API
            <span className="block text-primary">Valós Idejű Integráció</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Válasszon egy csapatot és tekintse meg a valós szezonális statisztikákat közvetlenül a Sportradar API-ból.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Premier League 2023/24 Csapatok</label>
                <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Válasszon egy csapatot..." />
                  </SelectTrigger>
                  <SelectContent>
                    {competitorsLoading ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Betöltés...
                      </SelectItem>
                    ) : (
                      competitors?.season_competitors?.map((competitor: any) => (
                        <SelectItem key={competitor.id} value={competitor.id}>
                          {competitor.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {statisticsLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Statisztikák betöltése...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <Card className="p-6 bg-destructive/10 border-destructive/20 max-w-md mx-auto">
              <p className="text-destructive">Hiba történt az adatok betöltése során</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error instanceof Error ? error.message : 'Ismeretlen hiba'}
              </p>
            </Card>
          </div>
        )}

        {statistics && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                {competitors?.season_competitors?.find((c: any) => c.id === selectedCompetitor)?.name}
              </h3>
              <Badge variant="outline">Premier League 2023/24 Szezon</Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderStatisticCard(
                'Lejátszott Meccsek',
                statistics.statistics?.matches_played || 0,
                Users,
                'primary'
              )}
              {renderStatisticCard(
                'Lőtt Gólok',
                statistics.statistics?.goals_scored || 0,
                Target,
                'success'
              )}
              {renderStatisticCard(
                'Kapott Gólok',
                statistics.statistics?.goals_conceded || 0,
                TrendingUp,
                'destructive'
              )}
              {renderStatisticCard(
                'Győzelmek',
                statistics.statistics?.matches_won || 0,
                BarChart3,
                'secondary'
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Támadó Statisztikák
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lövések összesen:</span>
                    <span className="font-medium">{statistics.statistics?.shots_total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kapura lövések:</span>
                    <span className="font-medium">{statistics.statistics?.shots_on_target || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Szögletek:</span>
                    <span className="font-medium">{statistics.statistics?.corner_kicks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gól/meccs átlag:</span>
                    <span className="font-medium">
                      {statistics.statistics?.matches_played > 0 
                        ? (statistics.statistics.goals_scored / statistics.statistics.matches_played).toFixed(2)
                        : '0.00'
                      }
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-secondary" />
                  Általános Teljesítmény
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Győzelem:</span>
                    <span className="font-medium">{statistics.statistics?.matches_won || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Döntetlen:</span>
                    <span className="font-medium">{statistics.statistics?.matches_drawn || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vereség:</span>
                    <span className="font-medium">{statistics.statistics?.matches_lost || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sárga lapok:</span>
                    <span className="font-medium">{statistics.statistics?.yellow_cards || 0}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
