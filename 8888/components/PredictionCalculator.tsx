
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, Calculator, Target, TrendingUp, Brain } from 'lucide-react';
import { sportRadarService } from '@/services/sportRadarApi';
import { predictionEngine } from '@/utils/predictionEngine';
import { PredictionResult } from '@/types/sportradar';

export const PredictionCalculator = () => {
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const premierLeagueSeasonId = 'sr:season:118689';

  const { data: competitors, isLoading: competitorsLoading } = useQuery({
    queryKey: ['competitors', premierLeagueSeasonId],
    queryFn: () => sportRadarService.getSeasonCompetitors(premierLeagueSeasonId),
    enabled: !!premierLeagueSeasonId
  });

  const { data: homeStats } = useQuery({
    queryKey: ['home-stats', premierLeagueSeasonId, homeTeam],
    queryFn: () => sportRadarService.getCompetitorStatistics(premierLeagueSeasonId, homeTeam),
    enabled: !!homeTeam
  });

  const { data: awayStats } = useQuery({
    queryKey: ['away-stats', premierLeagueSeasonId, awayTeam],
    queryFn: () => sportRadarService.getCompetitorStatistics(premierLeagueSeasonId, awayTeam),
    enabled: !!awayTeam
  });

  const handleCalculatePrediction = async () => {
    if (!homeStats || !awayStats) return;

    setIsCalculating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = predictionEngine.generatePrediction({
        homeTeam: homeStats,
        awayTeam: awayStats
      });
      
      setPrediction(result);
    } catch (error) {
      console.error('Prediction calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'success';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'destructive';
      default: return 'muted';
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'Magas';
      case 'MEDIUM': return 'Közepes';
      case 'LOW': return 'Alacsony';
      default: return 'Ismeretlen';
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <Calculator className="w-4 h-4 mr-2" />
            Predikciós Kalkulátor
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            BTTS & Over 2.5
            <span className="block text-primary">Élő Előrejelzés</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Válasszon két csapatot és számítsa ki a valós Sportradar adatok alapján a BTTS és Over 2.5 valószínűségeit.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Hazai Csapat</label>
                <Select value={homeTeam} onValueChange={setHomeTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Válasszon hazai csapatot..." />
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

              <div>
                <label className="block text-sm font-medium mb-2">Vendég Csapat</label>
                <Select value={awayTeam} onValueChange={setAwayTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Válasszon vendég csapatot..." />
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

            <div className="text-center">
              <Button 
                onClick={handleCalculatePrediction}
                disabled={!homeTeam || !awayTeam || !homeStats || !awayStats || isCalculating}
                size="lg"
                className="px-8"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Számítás folyamatban...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Predikció Számítása
                  </>
                )}
              </Button>
            </div>
          </Card>

          {prediction && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 mr-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">BTTS Predikció</h3>
                    <p className="text-muted-foreground">Mindkét csapat szerez gólt</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Valószínűség</span>
                      <span className="text-2xl font-bold text-primary">
                        {prediction.btts.probability.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={prediction.btts.probability} className="h-3" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ajánlás:</span>
                    <Badge 
                      variant={prediction.btts.recommendation === 'YES' ? 'default' : 'secondary'}
                      className="font-semibold"
                    >
                      {prediction.btts.recommendation === 'YES' ? 'IGEN' : 'NEM'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Megbízhatóság:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-${getConfidenceColor(prediction.btts.confidence)} border-${getConfidenceColor(prediction.btts.confidence)}/20`}
                    >
                      {getConfidenceText(prediction.btts.confidence)}
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-secondary/10 mr-4">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Over 2.5 Predikció</h3>
                    <p className="text-muted-foreground">2.5 gólnál több</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Valószínűség</span>
                      <span className="text-2xl font-bold text-secondary">
                        {prediction.over25.probability.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={prediction.over25.probability} className="h-3" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Ajánlás:</span>
                    <Badge 
                      variant={prediction.over25.recommendation === 'OVER' ? 'default' : 'secondary'}
                      className="font-semibold"
                    >
                      {prediction.over25.recommendation === 'OVER' ? 'FELETT' : 'ALATT'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-medium">Megbízhatóság:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-${getConfidenceColor(prediction.over25.confidence)} border-${getConfidenceColor(prediction.over25.confidence)}/20`}
                    >
                      {getConfidenceText(prediction.over25.confidence)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {homeStats && awayStats && !prediction && (
            <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-4">Csapat Összehasonlítás</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">
                    {competitors?.season_competitors?.find((c: any) => c.id === homeTeam)?.name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gól/meccs:</span>
                      <span>{(homeStats.statistics?.goals_scored / homeStats.statistics?.matches_played || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kapott gól/meccs:</span>
                      <span>{(homeStats.statistics?.goals_conceded / homeStats.statistics?.matches_played || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">
                    {competitors?.season_competitors?.find((c: any) => c.id === awayTeam)?.name}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gól/meccs:</span>
                      <span>{(awayStats.statistics?.goals_scored / awayStats.statistics?.matches_played || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kapott gól/meccs:</span>
                      <span>{(awayStats.statistics?.goals_conceded / awayStats.statistics?.matches_played || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};
