import type { NextApiRequest, NextApiResponse } from 'next'

// Configuration constants
const AUTHORIZED_USER_ID = '490457129090547733'
const ACTIVITY_TIMEOUT_MS = 20 * 60 * 1000 // 20 minutes
const CLEAR_THRESHOLD_MS = 2 * 60 * 1000 // 2 minutes - only clear if no updates for this long
const PRODUCTION_HOSTS = new Set(['jarema.me', 'www.jarema.me'])
const MAX_ACTIVITIES = 20 // Prevent unbounded memory growth

// Type definitions
interface ActivityAssets {
  large_image?: string
  small_image?: string
}

interface ActivityButton {
  label: string
  url: string
}

interface ActivityTimestamps {
  start?: number
  end?: number
}

interface Activity {
  name: string
  details?: string
  state?: string
  timestamps?: ActivityTimestamps
  buttons?: ActivityButton[]
  assets?: ActivityAssets
}

interface ActivityEntry {
  activity: Activity
  lastUpdate: number
  timeoutId: NodeJS.Timeout | null
}

interface ExtensionData {
  user_id: string
}

interface PostRequestBody {
  active_activity?: Activity
  extension?: ExtensionData
}

const activities = new Map<string, ActivityEntry>()

// Create a unique key from an activity for deduplication
function getActivityKey(activity: Activity): string {
  return JSON.stringify({
    name: activity.name,
    details: activity.details ?? '',
    state: activity.state ?? '',
  })
}

// Score an activity based on detail richness (higher = more detailed)
function getActivityScore(activity: Activity): number {
  let score = 0

  // Timestamps: 2 points each
  if (activity.timestamps?.start) score += 2
  if (activity.timestamps?.end) score += 2

  // Buttons: 3 points each
  score += (activity.buttons?.length ?? 0) * 3

  // Images: 1 point each
  if (activity.assets?.large_image) score += 1
  if (activity.assets?.small_image) score += 1

  return score
}

// Setup timeout to auto-remove inactive activities
function setupActivityTimeout(key: string): void {
  const entry = activities.get(key)
  if (!entry) return

  // Clear any existing timeout
  if (entry.timeoutId) {
    clearTimeout(entry.timeoutId)
  }

  // Remove activity after inactivity period
  entry.timeoutId = setTimeout(() => {
    const currentEntry = activities.get(key)
    if (currentEntry && Date.now() - currentEntry.lastUpdate >= ACTIVITY_TIMEOUT_MS) {
      activities.delete(key)
    }
  }, ACTIVITY_TIMEOUT_MS)
}

// Clean up expired activities based on activity timeout
function cleanupExpiredActivities(): void {
  const now = Date.now()

  for (const [key, entry] of activities.entries()) {
    if (now - entry.lastUpdate >= ACTIVITY_TIMEOUT_MS) {
      if (entry.timeoutId) {
        clearTimeout(entry.timeoutId)
      }
      activities.delete(key)
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS for PreMID extension
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    const { active_activity, extension } = req.body as PostRequestBody

    // Validate user authentication
    if (!extension) {
      res.status(401).json({ error: 'Unauthenticated request' })
      return
    }

    if (extension.user_id !== AUTHORIZED_USER_ID) {
      res.status(403).json({ error: 'Unauthorized user' })
      return
    }

    if (active_activity) {
      // Prevent unbounded memory growth
      if (activities.size >= MAX_ACTIVITIES) {
        cleanupExpiredActivities()
        // If still at max, remove oldest entry
        if (activities.size >= MAX_ACTIVITIES) {
          const oldestKey = activities.keys().next().value as string | undefined
          if (oldestKey) {
            const oldestEntry = activities.get(oldestKey)
            if (oldestEntry?.timeoutId) {
              clearTimeout(oldestEntry.timeoutId)
            }
            activities.delete(oldestKey)
          }
        }
      }

      const key = getActivityKey(active_activity)
      const now = Date.now()
      const existing = activities.get(key)

      // Update if: no existing activity OR new activity has more detail
      const shouldUpdate = !existing || getActivityScore(active_activity) >= getActivityScore(existing.activity)

      if (shouldUpdate) {
        if (existing?.timeoutId) {
          clearTimeout(existing.timeoutId)
        }

        activities.set(key, {
          activity: active_activity,
          lastUpdate: now,
          timeoutId: null,
        })

        setupActivityTimeout(key)
      } else if (existing) {
        // Keep existing activity but extend its lifetime
        existing.lastUpdate = now
        if (existing.timeoutId) {
          clearTimeout(existing.timeoutId)
        }
        existing.timeoutId = null
        setupActivityTimeout(key)
      }

      // Don't run cleanup here - it might remove other valid activities
    } else {
      // Only clear activities if there's been no activity for a substantial time
      // This prevents clearing during brief pauses or tab switches
      const now = Date.now()
      const hasRecentActivity = Array.from(activities.values()).some(
        entry => now - entry.lastUpdate < CLEAR_THRESHOLD_MS
      )

      if (!hasRecentActivity) {
        for (const entry of activities.values()) {
          if (entry.timeoutId) {
            clearTimeout(entry.timeoutId)
          }
        }
        activities.clear()
      }
      // Note: If there IS recent activity, we keep it even though this POST has no active_activity
      // This handles cases where PreMID sends periodic heartbeats without activity data
    }

    res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    const host = req.headers.host ?? ''
    const isProduction = PRODUCTION_HOSTS.has(host)

    // Fetch from production if on dev environment
    if (!isProduction) {
      try {
        const response = await fetch('https://jarema.me/api/premid')
        if (!response.ok) throw new Error('Production fetch failed')
        const data = await response.json()
        res.status(200).json(data)
        return
      } catch (error) {
        console.log('Failed to fetch from production, serving local data')
      }
    }

    // Clean up and return current activities
    cleanupExpiredActivities()

    const now = Date.now()
    const activeActivities = Array.from(activities.values())
      .filter(({ activity }) => {
        // Filter out activities that have ended
        if (activity.timestamps?.end) {
          return activity.timestamps.end > now
        }
        return true
      })
      .map(({ activity, lastUpdate }) => ({
        activity,
        lastUpdate,
      }))

    res.status(200).json({
      activities: activeActivities,
      count: activeActivities.length,
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
