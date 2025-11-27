import type { NextApiRequest, NextApiResponse } from 'next'

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Update the last activity time
    lastActivityTime = Date.now()

    if (active_activity) {
      // Store the current activity
      currentActivity = active_activity

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

    res.status(200).json({ success: true })
  } else if (req.method === 'GET') {
    // Return current activity
    res.status(200).json({
      activity: currentActivity,
      lastUpdate: lastActivityTime,
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
