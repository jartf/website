// pages/api/lastfm.js
/**
 * An API route handler that fetches the latest track from Last.fm.
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  try {
    // Try to fetch from the proxy first
    const response = await fetch("https://fm.jarema.me/");
    if (!response.ok) {
      throw new Error("Proxy failed");
    }
    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error fetching from proxy, trying Last.fm API directly:", error);

    // Fallback to Last.fm API directly
    try {
      const fallbackUrl = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be";
      const fallbackResponse = await fetch(fallbackUrl);

      if (!fallbackResponse.ok) {
        return res.status(500).json({ error: "Failed to fetch Last.fm" });
      }

      const xml = await fallbackResponse.text();
      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (fallbackError) {
      console.error("Error fetching Last.fm data from API:", fallbackError);
      res.status(500).json({ error: "Failed to fetch Last.fm" });
    }
  }
}
