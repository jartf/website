import type { NextApiRequest, NextApiResponse } from 'next'
import { rateLimit } from '../../lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
})

// Store activity in memory
let currentActivity: any = null
let lastActivityTime = 0
let activityTimeoutId: NodeJS.Timeout | null = null

// Function to handle activity timeout (20 minutes)
function setupActivityTimeout() {
  // Clear any existing timeout
  if (activityTimeoutId) {
    clearTimeout(activityTimeoutId)
  }

  // Set a new timeout for 20 minutes (1200000 ms)
  activityTimeoutId = setTimeout(() => {
    if (Date.now() - lastActivityTime >= 1200000) {
      currentActivity = null
    }
  }, 1200000)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply rate limiting: 60 requests per minute for GET, 20 for POST
  const limit = req.method === 'POST' ? 20 : 60
  if (!limiter.check(req, res, limit)) {
    return res.status(429).json({ error: 'Rate limit exceeded' })
  }

  // Enable CORS for PreMID extension (restricted in production)
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://jarema.me', 'chrome-extension://*', 'moz-extension://*']
    : ['*']
  
  const origin = req.headers.origin || ''
  const isAllowed = allowedOrigins.includes('*') || allowedOrigins.some(allowed => 
    allowed.endsWith('*') ? origin.startsWith(allowed.slice(0, -1)) : origin === allowed
  )
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    // Validate request body exists
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    const { active_activity, extension } = req.body

    // Validate user_id if extension data is available
    const AUTHORIZED_USER_ID = process.env.PREMID_AUTHORIZED_USER_ID || '490457129090547733'

    if (extension) {
      // Extension data is available, validate user_id
      if (typeof extension !== 'object' || !extension.user_id) {
        return res.status(400).json({ error: 'Invalid extension data' })
      }
      if (extension.user_id !== AUTHORIZED_USER_ID) {
        return res.status(403).json({ error: 'Unauthorized user' })
      }
    } else {
      // Extension data not available, reject
      return res.status(401).json({ error: 'Unauthenticated request' })
    }

    // Update the last activity time
    lastActivityTime = Date.now()

    if (active_activity) {
      // Validate activity object structure
      if (typeof active_activity !== 'object') {
        return res.status(400).json({ error: 'Invalid activity data' })
      }
      
      // Store the current activity (sanitize by creating new object)
      currentActivity = {
        name: String(active_activity.name || '').slice(0, 200),
        details: active_activity.details ? String(active_activity.details).slice(0, 200) : undefined,
        state: active_activity.state ? String(active_activity.state).slice(0, 200) : undefined,
        largeImageKey: active_activity.largeImageKey ? String(active_activity.largeImageKey).slice(0, 200) : undefined,
        smallImageKey: active_activity.smallImageKey ? String(active_activity.smallImageKey).slice(0, 200) : undefined,
      }

      // Set up the timeout for activity clearing
      setupActivityTimeout()
    } else {
      currentActivity = null

      // Clear the timeout since activity was explicitly cleared
      if (activityTimeoutId) {
        clearTimeout(activityTimeoutId)
        activityTimeoutId = null
      }
    }

    return res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    // Get the host from the request
    const host = req.headers.host || ''
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const baseUrl = `${protocol}://${host}`

    // If not on production domain, fetch from production
    if (baseUrl !== 'https://jarema.me') {
      try {
        const response = await fetch('https://jarema.me/api/premid', {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const data = await response.json()
        res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')
        return res.status(200).json(data)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch from production' })
      }
    }

    // Return current activity (only on production domain)
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')
    return res.status(200).json({
      activity: currentActivity,
      lastUpdate: lastActivityTime,
    })
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
