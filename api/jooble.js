export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { keywords, location, resultonpage } = req.body;

  try {
    const apiKey = process.env.JOOBLE_API_KEY || process.env.VITE_JOOBLE_API_KEY;

    if (!apiKey || apiKey === 'your_jooble_api_key_here') {
      return res.status(500).json({ error: 'Jooble API key not configured on server. Please add JOOBLE_API_KEY to your .env file.' });
    }

    const url = `https://jooble.org/api/${apiKey}`;

    const joobleParams = {
      keywords: keywords || "remote",
      location: location || "",
      searchMode: 1,
      resultonpage: resultonpage || 50
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(joobleParams)
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ error: 'Internal Server Error fetching from Jooble' });
  }
}
