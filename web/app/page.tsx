"use client"

import { motion } from 'framer-motion'
import { Github, Sparkles, Zap, FileText, Download, Share2, Globe, Mail, Palette, Shield, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Changelog Premium</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Changelog Generation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground animate-gradient">
            Beautiful Changelogs,
            <br />
            Generated Automatically
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your git commits into stunning, AI-enhanced changelogs.
            Web dashboard, powerful integrations, and beautiful templates included.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                <Github className="mr-2 h-5 w-5" />
                Start Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            Free tier includes CLI tool + 10 changelogs/month. No credit card required.
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything You Need for Perfect Changelogs
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From beautiful web dashboards to AI polish, we've got you covered.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Choose the plan that fits your needs
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`p-8 ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <Button className="w-full mb-6" variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Level Up Your Changelogs?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers creating beautiful changelogs with AI
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold">Changelog Premium</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Beautiful, AI-powered changelog generation for modern development teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Changelog Premium. Built with ❤️ for developers.
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Sparkles,
    title: "AI Polish",
    description: "Rewrite commits in plain English, group related changes, and generate highlights automatically."
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Choose from Tech, SaaS, or Open Source styles. Customize colors, logos, and branding."
  },
  {
    icon: FileText,
    title: "Interactive Viewer",
    description: "Filter by type, search commits, copy markdown, and export as branded PDFs."
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Auto-generate changelogs on release with our GitHub Action. OAuth support included."
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description: "Post to Slack, send email digests, or embed on your website with our widget."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "CLI and web dashboard. Generate changelogs in seconds, not hours."
  },
  {
    icon: Download,
    title: "Export Options",
    description: "Markdown, JSON, or PDF. Your changelog, your way."
  },
  {
    icon: Globe,
    title: "Keep a Changelog",
    description: "Fully compliant with Keep a Changelog format and Semantic Versioning."
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "White-label options, shared templates, and team collaboration features."
  }
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    cta: "Start Free",
    popular: false,
    features: [
      "CLI tool access",
      "10 changelogs per month",
      "Rule-based categorization",
      "Markdown & JSON export",
      "Community support"
    ]
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For individual developers",
    cta: "Start Pro Trial",
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited changelogs",
      "Web dashboard access",
      "AI polish & enhancements",
      "Beautiful templates",
      "GitHub integration",
      "Priority support"
    ]
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For development teams",
    cta: "Start Team Trial",
    popular: false,
    features: [
      "Everything in Pro",
      "Shared templates",
      "White-label options",
      "Slack integration",
      "Email digests",
      "Embed widgets",
      "Custom branding",
      "Dedicated support"
    ]
  }
]
