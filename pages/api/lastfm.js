// pages/api/lastfm.js
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
    res.status(500).json({ error: "Failed to fetch Last.fm" });
  }
}
