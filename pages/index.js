import { useState } from 'react';
import { fetchPlaylistTracks } from '../lib/spotify';
import { getRhythmScore } from '../lib/ai';

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trackData = await fetchPlaylistTracks(playlistUrl);
      setTracks(trackData);

      // Obtener los títulos de las canciones para la puntuación
      const titles = trackData.map(track => track.title);
      const rhythmScores = await getRhythmScore(titles);

      // Establecer las puntuaciones en el estado
      setScores(rhythmScores);
      setError('');
      console.log(rhythmScores);
    } catch (error) {
      console.error('Error processing playlist:', error);
      setError('Error processing playlist. Please check the playlist URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreForTrack = (trackTitle) => {
    return scores[trackTitle] || 'loading';
  };

  const getCircleColor = (score) => {
    if (score === 'loading') return 'bg-gray-300 animate-pulse';
    if (score > 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Spotify Playlist Tracks</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-6">
        <input
          type="text"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          placeholder="Enter Spotify playlist URL"
          className="p-2 border border-gray-300 rounded-lg w-full md:w-2/3 lg:w-1/2"
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Fetch Tracks
        </button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div>
        {tracks.length > 0 && (
          <ul className="space-y-4">
            {tracks.map((track, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={track.albumImageUrl}
                    alt={track.albumName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-lg font-semibold">{track.title}</p>
                    <p className="text-gray-600">{track.albumName}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full text-white text-lg font-bold ${getCircleColor(getScoreForTrack(track.title))}`}
                >
                  {getScoreForTrack(track.title) === 'loading' ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    getScoreForTrack(track.title)
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
