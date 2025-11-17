import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { LeagueData } from '@/types/league.types'

const editLeagueSchema = z.object({
  name: z.string().min(1, 'League name is required'),
  season: z.string().min(1, 'Season is required'),
  winner: z.string().optional(),
  secondPlace: z.string().optional(),
  thirdPlace: z.string().optional(),
})

type EditLeagueFormData = z.infer<typeof editLeagueSchema>

interface EditLeagueModalProps {
  open: boolean
  onClose: () => void
  league: LeagueData | null
  onSave: (leagueId: string, updates: Partial<LeagueData>) => void
}

export function EditLeagueModal({ open, onClose, league, onSave }: EditLeagueModalProps) {
  const form = useForm<EditLeagueFormData>({
    resolver: zodResolver(editLeagueSchema),
    defaultValues: {
      name: '',
      season: '',
      winner: '',
      secondPlace: '',
      thirdPlace: '',
    },
  })

  useEffect(() => {
    if (league && open) {
      form.reset({
        name: league.name,
        season: league.season,
        winner: league.winner || '',
        secondPlace: league.secondPlace || '',
        thirdPlace: league.thirdPlace || '',
      })
    }
  }, [league, open, form])

  const onSubmit = (data: EditLeagueFormData) => {
    if (!league) return
    
    onSave(league.id, {
      name: data.name,
      season: data.season,
      winner: data.winner || undefined,
      secondPlace: data.secondPlace || undefined,
      thirdPlace: data.thirdPlace || undefined,
    })
    
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit League</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update league information and final standings
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">League Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Premier League"
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Season</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="2023/24"
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="winner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Winner (1st Place)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Team name"
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="secondPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">2nd Place</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Team name"
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="thirdPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">3rd Place</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Team name"
                      className="bg-background border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
