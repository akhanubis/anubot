const { saveTags } = require('../db')
const { emoji } = require('../utils')

const
  REGEX = /^\!tag\s+([^\n]+)([\s\S]*)$/i,
  NAME = 'Save Tag',
  URL_REGEX = /https?:\/\/[^\s]+/g

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let tags = msg.content.match(REGEX)[1].split(',').map(t => t.trim()).filter(t => t),
      attachments = (msg.attachments || []).map(a => ({ url: a.url, attachable: true })),
      extra_attachments = (msg.content.match(REGEX)[2].trim().match(URL_REGEX) || []).map(a => ({ url: a, attachable: false })),
      medias = [...attachments, ...extra_attachments]
  if (!tags.length)
    msg.channel.send(`Tags missing ${ emoji('pepothink') }`)
  else if (!medias.length)
    msg.channel.send(`Media missing ${ emoji('pepothink') }`)
  else {
    let new_ids = await saveTags(msg.channel.guild, msg.author, tags, medias)
    msg.channel.send(`Tag${ new_ids.length > 1 ? 's' : ''} saved as ${ new_ids.map(id => `#${ id }`).join(', ') }`)
  }
}