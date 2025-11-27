// pages/api/lastfm.js
import { rateLimit } from '../../lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
})

/**
 * An API route handler that fetches the latest track from Last.fm.
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Apply rate limiting: 30 requests per minute
  if (!limiter.check(req, res, 30)) {
    return res.status(429).json({ error: 'Rate limit exceeded' })
  }

  try {
    // Try to fetch from the proxy first
    const response = await fetch("https://fm.jarema.me/", {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    if (!response.ok) {
      throw new Error("Proxy failed");
    }
    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error fetching from proxy, trying Last.fm API directly:", error);

    // Fallback to Last.fm API directly
    try {
      const apiKey = process.env.LASTFM_API_KEY || 'c8526c48e3bd3c6f35e365480426f1be';
      const username = process.env.LASTFM_USERNAME || 'jerryvu';
      const fallbackUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${encodeURIComponent(apiKey)}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        signal: AbortSignal.timeout(5000),
      });

      if (!fallbackResponse.ok) {
        return res.status(500).json({ error: "Failed to fetch Last.fm" });
      }

      const xml = await fallbackResponse.text();
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
      res.status(200).send(xml);
    } catch (fallbackError) {
      console.error("Error fetching Last.fm data from API:", fallbackError);
      res.status(500).json({ error: "Failed to fetch Last.fm" });
    }
  }
}
