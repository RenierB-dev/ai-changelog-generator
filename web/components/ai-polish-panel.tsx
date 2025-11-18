"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, MessageSquare, Hash, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface AIPolishPanelProps {
  changelog: any
}

export function AIPolishPanel({ changelog }: AIPolishPanelProps) {
  const [polishing, setPolishing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handlePolish = async (type: string) => {
    setPolishing(true)
    // Simulate AI processing
    setTimeout(() => {
      setResults({
        type,
        content: getMockResult(type)
      })
      setPolishing(false)
    }, 2000)
  }

  const getMockResult = (type: string) => {
    switch (type) {
      case 'rewrite':
        return 'Enhanced user authentication system with OAuth 2.0 support and improved security measures'
      case 'group':
        return 'Authentication & Security: 3 commits\nUI Improvements: 2 commits\nPerformance: 1 commit'
      case 'summary':
        return 'This release focuses on enhancing security with new OAuth features and improving overall user experience.'
      case 'highlights':
        return '✨ New OAuth 2.0 authentication\n🔒 Enhanced security measures\n⚡ 40% faster page loads'
      case 'tweet':
        return '🚀 Just shipped v2.0! New OAuth, better security, 40% faster. Check it out! #webdev #changelog'
      default:
        return 'AI processing complete'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI Polish</h2>
      </div>

      {!changelog && (
        <div className="text-center py-8 text-muted-foreground">
          Select a changelog to use AI polish features
        </div>
      )}

      {changelog && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PolishCard
              icon={Wand2}
              title="Rewrite Messages"
              description="Convert technical commits to plain English"
              onClick={() => handlePolish('rewrite')}
              disabled={polishing}
            />
            <PolishCard
              icon={Hash}
              title="Group Changes"
              description="Intelligently categorize related commits"
              onClick={() => handlePolish('group')}
              disabled={polishing}
            />
            <PolishCard
              icon={MessageSquare}
              title="Generate Summary"
              description="Create a concise release notes summary"
              onClick={() => handlePolish('summary')}
              disabled={polishing}
            />
            <PolishCard
              icon={TrendingUp}
              title="Create Highlights"
              description="Extract key improvements and features"
              onClick={() => handlePolish('highlights')}
              disabled={polishing}
            />
            <PolishCard
              icon={Sparkles}
              title="Tweet Generator"
              description="Generate tweet-worthy announcements"
              onClick={() => handlePolish('tweet')}
              disabled={polishing}
            />
          </div>

          {polishing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>AI is polishing your changelog...</span>
              </div>
            </motion.div>
          )}

          {results && !polishing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">AI Result</span>
                </div>
                <div className="text-sm whitespace-pre-wrap">{results.content}</div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Apply</Button>
                  <Button size="sm" variant="outline">Copy</Button>
                  <Button size="sm" variant="ghost" onClick={() => setResults(null)}>
                    Dismiss
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </Card>
  )
}

function PolishCard({
  icon: Icon,
  title,
  description,
  onClick,
  disabled
}: {
  icon: any
  title: string
  description: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
      <Card
        className={`p-4 cursor-pointer transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:border-primary/50'
        }`}
        onClick={disabled ? undefined : onClick}
      >
        <Icon className="h-8 w-8 text-primary mb-3" />
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  )
}
