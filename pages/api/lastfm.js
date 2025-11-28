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
      console.log("Proxy failed, trying Last.fm API directly");
    } else {
      const xml = await response.text();
      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(xml);
      return;
    }
  } catch (error) {
    console.log("Error fetching from proxy, trying Last.fm API directly:", error);

    // Fallback to Last.fm API directly
    try {
      const fallbackUrl = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be";
      const fallbackResponse = await fetch(fallbackUrl);

      if (!fallbackResponse.ok) {
        console.log("Last.fm API also failed");
        return res.status(200).json({ error: "Unable to fetch Last.fm directly" });
      }

      const xml = await fallbackResponse.text();
      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (fallbackError) {
      console.log("Error fetching Last.fm data from API:", fallbackError);
      res.status(200).json({ error: "Unable to fetch Last.fm" });
    }
  }
}
