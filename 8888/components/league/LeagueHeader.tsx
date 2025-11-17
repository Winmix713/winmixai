import { memo } from 'react'
import { Trophy, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeagueHeaderProps {
  season: string
}

export const LeagueHeader = memo(({ season }: LeagueHeaderProps) => (
  <header className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 group">
          <Trophy
            size={28}
            className="text-primary transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Soccer Championship Analysis</h1>
            <p className="text-xs text-muted-foreground hidden md:block">Professional Soccer Statistics & Analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-card/50 border-border/50 text-foreground hover:bg-card/80 flex items-center gap-2"
          >
            <BarChart3 size={16} className="text-primary" aria-hidden="true" />
            <span className="font-medium">{season}</span>
          </Button>
        </div>
      </div>
    </div>
  </header>
))

LeagueHeader.displayName = 'LeagueHeader'
