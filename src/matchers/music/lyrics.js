const { state, setLastState, reply } = require('./musicUtils')
const { emoji } = require('../../utils')
const { keywordsToTrack } = require('../../spotify')
const { getLyrics } = require('../../genius')

const
  REGEX = /^\!lyrics(\s+([^\n]+))?$/i,
  NAME = 'Music Lyrics'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  const guild_id = setLastState(msg)
  if (guild_id) {
    const keywords = (msg.content.match(REGEX)[2] || '').trim() || state(guild_id).media_name
    if (!keywords) {
      reply(guild_id, `I'm not playing anything and you didnt provide any search terms ${ emoji('peperetarded') }`, false)
      return
    }
    const { artist, title } = await keywordsToTrack(keywords)
    if (!artist) {
      reply(guild_id, `No lyrics found for ${ keywords } ${ emoji('pepothink') }`,false)
      return
    }
    const lyrics = await getLyrics(artist, title)
    if (lyrics)
      reply(guild_id, `\`\`\`${ lyrics }\`\`\``, false)
    else
      reply(guild_id, `No lyrics found for ${ title } - ${ artist } ${ emoji('pepothink') }`,false)
  }
}