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

exports.getSpotifyTracks = url => {
  if (url.match(/\/artist\//))
    return get_tracks_by_artist(url.match(/\/artist\/([a-zA-Z0-9]+)/)[1])
  if (url.match(/\/album\//))
    return get_tracks_by_album(url.match(/\/album\/([a-zA-Z0-9]+)/)[1])
  if (url.match(/\/track\//))
    return get_track_by_id(url.match(/\/track\/([a-zA-Z0-9]+)/)[1])
  if (url.match(/\/playlist\//))
    return get_tracks_by_playlist(url.match(/\/playlist\/([a-zA-Z0-9]+)/)[1])
}