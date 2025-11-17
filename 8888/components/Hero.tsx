import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Database } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <Database className="w-4 h-4 mr-2" />
            Sportradar Soccer API v4 Powered
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold font-heading mb-6 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            Boot Ball
            <span className="block">Insights</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Professzionális labdarúgó elemző és predikciós rendszer. 
            Valós idejű statisztikák és gépi tanulás alapú előrejelzések 
            a <span className="text-primary font-semibold">"mindkét csapat szerez gólt"</span> és 
            az <span className="text-secondary font-semibold">"Over 2.5"</span> piacokra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="default" size="lg" className="text-lg px-8 py-4">
              <BarChart3 className="w-5 h-5 mr-2" />
              API Struktúra Felfedezése
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Target className="w-5 h-5 mr-2" />
              Predikciós Modellek
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-elegant">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-primary/10 mr-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">BTTS Predikció</h3>
            </div>
            <p className="text-muted-foreground">
              Mindkét csapat szerez gólt előrejelzés historikus statisztikák és valós idejű adatok alapján.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-elegant">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-secondary/10 mr-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Over 2.5 Analízis</h3>
            </div>
            <p className="text-muted-foreground">
              2.5 gólnál több kimenetel előrejelzése fejlett algoritmusokkal és csapat formaelemzéssel.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-success/50 transition-all duration-300 hover:shadow-elegant">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-success/10 mr-4">
                <Database className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">650+ Liga</h3>
            </div>
            <p className="text-muted-foreground">
              Világszerte 650+ labdarúgó versenysorozat valós idejű és historikus adatainak feldolgozása.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};