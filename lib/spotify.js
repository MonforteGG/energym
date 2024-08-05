import axios from 'axios';

const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post('/api/spotifyAuth');
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
    let tracks = [];
    let nextUrl = `playlists/${playlistId}/tracks`;

    while (nextUrl) {
      const response = await axios.post('/api/spotifyData', {
        accessToken,
        endpoint: nextUrl
      });

      tracks = tracks.concat(response.data.items.map(item => ({
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(', '),
        albumName: item.track.album.name,
        albumImageUrl: item.track.album.images[0]?.url,
      })));

      nextUrl = response.data.next ? response.data.next.split('v1/')[1] : null;
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchPlaylistDetails = async (playlistUrl) => {
  try {
    const accessToken = await getSpotifyAccessToken();
    const playlistId = playlistUrl.split('/').pop().split('?')[0];
    const response = await axios.post('/api/spotifyData', {
      accessToken,
      endpoint: `playlists/${playlistId}`
    });

    return {
      name: response.data.name,
      description: response.data.description,
      imageUrl: response.data.images[0]?.url,
      owner: response.data.owner.display_name
    };
  } catch (error) {
    console.error('Error fetching playlist details:', error.response ? error.response.data : error.message);
    throw error;
  }
};
