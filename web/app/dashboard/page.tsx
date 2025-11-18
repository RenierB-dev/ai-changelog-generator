"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Filter, Download, Sparkles, Github, Upload, Copy, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ChangelogViewer } from '@/components/changelog-viewer'
import { ChangelogTimeline } from '@/components/changelog-timeline'
import { AIPolishPanel } from '@/components/ai-polish-panel'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedChangelog, setSelectedChangelog] = useState<any>(null)
  const [showAIPolish, setShowAIPolish] = useState(false)

  // Mock changelog data - in production this would come from API/database
  const mockChangelogs = [
    {
      id: '1',
      version: 'v2.0.0',
      date: '2024-11-18',
      commits: [
        { type: 'Features', message: 'Add beautiful web dashboard', hash: 'a1b2c3d' },
        { type: 'Features', message: 'Implement AI polish features', hash: 'e4f5g6h' },
        { type: 'Bug Fixes', message: 'Fix authentication redirect issue', hash: 'i7j8k9l' },
      ]
    },
    {
      id: '2',
      version: 'v1.5.0',
      date: '2024-11-10',
      commits: [
        { type: 'Features', message: 'Add GitHub OAuth integration', hash: 'm1n2o3p' },
        { type: 'Performance', message: 'Optimize changelog generation', hash: 'q4r5s6t' },
      ]
    }
  ]

  const handleGenerateNew = () => {
    // This would trigger the changelog generation flow
    console.log('Generate new changelog')
  }

  const handleExportPDF = () => {
    // PDF export functionality
    console.log('Export as PDF')
  }

  const handleCopyMarkdown = () => {
    // Copy markdown to clipboard
    console.log('Copy markdown')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Changelogs</h1>
            <p className="text-muted-foreground">
              Generate, manage, and polish your changelogs with AI
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGenerateNew}>
              <Github className="mr-2 h-4 w-4" />
              Generate New
            </Button>
            <Button variant="outline" onClick={() => setShowAIPolish(!showAIPolish)}>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Polish
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Total Changelogs</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">AI Polished</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Exported</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Github className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Integrations</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search changelogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'features' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('features')}
              >
                Features
              </Button>
              <Button
                variant={filterType === 'fixes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('fixes')}
              >
                Fixes
              </Button>
              <Button
                variant={filterType === 'breaking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('breaking')}
              >
                Breaking
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Release Timeline</h2>
              <ChangelogTimeline
                changelogs={mockChangelogs}
                onSelect={setSelectedChangelog}
                selected={selectedChangelog?.id}
              />
            </Card>
          </div>

          {/* Viewer */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedChangelog ? selectedChangelog.version : 'Select a release'}
                </h2>
                {selectedChangelog && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopyMarkdown}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleExportPDF}>
                      <FileDown className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                )}
              </div>
              <ChangelogViewer
                changelog={selectedChangelog}
                filterType={filterType}
                searchQuery={searchQuery}
              />
            </Card>
          </div>
        </div>

        {/* AI Polish Panel */}
        {showAIPolish && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <AIPolishPanel changelog={selectedChangelog} />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
