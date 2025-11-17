import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  GitBranch, 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp,
  Zap,
  BarChart,
  Target,
  User
} from "lucide-react";

const feedCategories = [
  {
    title: "Primary Feeds",
    description: "Alapvető kiindulási pontok",
    icon: Database,
    color: "primary",
    feeds: [
      { name: "Competition Info", description: "Versenysorozatok adatai" },
      { name: "Competition Seasons", description: "Historikus szezonok" },
      { name: "Competitions", description: "Elérhető bajnokságok" },
      { name: "Daily Schedules", description: "Napi programok" },
      { name: "Daily Summaries", description: "Napi összesítők" }
    ]
  },
  {
    title: "Sport Event Feeds",
    description: "Mérkőzés-specifikus adatok",
    icon: Activity,
    color: "secondary",
    feeds: [
      { name: "League Timeline", description: "Mérkőzés eseménysor" },
      { name: "Sport Event Extended Summary", description: "Részletes statisztikák" },
      { name: "Sport Event Extended Timeline", description: "Percről percre" },
      { name: "Sport Event Fun Facts", description: "Érdekes tények" },
      { name: "Sport Event Insights", description: "Mélyebb elemzések" }
    ]
  },
  {
    title: "Season Feeds",
    description: "Szezonális aggregált adatok",
    icon: Calendar,
    color: "success",
    feeds: [
      { name: "Season Form Standings", description: "Forma tabella" },
      { name: "Season Info", description: "Szezon információk" },
      { name: "Season Leaders", description: "Statisztikai vezetők" },
      { name: "Season Lineups", description: "Csapat összeállítások" },
      { name: "Season Links", description: "Kapcsolódó adatok" }
    ]
  },
  {
    title: "Competitor Feeds",
    description: "Csapat-központú elemzések",
    icon: Users,
    color: "warning",
    feeds: [
      { name: "Competitor Profile", description: "Csapat profil" },
      { name: "Competitor Summaries", description: "Csapat összesítők" },
      { name: "Competitor vs Competitor", description: "Közvetlen összecsapások" },
      { name: "Seasonal Competitor Players", description: "Játékos statisztikák" },
      { name: "Seasonal Competitor Statistics", description: "Szezonális teljesítmény" }
    ]
  }
];

export const ApiStructure = () => {
  return (
    <section className="py-20 px-4 bg-gradient-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <GitBranch className="w-4 h-4 mr-2" />
            API Struktúra
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Sportradar Soccer v4
            <span className="block text-primary">Adatfolyam Architektúra</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hierarchikus adatstruktúra, ahol az elsődleges végpontokból nyert azonosítókkal 
            hívjuk meg a specifikus, részletesebb adatokat tartalmazó végpontokat.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {feedCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.title}
                className="p-8 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card"
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-xl bg-${category.color}/10 mr-4`}>
                    <IconComponent className={`w-8 h-8 text-${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.feeds.map((feed) => (
                    <div 
                      key={feed.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-sm">{feed.name}</h4>
                        <p className="text-xs text-muted-foreground">{feed.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional Feed Types */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-warning/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-warning mr-3" />
              <h3 className="text-xl font-semibold">Push Feeds</h3>
            </div>
            <p className="text-muted-foreground mb-4">Valós idejű esemény- és statisztika-adatfolyam</p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">Push Events</Badge>
              <Badge variant="outline" className="text-xs">Push Statistics</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-destructive/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <BarChart className="w-6 h-6 text-destructive mr-3" />
              <h3 className="text-xl font-semibold">Probabilities</h3>
            </div>
            <p className="text-muted-foreground mb-4">Sportradar saját modelljei által számított esélyek</p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">Live Probabilities</Badge>
              <Badge variant="outline" className="text-xs">Timeline Probabilities</Badge>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-glass backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-secondary mr-3" />
              <h3 className="text-xl font-semibold">Player Feeds</h3>
            </div>
            <p className="text-muted-foreground mb-4">Játékos-specifikus profilok és statisztikák</p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">Player Profile</Badge>
              <Badge variant="outline" className="text-xs">Player Schedules</Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};