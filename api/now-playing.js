// api/now-playing.js
// Vercel serverless function — returns what's currently playing on Spotify
// Deploy this with your site on Vercel. Set these env vars in Vercel dashboard:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const BASE64 = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

async function getAccessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASE64}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });
  return res.json();
}

async function getNowPlaying(accessToken) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export default async function handler(req, res) {
  // CORS so your frontend can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const { access_token } = await getAccessToken();
    const response = await getNowPlaying(access_token);

    // 204 = nothing playing
    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const data = await response.json();

    // Only handle tracks (not podcasts)
    if (data.currently_playing_type !== 'track') {
      return res.status(200).json({ isPlaying: false });
    }

    const isPlaying  = data.is_playing;
    const title      = data.item.name;
    const artist     = data.item.artists.map(a => a.name).join(', ');
    const songUrl    = data.item.external_urls.spotify;
    const albumArt   = data.item.album.images[2]?.url; // smallest thumbnail

    return res.status(200).json({ isPlaying, title, artist, songUrl, albumArt });
  } catch (err) {
    console.error('Spotify API error:', err);
    return res.status(200).json({ isPlaying: false });
  }
}
