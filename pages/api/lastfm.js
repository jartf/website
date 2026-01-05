import { LASTFM_API_URL } from '@/lib/constants';

const handler = async (req, res) => {
  try {
    const r = await fetch(LASTFM_API_URL);
    if (!r.ok) return res.status(200).json({ error: "Unable to fetch Last.fm data" });
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(await r.text());
  } catch (e) {
    console.log("lastfm:", e);
    res.status(200).json({ error: "Unable to fetch Last.fm" });
  }
};

export default handler;
