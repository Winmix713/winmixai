import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  ExternalLink, 
  Github, 
  FileText,
  Mail,
  Globe
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-gradient-surface border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-primary/10 mr-3">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-heading">Boot Ball Insights</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professzionális labdarúgó elemző és predikciós rendszer a Sportradar Soccer v4 API alapján. 
              BTTS és Over 2.5 célzott előrejelzések fejlett gépi tanulási algoritmusokkal.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                650+ Liga
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                Valós Idejű
              </Badge>
              <Badge className="bg-success/10 text-success border-success/20">
                87% Pontosság
              </Badge>
            </div>
          </div>

          {/* API Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">API Források</h4>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start p-0 text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
                Dokumentáció
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-4 h-4 mr-2" />
                Sportradar API
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 text-muted-foreground hover:text-foreground">
                <Database className="w-4 h-4 mr-2" />
                Adatfolyam Struktúra
              </Button>
              <Button variant="ghost" className="w-full justify-start p-0 text-muted-foreground hover:text-foreground">
                <Github className="w-4 h-4 mr-2" />
                Példakód
              </Button>
            </div>
          </div>

          {/* Technical Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Technikai Részletek</h4>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Támogatott Modellek:</p>
                <p className="font-medium">BTTS & Over 2.5</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Adatfrissítés:</p>
                <p className="font-medium">Valós idejű Push Feeds</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Lefedettség:</p>
                <p className="font-medium">650+ versenysorozat</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">API Verzió:</p>
                <p className="font-medium">Soccer v4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="text-sm text-muted-foreground">
                © 2024 Boot Ball Insights. Sportradar Soccer API v4 alapján.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Mail className="w-4 h-4 mr-2" />
                Kapcsolat
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-4 h-4 mr-2" />
                Dokumentáció
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};