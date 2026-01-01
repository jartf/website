const URL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be";
const handler = async (req, res) => {
  try {
    const r = await fetch(URL);
    if (!r.ok) return res.status(200).json({ error: "Unable to fetch Last.fm data" });
    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(await r.text());
  } catch (e) {
    console.log("lastfm:", e);
    res.status(200).json({ error: "Unable to fetch Last.fm" });
  }
};

export default handler;
