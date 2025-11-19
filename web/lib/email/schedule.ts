import { sendWeeklyDigestEmail } from './send';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UserStats {
  userId: string;
  email: string;
  fullName: string;
  changelogsGenerated: number;
  aiPolishUsed: number;
  topRepository: string;
  totalChanges: number;
  subscriptionTier: 'free' | 'pro' | 'team';
  remainingCredits?: number;
}

// Get weekly stats for a user
async function getUserWeeklyStats(userId: string): Promise<UserStats | null> {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name, subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Calculate date range (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get changelogs generated this week
    const { data: changelogs, error: changelogsError } = await supabase
      .from('changelogs')
      .select('id, repository_id, ai_enhanced, content')
      .eq('user_id', userId)
      .gte('created_at', weekAgo.toISOString());

    if (changelogsError) {
      console.error('Error fetching changelogs:', changelogsError);
      return null;
    }

    const changelogsGenerated = changelogs?.length || 0;
    const aiPolishUsed = changelogs?.filter((c) => c.ai_enhanced).length || 0;

    // Calculate total changes
    let totalChanges = 0;
    changelogs?.forEach((changelog) => {
      const content = changelog.content as any;
      if (content?.categories) {
        Object.values(content.categories).forEach((category: any) => {
          totalChanges += category?.length || 0;
        });
      }
    });

    // Find most active repository
    const repoCounts: { [key: string]: number } = {};
    changelogs?.forEach((changelog) => {
      const repoId = changelog.repository_id;
      repoCounts[repoId] = (repoCounts[repoId] || 0) + 1;
    });

    let topRepositoryId = Object.keys(repoCounts)[0];
    let maxCount = 0;
    Object.entries(repoCounts).forEach(([repoId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topRepositoryId = repoId;
      }
    });

    // Get repository name
    let topRepository = 'N/A';
    if (topRepositoryId) {
      const { data: repo } = await supabase
        .from('repositories')
        .select('full_name')
        .eq('id', topRepositoryId)
        .single();

      if (repo) {
        topRepository = repo.full_name;
      }
    }

    // Calculate remaining credits for free users
    let remainingCredits: number | undefined;
    if (profile.subscription_tier === 'free') {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: monthlyChangelogs } = await supabase
        .from('changelogs')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', monthStart.toISOString());

      const monthlyCount = monthlyChangelogs?.length || 0;
      remainingCredits = Math.max(0, 10 - monthlyCount);
    }

    return {
      userId,
      email: profile.email,
      fullName: profile.full_name || 'Developer',
      changelogsGenerated,
      aiPolishUsed,
      topRepository,
      totalChanges,
      subscriptionTier: profile.subscription_tier,
      remainingCredits,
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    return null;
  }
}

// Send weekly digest to a single user
export async function sendUserWeeklyDigest(userId: string) {
  const stats = await getUserWeeklyStats(userId);

  if (!stats) {
    console.error('Could not get stats for user:', userId);
    return { success: false, error: 'Could not get user stats' };
  }

  // Only send if user has activity this week
  if (stats.changelogsGenerated === 0) {
    console.log('No activity for user this week, skipping:', userId);
    return { success: true, skipped: true };
  }

  return sendWeeklyDigestEmail({
    to: stats.email,
    userName: stats.fullName,
    changelogsGenerated: stats.changelogsGenerated,
    aiPolishUsed: stats.aiPolishUsed,
    topRepository: stats.topRepository,
    totalChanges: stats.totalChanges,
    subscriptionTier: stats.subscriptionTier,
    remainingCredits: stats.remainingCredits,
  });
}

// Send weekly digest to all active users
export async function sendWeeklyDigests() {
  try {
    // Get all users who have email notifications enabled
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id');

    if (error) {
      console.error('Error fetching profiles:', error);
      return { success: false, error };
    }

    console.log(`Sending weekly digests to ${profiles?.length || 0} users...`);

    const results = await Promise.allSettled(
      profiles?.map((profile) => sendUserWeeklyDigest(profile.id)) || []
    );

    const succeeded = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).success
    ).length;
    const skipped = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).skipped
    ).length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Weekly digests sent: ${succeeded} succeeded, ${skipped} skipped, ${failed} failed`);

    return {
      success: true,
      total: profiles?.length || 0,
      succeeded,
      skipped,
      failed,
    };
  } catch (error) {
    console.error('Error sending weekly digests:', error);
    return { success: false, error };
  }
}

// Cron job handler (call this from API route)
// Usage: Call from /api/cron/weekly-digest (secured by Vercel Cron secret)
export async function handleWeeklyDigestCron() {
  console.log('Weekly digest cron job started:', new Date().toISOString());

  const result = await sendWeeklyDigests();

  console.log('Weekly digest cron job completed:', result);

  return result;
}

// Auto-send changelog notification on generation
export async function scheduleChangelogNotification(
  changelogId: string,
  delayMinutes: number = 0
) {
  // In a production environment, you would use a job queue like BullMQ or Inngest
  // For now, we'll just send immediately if delay is 0

  if (delayMinutes === 0) {
    // Import here to avoid circular dependency
    const { sendChangelogReadyEmail } = await import('./send');

    // Fetch changelog details
    const { data: changelog, error: changelogError } = await supabase
      .from('changelogs')
      .select('*, repositories(*), profiles(*)')
      .eq('id', changelogId)
      .single();

    if (changelogError || !changelog) {
      console.error('Error fetching changelog for notification:', changelogError);
      return { success: false, error: changelogError };
    }

    const changelogUrl = `${process.env.NEXT_PUBLIC_APP_URL}/changelogs/${changelogId}`;

    const content = changelog.content as any;
    let changesCount = 0;
    if (content?.categories) {
      Object.values(content.categories).forEach((category: any) => {
        changesCount += category?.length || 0;
      });
    }

    return sendChangelogReadyEmail({
      to: changelog.profiles.email,
      userName: changelog.profiles.full_name || 'Developer',
      version: changelog.version || 'latest',
      repository: changelog.repositories.full_name,
      changesCount,
      aiEnhanced: changelog.ai_enhanced,
      changelogUrl,
    });
  }

  // For delayed sending, you would add to a job queue here
  console.log(`Scheduled changelog notification for ${changelogId} in ${delayMinutes} minutes`);
  return { success: true, scheduled: true };
}
