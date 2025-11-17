import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Database, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  BarChart3
} from "lucide-react";

const predictionStrategies = [
  {
    title: "BTTS Predikció",
    subtitle: "Both Teams to Score",
    description: "Mindkét csapat szerez gólt előrejelzés",
    icon: Target,
    color: "primary",
    accuracy: 87,
    keyMetrics: [
      "Goals Scored / Goals Conceded",
      "Shots on Target átlagok",
      "Home vs Away forma",
      "H2H eredmények"
    ],
    datapoints: [
      "Seasonal Competitor Statistics",
      "Season Form Standings", 
      "Competitor vs Competitor",
      "Sport Event Lineups"
    ]
  },
  {
    title: "Over 2.5 Analízis", 
    subtitle: "Total Goals Over 2.5",
    description: "2.5 gólnál több kimenetel előrejelzés",
    icon: TrendingUp,
    color: "secondary", 
    accuracy: 84,
    keyMetrics: [
      "Goals per Match átlag",
      "Over/Under historikus arányok",
      "Csapatok támadó indexe",
      "Sérült kulcsjátékosok"
    ],
    datapoints: [
      "Season Over/Under Statistics",
      "Season Missing Players",
      "Daily Summaries",
      "Push Statistics (live)"
    ]
  }
];

const workflowSteps = [
  {
    phase: "Historikus Adatgyűjtés",
    icon: Database,
    description: "Múltbeli szezonok teljes adatbázisának felépítése",
    endpoints: ["Competition Seasons", "Season Schedule", "Sport Event Summary"]
  },
  {
    phase: "Modell Tanítás", 
    icon: Brain,
    description: "Gépi tanulási algoritmusok betanítása",
    endpoints: ["Seasonal Statistics", "H2H eredmények", "Form Analysis"]
  },
  {
    phase: "Meccs Előtti Elemzés",
    icon: Clock, 
    description: "Valós idejű adatok feldolgozása és predikció generálás",
    endpoints: ["Season Standings", "Missing Players", "Event Lineups"]
  },
  {
    phase: "Élő Modell",
    icon: CheckCircle2,
    description: "Push Feeds alapú valós idejű pontosítás",
    endpoints: ["Push Events", "Push Statistics", "Live Probabilities"]
  }
];

export const PredictionModels = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <Brain className="w-4 h-4 mr-2" />
            Predikciós Modellek
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Gépi Tanulás Alapú
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Előrejelző Rendszer
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fejlett algoritmusok és valós idejű Sportradar adatok kombinálásával 
            nagy pontosságú predikciók a labdarúgó fogadási piacok két legfontosabb szegmensére.
          </p>
        </div>

        {/* Prediction Models */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {predictionStrategies.map((model) => {
            const IconComponent = model.icon;
            return (
              <Card 
                key={model.title}
                className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl bg-${model.color}/10 mr-4`}>
                      <IconComponent className={`w-8 h-8 text-${model.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{model.title}</h3>
                      <p className="text-muted-foreground">{model.subtitle}</p>
                    </div>
                  </div>
                  <Badge className={`bg-${model.color}/10 text-${model.color} border-${model.color}/20`}>
                    {model.accuracy}% pontosság
                  </Badge>
                </div>

                <p className="text-muted-foreground mb-6">{model.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                    Kulcs Metrikák
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {model.keyMetrics.map((metric, index) => (
                      <div key={metric} className="flex items-center p-2 rounded bg-accent/30">
                        <CheckCircle2 className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        <span className="text-sm">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Database className="w-4 h-4 mr-2 text-secondary" />
                    API Végpontok
                  </h4>
                  <div className="space-y-2">
                    {model.datapoints.map((endpoint) => (
                      <Badge key={endpoint} variant="outline" className="text-xs mr-2">
                        {endpoint}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Progress 
                  value={model.accuracy} 
                  className="mb-4"
                />
                <p className="text-xs text-muted-foreground">
                  Historikus teszt adatokon mért pontosság
                </p>
              </Card>
            );
          })}
        </div>

        {/* Workflow */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Fejlesztési Workflow</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.phase} className="relative">
                  <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                    <div className="text-center mb-4">
                      <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{step.phase}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {step.endpoints.map((endpoint) => (
                        <Badge key={endpoint} variant="outline" className="text-xs w-full justify-center">
                          {endpoint}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                  
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-primary text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">Készen Áll a Kezdésre?</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Építse fel saját labdarúgó predikciós rendszerét a Sportradar Soccer v4 API 
              és a fenti stratégiák alapján. Kezdje el a historikus adatok gyűjtésével!
            </p>
            <Button variant="secondary" size="lg" className="font-semibold">
              <Database className="w-5 h-5 mr-2" />
              API Dokumentáció Letöltése
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};