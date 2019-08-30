const { htmlUnescape } = require('./utils')

const format_track = t => `${ t.name } - ${ t.artists[0].name }`

const get_tracks_by_artist = id => {
  return global.spotify.getArtistTopTracks(id, 'US')
  .then(result => result.body.tracks.map(format_track))
}

const get_tracks_by_album = id => {
  return global.spotify.getAlbumTracks(id)
  .then(result => result.body.items.map(format_track))
}

const get_track_by_id = id => {
  return global.spotify.getTrack(id)
  .then(result => [format_track(result.body)])
}

const get_tracks_by_playlist = id => {
  return global.spotify.getPlaylistTracks(id, { fields: 'items(track(name,artists))' })
  .then(result => result.body.items.map(i => i.track).map(format_track))
}

exports.getSpotifyTracks = async url => {
  let tracks
  if (url.match(/\/artist\//))
    tracks = await get_tracks_by_artist(url.match(/\/artist\/([a-zA-Z0-9]+)/)[1])
  else if (url.match(/\/album\//))
    tracks = await get_tracks_by_album(url.match(/\/album\/([a-zA-Z0-9]+)/)[1])
  else if (url.match(/\/track\//))
    tracks = await get_track_by_id(url.match(/\/track\/([a-zA-Z0-9]+)/)[1])
  else if (url.match(/\/playlist\//))
    tracks = await get_tracks_by_playlist(url.match(/\/playlist\/([a-zA-Z0-9]+)/)[1])
  return tracks.map(htmlUnescape)
}

exports.keywordsToTrack = async keywords => {
  keywords = keywords.replace(/\([^)]*\)/g, '').trim()
  const result = await global.spotify.searchTracks(keywords, { limit: 10 }),
        track = result.body.tracks.items[0]
  if (track)
    return {
      title: track.name.replace(/\([^)]*\)/g, ''),
      artist: track.artists[0].name.replace(/\([^)]*\)/g, '')
    }
  return {}
}