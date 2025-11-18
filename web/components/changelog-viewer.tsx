"use client"

import { motion } from 'framer-motion'
import { GitCommit } from 'lucide-react'

interface ChangelogViewerProps {
  changelog: any
  filterType: string
  searchQuery: string
}

export function ChangelogViewer({ changelog, filterType, searchQuery }: ChangelogViewerProps) {
  if (!changelog) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <GitCommit className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a release from the timeline to view its changelog</p>
        </div>
      </div>
    )
  }

  // Filter commits based on type and search
  const filteredCommits = changelog.commits.filter((commit: any) => {
    const matchesType = filterType === 'all' || commit.type.toLowerCase().includes(filterType)
    const matchesSearch = !searchQuery ||
      commit.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.hash.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Group commits by type
  const groupedCommits = filteredCommits.reduce((acc: any, commit: any) => {
    if (!acc[commit.type]) {
      acc[commit.type] = []
    }
    acc[commit.type].push(commit)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <div className="text-sm text-muted-foreground">Released on</div>
          <div className="font-medium">{new Date(changelog.date).toLocaleDateString()}</div>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredCommits.length} {filteredCommits.length === 1 ? 'commit' : 'commits'}
        </div>
      </div>

      {Object.entries(groupedCommits).map(([type, commits]: [string, any]) => (
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold">{type}</h3>
          <div className="space-y-2">
            {commits.map((commit: any, index: number) => (
              <motion.div
                key={commit.hash}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <GitCommit className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{commit.message}</p>
                  <code className="text-xs text-muted-foreground">{commit.hash}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {filteredCommits.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No commits match your filters
        </div>
      )}
    </div>
  )
}
