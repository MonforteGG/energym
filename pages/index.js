import { useState } from 'react';
import { fetchPlaylistTracks, fetchPlaylistDetails } from '../lib/spotify';
import { getScore } from '../lib/ai';
import { calculateAverageScore } from '../utils/calculateAverageScore';
import { removeEmojis } from '../utils/removeEmojis';
import Head from 'next/head';
import Link from "next/link";


export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');
  const [scores, setScores] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistOwner, setPlaylistOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start loading
    setLoading(true);
    setDataLoaded(true);

    try {
      const trackData = await fetchPlaylistTracks(playlistUrl);
      setTracks(trackData);

      const playlistDetails = await fetchPlaylistDetails(playlistUrl);
      setPlaylistTitle(playlistDetails.name);
      setPlaylistOwner(playlistDetails.owner);

      // Get song titles and artists for scoring
      const titlesWithArtists = trackData.map(track => ({ title: track.title, artist: track.artist }));
      const rhythmScores = await getScore(titlesWithArtists);

      // Map scores to an array based on song position
      const mappedScores = titlesWithArtists.map((_, index) => rhythmScores[index] ?? null);

      setScores(mappedScores);
      setError('');
    } catch (error) {
      console.error('Error processing playlist:', error);
      setError('Error processing playlist. Please check the playlist URL and try again.');
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  // Calculate the average score
  const averageScore = calculateAverageScore(scores);

  // Determine the color for the average score
  const averageScoreGradient = averageScore > 75
    ? 'bg-gradient-to-br from-green-900 via-green-400 to-green-900'
    : averageScore >= 50
      ? 'bg-gradient-to-br from-yellow-900 via-yellow-400 to-yellow-900'
      : 'bg-gradient-to-br from-red-900 via-red-400 to-red-900';

  // Separate text from emojis
  let playlistText = removeEmojis(playlistTitle);
  const isOnlyEmojis = playlistText === '';
  if (isOnlyEmojis) {
    playlistText = playlistTitle;
  }

  const textStyle = isOnlyEmojis
    ? ""
    : "bg-gradient-to-r from-green-600 to-green-300 text-transparent bg-clip-text";

  return (
    <>
      <Head>
        <title>EnerGYM</title>
      </Head>
      <div className="flex flex-col max-w-3xl mx-auto p-6 bg-transparent text-white min-h-screen">
        <div className='flex-grow'>
          <div className="flex flex-col items-center mt-10 mb-6">
            {dataLoaded ? (
              <>
                {loading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-44 h-44 bg-gray-300 rounded-md animate-pulse"></div>
                    <div className="w-48 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`text-9xl px-5 py-6 font-bold border rounded-md text-center mb-4 ${averageScoreGradient}`}
                    >
                      {averageScore}
                    </div>
                    <h2 className="text-4xl sm:text-5xl text-center font-bold mb-3">
                      <span
                        className={`text-2.25rem ${textStyle}`}
                        style={{ fontSize: '2.25rem' }}
                      >
                        {playlistText}
                      </span>
                    </h2>
                    <span>
                      {playlistOwner}
                    </span>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-center mt-10 mb-6 bg-gradient-to-br from-green-600 via-green-300 to-green-600 text-transparent bg-clip-text">
                  EnerGYM  <i className="fa fa-brands fa-spotify hover"></i>
                </h1>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex justify-center items-center mb-6">
            <input
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Enter Spotify playlist URL"
              className="p-2 border border-gray-700 rounded-lg bg-gray-800 text-white mr-2 hover:border-white focus:border-white transition-colors duration-300"
              required
            />
            <button
              type="submit"
              className="group flex items-center justify-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 transition-transform duration-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <i className="transform transition-transform duration-300 group-hover:translate-x-2 fa fa-arrow-right"></i>
              )}
            </button>
          </form>
          {!dataLoaded && (
            <p className="mt-10 mb-6 text-center text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto text-gray-300">
              Enhance your workouts with <span className="text-green-400 font-bold">EnerGYM</span>! Our webapp uses AI to analyze your Spotify playlists and determine how optimal each track is for training. Just enter your Spotify playlist URL to get a detailed breakdown of your music's energy levels and find the perfect beats to keep you moving.
            </p>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg shadow-md">
                    <div className="w-24 h-24 bg-gray-600 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-600 rounded-lg animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              tracks.length > 0 && (
                <ul className="space-y-4">
                  {tracks.map((track, index) => (
                    <li key={index} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
                      <img
                        src={track.albumImageUrl}
                        alt={track.albumName}
                        className="w-24 h-24 max-w-[30%] object-cover rounded-lg"
                      />
                      <div className="flex-1 truncate text-sm max-w-[70%]">
                        <p className="truncate font-semibold">{track.title}</p>
                        <p className="text-gray-400 truncate">{track.artist}</p>
                        <p className="text-gray-400 truncate">{track.albumName}</p>
                      </div>
                      <div className={`w-16 h-16 flex items-center justify-center rounded-full text-white ${scores[index] > 75 ? 'bg-green-500' : scores[index] >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        <span className="text-xl font-bold">{scores[index] ?? 'N/A'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
        <footer>
          <p className="gap-1 text-center text-sm font-semibold mt-10">
            <span className="text-white text-opacity-25 mr-1">Developed by</span>
            <Link href="https://linkedin.com/in/albdiamun" target="_blank" className="text-nowrap text-white text-opacity-25 hover:text-opacity-100 transition-colors duration-300">Alberto Díaz</Link>
          </p>
        </footer>
      </div>
    </>
  );
}
