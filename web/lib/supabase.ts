import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export interface User {
  id: string
  email: string
  plan: 'free' | 'pro' | 'team'
  usage_count: number
  created_at: string
  updated_at: string
}

export interface Changelog {
  id: string
  user_id: string
  version: string
  content: any
  repo: string
  created_at: string
  ai_polished: boolean
  template_id?: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  style: any
  template: string
  is_public: boolean
  created_at: string
}

export interface Integration {
  id: string
  user_id: string
  type: 'slack' | 'email' | 'github'
  config: any
  enabled: boolean
  created_at: string
}

// Helper functions
export async function getUserPlan(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data?.plan || 'free'
}

export async function incrementUsage(userId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_usage', { user_id: userId })
  if (error) throw error
}

export async function checkUsageLimit(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('plan, usage_count')
    .eq('id', userId)
    .single()

  if (error) throw error

  const limits = {
    free: 10,
    pro: -1, // unlimited
    team: -1, // unlimited
  }

  const limit = limits[data.plan as keyof typeof limits]
  return limit === -1 || data.usage_count < limit
}

export async function saveChangelog(
  userId: string,
  changelog: Partial<Changelog>
): Promise<Changelog> {
  const { data, error } = await supabase
    .from('changelogs')
    .insert({ ...changelog, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserChangelogs(userId: string): Promise<Changelog[]> {
  const { data, error } = await supabase
    .from('changelogs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
