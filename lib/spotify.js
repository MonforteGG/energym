import axios from 'axios';

const SPOTIFY_API_URL = 'https://accounts.spotify.com/api/token';


export const getSpotifyAccessToken = async () => {
    // Verifica que las variables de entorno están disponibles
    if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || !process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials');
    }
  
    try {
      const response = await axios.post(SPOTIFY_API_URL, new URLSearchParams({
        grant_type: 'client_credentials'
      }), {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching Spotify access token:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const fetchPlaylistTracks = async (playlistUrl) => {
    try {
      const accessToken = await getSpotifyAccessToken();
      const playlistId = playlistUrl.split('/').pop().split('?')[0];
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data.items.map(item => ({
        title: item.track.name,
        albumName: item.track.album.name,
        albumImageUrl: item.track.album.images[0]?.url,
      }));
    } catch (error) {
      console.error('Error fetching playlist tracks:', error.response ? error.response.data : error.message);
      throw error;
    }
  };