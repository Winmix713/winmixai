
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MatchResults = () => {
  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Mérkőzések
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Napi Eredmények
            <span className="block text-primary">és Mérkőzések</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Tekintse meg a tegnapi eredményeket és a mai mérkőzések programját valós idejű SportRadar adatok alapján.
          </p>
          
          <Link to="/merkozesek">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Mérkőzések megtekintése
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-gradient-glass backdrop-blur-sm border-border/50">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Részletes Mérkőzéslista</h3>
            <p className="text-muted-foreground mb-6">
              Kattintson a gombra a teljes mérkőzéslista megtekintéséhez, ahol külön füleken találja a tegnapi eredményeket és a mai programot.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
