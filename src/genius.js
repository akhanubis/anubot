const axios = require('axios')
const { GENIUS_API_KEY } = require('./env')

exports.getLyrics = async (artist, title) => {
  /* TODO */
  return
  const result = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?f_has_lyrics=true&q_track=${ title }&q_artist=${ artist }&page_size=1&s_track_rating=desc&apikey=${ MUSIXMATCH_API_KEY }`),
        track = result.data.message.body.track_list[0]
  if (!track)
    return
  console.log(track.track.track_id)
  const lyrics_result = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${ track.track.track_id }&apikey=${ MUSIXMATCH_API_KEY }`),
        lyrics = ((lyrics_result.data.message.body || {}).lyrics || {}).lyrics_body
  return lyrics
}