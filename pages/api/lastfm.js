// pages/api/lastfm.js
/**
 * An API route handler that fetches the latest track from Last.fm.
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  try {
    const response = await fetch("https://fm.jarema.me/");
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch Last.fm" });
    }
    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Error fetching Last.fm data in API route:", error);
    res.status(500).json({ error: "Failed to fetch Last.fm" });
  }
}
