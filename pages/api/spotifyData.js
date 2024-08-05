import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { accessToken, endpoint, params } = req.body;

  const url = new URL(`https://api.spotify.com/v1/${endpoint}`);
  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from Spotify:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
