// pages/api/lastfm.js
/**
 * An API route handler that fetches the latest track from Last.fm.
 * @param {import('next').NextApiRequest} req - The request object.
 * @param {import('next').NextApiResponse} res - The response object.
 */
export default async function handler(req, res) {
  try {
    const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be";
    const response = await fetch(url);

    if (!response.ok) {
      console.log("Last.fm API request failed");
      return res.status(200).json({ error: "Unable to fetch Last.fm data" });
    }

    const xml = await response.text();
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.log("Error fetching Last.fm data:", error);
    res.status(200).json({ error: "Unable to fetch Last.fm" });
  }
}
