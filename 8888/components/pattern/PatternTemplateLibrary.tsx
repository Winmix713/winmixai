import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Download, Search, Sparkles, TrendingUp, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { PatternTemplate } from '@/analysis/pattern-performance.types';

interface PatternTemplateLibraryProps {
  onImportPattern: (pattern: PatternTemplate) => void;
}

export function PatternTemplateLibrary({ onImportPattern }: PatternTemplateLibraryProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<PatternTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patterns')
        .select('*')
        .eq('is_template', true)
        .eq('is_public', true);

      if (error) throw error;

      // Map database fields to TypeScript interface
      const mappedTemplates: PatternTemplate[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        conditions: item.conditions as any[],
        isTemplate: item.is_template,
        isPublic: item.is_public,
      }));

      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pattern templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(templates.map(t => t.category).filter(Boolean))];
  const allCategories = ['all', ...categories];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImport = async (template: PatternTemplate) => {
    try {
      onImportPattern(template);
      toast({
        title: 'Pattern Imported',
        description: `"${template.name}" has been added to your patterns`,
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Could not import pattern',
        variant: 'destructive',
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Goal Patterns':
        return <Target className="w-4 h-4" />;
      case 'Momentum Patterns':
        return <TrendingUp className="w-4 h-4" />;
      case 'Result Patterns':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Pattern Template Library
        </CardTitle>
        <CardDescription>
          Import pre-built patterns or create your own
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {allCategories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="capitalize">
                  {cat === 'all' ? 'All' : cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Templates List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading templates...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No templates found
                </div>
              ) : (
                filteredTemplates.map(template => (
                  <Card key={template.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(template.category)}
                            <h4 className="font-semibold">{template.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.conditions?.length || 0} conditions
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleImport(template)}
                          className="shrink-0"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
