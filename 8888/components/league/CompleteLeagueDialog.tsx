import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { LeagueData } from '@/types/league.types'

interface CompleteLeagueDialogProps {
  open: boolean
  onClose: () => void
  league: LeagueData | null
  onConfirm: (leagueId: string) => void
}

export function CompleteLeagueDialog({ open, onClose, league, onConfirm }: CompleteLeagueDialogProps) {
  if (!league) return null

  const handleConfirm = () => {
    onConfirm(league.id)
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Complete League</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Mark <strong className="text-foreground">{league.name}</strong> as completed?
            <span className="block mt-2">
              This will finalize the league standings and lock the results.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Complete League
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
