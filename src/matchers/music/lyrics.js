const { state, setLastState, reply, getLyrics } = require('./musicUtils')
const { emoji } = require('../../utils')
const { keywordsToTrack } = require('../../spotify')

const
  REGEX = /^\!lyrics(\s+([^\n]+))?$/i,
  NAME = 'Music Lyrics',
  MAX_LYRICS_SIZE = 1900,
  SPLIT_SIZE = 1500

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let keywords = (msg.content.match(REGEX)[2] || '').trim()
  if (!keywords) {
    const guild_id = setLastState(msg)
    if (guild_id) {
      keywords = state(guild_id).original_query || state(guild_id).media_name
      if (!keywords) {
        reply(guild_id, `I'm not playing anything and you didnt provide any search terms ${ emoji('peperetarded') }`, false)
        return
      }
    }
  }
  const { artist, title } = await keywordsToTrack(keywords)
  if (!artist) {
    msg.channel.send(`No lyrics found for ${ keywords } ${ emoji('pepothink') }`)
    return
  }
  const lyrics = await getLyrics(artist, title)
  if (lyrics) {
    let chunks
    if (lyrics.length > MAX_LYRICS_SIZE) {
      const split_index = SPLIT_SIZE + lyrics.substr(SPLIT_SIZE).indexOf("\n\n")
      chunks = [lyrics.substr(0, split_index), lyrics.substr(split_index)]
    }
    else
      chunks = [lyrics, '']
    await msg.channel.send(`${ title } by ${ artist }`)
    await msg.channel.send(`>>> ${ chunks[0].trim() }`)
    if (chunks[1].length)
      await msg.channel.send(`>>> ${ chunks[1].trim() }`)
  }
  else
    msg.channel.send(`No lyrics found for ${ title } - ${ artist } ${ emoji('pepothink') }`)
}