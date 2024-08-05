import axios from 'axios';

const SPOTIFY_API_URL = 'https://accounts.spotify.com/api/token';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ message: 'Spotify credentials are missing' });
  }

  try {
    const response = await axios.post(SPOTIFY_API_URL, new URLSearchParams({
      grant_type: 'client_credentials'
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
