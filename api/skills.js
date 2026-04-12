export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { skillName, topics } = req.body;

  if (!skillName || !topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Missing skillName or topics' });
  }

  if (skillName.length > 200 || topics.length > 50) {
    return res.status(400).json({ status: 'error', message: 'Payload too large' });
  }

  try {
    const scriptUrl = process.env.GOOGLE_SHEET_SKILLS_API || process.env.VITE_GOOGLE_SHEET_SKILLS_API;

    if (!scriptUrl) {
      console.error("GOOGLE_SHEET_SKILLS_API missing in environment variables");
      return res.status(500).json({ status: 'error', message: 'Server configuration error' });
    }

    const targetUrl = scriptUrl;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      // The apps script does JSON.parse(e.postData.contents)
      body: JSON.stringify({ skillName, topics })
    });
    
    const textData = await response.text();
    let data;
    try {
      data = JSON.parse(textData);
    } catch(e) {
        console.error("Failed to parse Google App Script response:", textData);
        return res.status(500).json({ status: 'error', message: 'Invalid response from backend Google Script' });
    }

    if (data.status === 'success') {
      return res.status(200).json({ status: 'success' });
    } else {
      return res.status(500).json({ status: 'error', message: data.message || 'Error executing script' });
    }

  } catch (error) {
    console.error("Vercel Serverless Form Error:", error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error saving skill' });
  }
}
