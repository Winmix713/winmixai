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

interface DeleteLeagueDialogProps {
  open: boolean
  onClose: () => void
  league: LeagueData | null
  onConfirm: (leagueId: string) => void
}

export function DeleteLeagueDialog({ open, onClose, league, onConfirm }: DeleteLeagueDialogProps) {
  if (!league) return null

  const handleConfirm = () => {
    onConfirm(league.id)
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete League</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete <strong className="text-foreground">{league.name}</strong>?
            <span className="block mt-2 text-destructive">
              This will permanently delete all matches associated with this league.
            </span>
            <span className="block mt-2">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete League
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
