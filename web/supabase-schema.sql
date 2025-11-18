-- Changelog Premium Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  usage_count INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Changelogs table
CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  content JSONB NOT NULL,
  repo TEXT,
  ai_polished BOOLEAN DEFAULT false,
  template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  style JSONB NOT NULL,
  template TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('slack', 'email', 'github')),
  config JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_changelogs_user_id ON changelogs(user_id);
CREATE INDEX idx_changelogs_created_at ON changelogs(created_at DESC);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_public ON templates(is_public) WHERE is_public = true;
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET usage_count = usage_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage (call via cron job)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET usage_count = 0,
      updated_at = NOW()
  WHERE plan = 'free';
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Changelogs policies
CREATE POLICY "Users can view own changelogs"
  ON changelogs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own changelogs"
  ON changelogs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own changelogs"
  ON changelogs FOR DELETE
  USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can view own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations"
  ON integrations FOR ALL
  USING (auth.uid() = user_id);

-- Usage logs policies
CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default templates
INSERT INTO templates (user_id, name, style, template, is_public) VALUES
(NULL, 'Tech', '{"theme":"dark","accentColor":"#3b82f6","font":"monospace"}', '# Changelog\n\n## [{{version}}] - {{date}}\n\n### Added\n{{features}}\n\n### Fixed\n{{fixes}}', true),
(NULL, 'SaaS', '{"theme":"light","accentColor":"#8b5cf6","font":"sans-serif"}', '# What''s New in {{version}}\n\n## ✨ New Features\n{{features}}\n\n## 🐛 Bug Fixes\n{{fixes}}', true),
(NULL, 'Open Source', '{"theme":"auto","accentColor":"#10b981","font":"system"}', '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n## [{{version}}] - {{date}}\n\n### Added\n{{features}}\n\n### Fixed\n{{fixes}}', true);
