export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  // Length limits to protect from abuse
  if (name.length > 100 || email.length > 100 || message.length > 2000) {
    return res.status(400).json({ status: 'error', message: 'Payload too large' });
  }

  try {
    const scriptUrl = process.env.GOOGLE_SHEET_API || process.env.VITE_GOOGLE_SHEET_API;

    if (!scriptUrl) {
      console.error("GOOGLE_SHEET_API missing in environment variables");
      return res.status(500).json({ status: 'error', message: 'Server configuration error' });
    }

    // Pass the parameters via a GET query exactly as the frontend originally did
    const targetUrl = `${scriptUrl}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`;

    const response = await fetch(targetUrl);
    
    // Some Google app scripts return HTML accidentally if they crash, so text() first just in case
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
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error fetching from Google Scripts' });
  }
}
