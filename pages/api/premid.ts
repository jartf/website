import type { NextApiRequest, NextApiResponse } from 'next'

// Store activities in memory - key is a hash of the activity to deduplicate
interface ActivityEntry {
  activity: any
  lastUpdate: number
  timeoutId: NodeJS.Timeout | null
}

const activities = new Map<string, ActivityEntry>()

// Function to create a unique key from an activity
function getActivityKey(activity: any): string {
  // Create a key based only on visible content (name, details, state)
  // This allows us to deduplicate activities with same content but different metadata
  const key = JSON.stringify({
    name: activity.name,
    details: activity.details,
    state: activity.state,
  })
  return key
}

// Function to score an activity based on how much detail it has
function getActivityScore(activity: any): number {
  let score = 0

  // Has timestamps
  if (activity.timestamps) {
    if (activity.timestamps.start) score += 2
    if (activity.timestamps.end) score += 2
  }

  // Has buttons/URLs
  if (activity.buttons && activity.buttons.length > 0) {
    score += activity.buttons.length * 3
  }

  // Has images
  if (activity.assets) {
    if (activity.assets.large_image) score += 1
    if (activity.assets.small_image) score += 1
  }

  return score
}

// Function to setup timeout for a specific activity (20 minutes)
function setupActivityTimeout(key: string) {
  const entry = activities.get(key)
  if (!entry) return

  // Clear any existing timeout
  if (entry.timeoutId) {
    clearTimeout(entry.timeoutId)
  }

  // Set a new timeout for 20 minutes (1200000 ms)
  entry.timeoutId = setTimeout(() => {
    const currentEntry = activities.get(key)
    if (currentEntry && Date.now() - currentEntry.lastUpdate >= 1200000) {
      activities.delete(key)
    }
  }, 1200000)
}

// Function to clean up expired activities
function cleanupExpiredActivities() {
  const now = Date.now()
  const expiredKeys: string[] = []

  activities.forEach((entry, key) => {
    const isExpiredByTimeout = now - entry.lastUpdate >= 1200000
    const isExpiredByEndTime = entry.activity.timestamps?.end && entry.activity.timestamps.end <= now

    if (isExpiredByTimeout || isExpiredByEndTime) {
      if (entry.timeoutId) {
        clearTimeout(entry.timeoutId)
      }
      expiredKeys.push(key)
    }
  })

  expiredKeys.forEach(key => activities.delete(key))
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
    const { active_activity, extension } = req.body

    // Validate user_id if extension data is available
    const AUTHORIZED_USER_ID = '490457129090547733'

    if (extension) {
      // Extension data is available, validate user_id
      if (extension.user_id !== AUTHORIZED_USER_ID) {
        res.status(403).json({ error: 'Unauthorized user' })
        return
      }
    } else {
      // Extension data not available, reject
      res.status(401).json({ error: 'Unauthenticated request' })
      return
    }

    if (active_activity) {
      const key = getActivityKey(active_activity)
      const now = Date.now()

      // Check if we should update or skip this activity
      const existing = activities.get(key)

      // Only update if:
      // 1. No existing activity with this key, OR
      // 2. New activity has a higher score (more details)
      const shouldUpdate = !existing || getActivityScore(active_activity) >= getActivityScore(existing.activity)

      if (shouldUpdate) {
        if (existing && existing.timeoutId) {
          clearTimeout(existing.timeoutId)
        }

        activities.set(key, {
          activity: active_activity,
          lastUpdate: now,
          timeoutId: null,
        })

        // Set up the timeout for this activity
        setupActivityTimeout(key)
      } else if (existing) {
        // Keep the existing (more detailed) activity but update its timestamp
        // This ensures it doesn't expire while still active
        existing.lastUpdate = now
        if (existing.timeoutId) {
          clearTimeout(existing.timeoutId)
        }
        existing.timeoutId = null
        setupActivityTimeout(key)
      }

      // Clean up any expired activities
      cleanupExpiredActivities()
    } else {
      // If no activity is sent, only clear if we haven't received any activity recently
      // This prevents brief "idle" moments from clearing everything
      const now = Date.now()
      const recentActivityExists = Array.from(activities.values()).some(
        entry => now - entry.lastUpdate < 30000 // Within last 30 seconds
      )

      if (!recentActivityExists) {
        // No recent activity, safe to clear
        activities.forEach(entry => {
          if (entry.timeoutId) {
            clearTimeout(entry.timeoutId)
          }
        })
        activities.clear()
      }
      // Otherwise, keep existing activities and let them expire naturally
    }

    res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    // Get the host from the request
    const host = req.headers.host || ''

    // Only serve activities if we're on the production domain
    // (Don't redirect to production from production)
    const isProduction = host === 'jarema.me' || host === 'www.jarema.me'

    if (!isProduction) {
      // Not on production, try to fetch from production
      try {
        const response = await fetch('https://jarema.me/api/premid')
        if (!response.ok) throw new Error('Production fetch failed')
        const data = await response.json()
        res.status(200).json(data)
        return
      } catch (error) {
        // Failed to fetch from production, fall through to serve local data
        console.log('Failed to fetch from production, serving local data')
      }
    }

    // Return current activity (on production domain or dev fallback)
    // Clean up expired activities before returning
    cleanupExpiredActivities()

    // Convert activities map to array
    const activeActivities = Array.from(activities.values()).map(entry => ({
      activity: entry.activity,
      lastUpdate: entry.lastUpdate,
    }))

    res.status(200).json({
      activities: activeActivities,
      count: activeActivities.length,
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
