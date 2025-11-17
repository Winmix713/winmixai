import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Clock, 
  Users, 
  Target,
  Activity,
  Zap
} from "lucide-react";

const statisticsData = [
  {
    icon: Globe,
    title: "650+",
    subtitle: "Versenysorozat",
    description: "Világszerte lefedett labdarúgó bajnokságok",
    color: "primary",
    progress: 100
  },
  {
    icon: Activity,
    title: "25,000+",
    subtitle: "Meccs/Szezon",
    description: "Évente feldolgozott mérkőzések száma",
    color: "secondary", 
    progress: 87
  },
  {
    icon: Users,
    title: "15,000+",
    subtitle: "Csapat",
    description: "Aktívan követett klubok száma",
    color: "success",
    progress: 92
  },
  {
    icon: Clock,
    title: "<1s",
    subtitle: "Valós Idejű",
    description: "Push Feeds késleltetési ideje",
    color: "warning",
    progress: 98
  }
];

const keyStatistics = [
  {
    category: "Szezonális Csapatstatisztikák",
    description: "A BTTS és Over 2.5 modellek alapja",
    metrics: [
      { name: "Goals Scored", description: "Lőtt gólok", importance: "high" },
      { name: "Goals Conceded", description: "Kapott gólok", importance: "high" },
      { name: "Shots on Target", description: "Kapura lövések", importance: "medium" },
      { name: "Average Ball Possession", description: "Labdabirtoklás", importance: "medium" },
      { name: "Over/Under Goals", description: "Historikus Over/Under", importance: "high" }
    ]
  },
  {
    category: "Mérkőzésen Belüli Statisztikák", 
    description: "Valós idejű elemzés és live modellek",
    metrics: [
      { name: "Corner Kicks", description: "Szögletesek száma", importance: "medium" },
      { name: "Offsides", description: "Les helyzetek", importance: "low" },
      { name: "Yellow/Red Cards", description: "Lapok száma", importance: "medium" },
      { name: "Formation Changes", description: "Taktikai változások", importance: "medium" },
      { name: "Player Substitutions", description: "Cserék időzítése", importance: "high" }
    ]
  }
];

export const Statistics = () => {
  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-glass border-border/50 text-foreground">
            <BarChart3 className="w-4 h-4 mr-2" />
            Kulcsfontosságú Statisztikák
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Adatalapú
            <span className="block text-primary">Predikciós Elemzés</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A Sportradar Soccer v4 API által szolgáltatott statisztikai adatok, 
            amelyek a BTTS és Over 2.5 predikciós modellek alapját képezik.
          </p>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {statisticsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={stat.title}
                className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300 hover:scale-[1.02] text-center"
              >
                <div className={`inline-flex p-3 rounded-xl bg-${stat.color}/10 mb-4`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.title}</h3>
                <p className="text-lg font-semibold text-primary mb-2">{stat.subtitle}</p>
                <p className="text-sm text-muted-foreground mb-4">{stat.description}</p>
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">{stat.progress}% lefedettség</p>
              </Card>
            );
          })}
        </div>

        {/* Detailed Statistics */}
        <div className="grid lg:grid-cols-2 gap-8">
          {keyStatistics.map((category) => (
            <Card 
              key={category.category}
              className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{category.category}</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              <div className="space-y-4">
                {category.metrics.map((metric) => {
                  const importanceColors = {
                    high: "primary",
                    medium: "secondary", 
                    low: "muted-foreground"
                  };
                  
                  const importanceLabels = {
                    high: "Kritikus",
                    medium: "Fontos",
                    low: "Kiegészítő"
                  };

                  return (
                    <div 
                      key={metric.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-semibold text-sm mr-3">{metric.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs text-${importanceColors[metric.importance as keyof typeof importanceColors]} border-${importanceColors[metric.importance as keyof typeof importanceColors]}/20`}
                          >
                            {importanceLabels[metric.importance as keyof typeof importanceLabels]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </div>
                      <div className="ml-4">
                        {metric.importance === 'high' && <Target className="w-4 h-4 text-primary" />}
                        {metric.importance === 'medium' && <TrendingUp className="w-4 h-4 text-secondary" />}
                        {metric.importance === 'low' && <Activity className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Real-time Data Highlight */}
        <div className="mt-16">
          <Card className="p-8 bg-gradient-secondary text-secondary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <Zap className="w-8 h-8 text-secondary-foreground mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">Valós Idejű Adatfeldolgozás</h3>
                  <p className="text-secondary-foreground/80">Push Feeds technológia a leggyorsabb predikciókért</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">~1ms</div>
                  <p className="text-sm text-secondary-foreground/80">Esemény késleltetés</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <p className="text-sm text-secondary-foreground/80">Folyamatos monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <p className="text-sm text-secondary-foreground/80">Automatizált feldolgozás</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};