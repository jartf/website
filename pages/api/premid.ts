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
  // Create a key from the essential parts of the activity
  const key = JSON.stringify({
    name: activity.name,
    details: activity.details,
    state: activity.state,
    largeImageKey: activity.assets?.large_image,
    smallImageKey: activity.assets?.small_image,
  })
  return key
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
    if (now - entry.lastUpdate >= 1200000) {
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

      // Update or add the activity
      const existing = activities.get(key)
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

      // Clean up any expired activities
      cleanupExpiredActivities()
    } else {
      // If no activity is sent, clear all activities (user went idle)
      activities.forEach(entry => {
        if (entry.timeoutId) {
          clearTimeout(entry.timeoutId)
        }
      })
      activities.clear()
    }

    res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    // Get the host from the request
    const host = req.headers.host || ''
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = `${protocol}://${host}`

    // If not on production domain, fetch from production
    if (baseUrl !== 'https://jarema.me') {
      try {
        const response = await fetch('https://jarema.me/api/premid')
        const data = await response.json()
        res.status(200).json(data)
        return
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from production' })
        return
      }
    }

    // Return current activity (only on production domain)
    // Clean up expired activities before returning
    cleanupExpiredActivities()

    const now = Date.now()

    // Convert activities map to array and filter out ended activities
    const activeActivities = Array.from(activities.values())
      .filter(entry => {
        // If the activity has an end timestamp, check if it's in the future
        if (entry.activity.timestamps?.end) {
          return entry.activity.timestamps.end > now
        }
        // If no end timestamp, keep it
        return true
      })
      .map(entry => ({
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
