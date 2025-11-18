"use client"

import { motion } from 'framer-motion'
import { GitBranch, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChangelogTimelineProps {
  changelogs: any[]
  onSelect: (changelog: any) => void
  selected?: string
}

export function ChangelogTimeline({ changelogs, onSelect, selected }: ChangelogTimelineProps) {
  return (
    <div className="space-y-4">
      {changelogs.map((changelog, index) => (
        <motion.div
          key={changelog.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(changelog)}
          className={cn(
            'relative cursor-pointer p-4 rounded-lg border transition-all',
            selected === changelog.id
              ? 'bg-primary/10 border-primary shadow-md'
              : 'hover:bg-muted/50 hover:border-muted-foreground/30'
          )}
        >
          {/* Timeline line */}
          {index < changelogs.length - 1 && (
            <div className="absolute left-6 top-14 bottom-0 w-px bg-border -mb-4" />
          )}

          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-full',
              selected === changelog.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              <GitBranch className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{changelog.version}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                {new Date(changelog.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {changelog.commits.length} commits
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
