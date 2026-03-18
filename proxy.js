export default async function handler(req, res) {
  // Allow all origins (your Vercel app)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req.query;
  const apiKey = req.headers['x-replicate-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  // Build the Replicate URL — either create prediction or poll it
  const replicateUrl = path
    ? `https://api.replicate.com/v1/predictions/${path}`
    : `https://api.replicate.com/v1/predictions`;

  try {
    const response = await fetch(replicateUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
