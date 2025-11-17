import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Lightbulb, AlertTriangle, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Match } from '@/types/league.types';
import type { AISuggestedPattern } from '@/analysis/pattern-performance.types';

interface AIPatternSuggestionsProps {
  matches: Match[];
  onAcceptSuggestion: (pattern: AISuggestedPattern) => void;
}

export function AIPatternSuggestions({ matches, onAcceptSuggestion }: AIPatternSuggestionsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestedPattern[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suggest');

  const fetchSuggestions = async (analysisType: 'suggest' | 'anomaly' | 'natural_language') => {
    if (matches.length === 0) {
      toast({
        title: 'No Data',
        description: 'Please load match data first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching ${analysisType} suggestions for ${matches.length} matches`);

      const { data, error } = await supabase.functions.invoke('ai-pattern-suggest', {
        body: {
          matches: matches.slice(0, 100), // Limit to prevent token overflow
          query: query || undefined,
          analysisType,
        },
      });

      if (error) throw error;

      console.log('AI Response:', data);

      if (analysisType === 'anomaly') {
        setAnomalies(data.suggestions || []);
        toast({
          title: 'Analysis Complete',
          description: `Found ${data.suggestions?.length || 0} anomalies`,
        });
      } else {
        const patterns = Array.isArray(data.suggestions) ? data.suggestions : [];
        setSuggestions(patterns);
        toast({
          title: 'Suggestions Ready',
          description: `AI suggested ${patterns.length} patterns`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      
      let errorMessage = 'Failed to get AI suggestions';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message?.includes('credits')) {
        errorMessage = 'AI credits exhausted. Please add credits to continue.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Pattern Suggestions
        </CardTitle>
        <CardDescription>
          Let AI analyze your match data and suggest interesting patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggest">
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggest
            </TabsTrigger>
            <TabsTrigger value="anomaly">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="query">
              <Search className="w-4 h-4 mr-2" />
              Query
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggest" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                onClick={() => fetchSuggestions('suggest')}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3 mt-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{suggestion.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onAcceptSuggestion(suggestion)}
                          >
                            Import
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{suggestion.category}</Badge>
                          <Badge variant="outline">
                            {(suggestion.frequency * 100).toFixed(1)}% expected
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.conditions?.length || 0} conditions
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="anomaly" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button
                onClick={() => fetchSuggestions('anomaly')}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Detect Anomalies
                  </>
                )}
              </Button>
            </div>

            {anomalies.length > 0 && (
              <div className="space-y-3 mt-4">
                {anomalies.map((anomaly, index) => (
                  <Card key={index} className="border-yellow-500/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-semibold">{anomaly.title}</h4>
                          <Badge
                            variant={anomaly.significance === 'high' ? 'destructive' : 'secondary'}
                          >
                            {anomaly.significance}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {anomaly.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="query" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g., 'Show me high-scoring matches' or 'Teams that score in both halves'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                onClick={() => fetchSuggestions('natural_language')}
                disabled={loading || !query.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Patterns
                  </>
                )}
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3 mt-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{suggestion.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onAcceptSuggestion(suggestion)}
                          >
                            Import
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{suggestion.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
