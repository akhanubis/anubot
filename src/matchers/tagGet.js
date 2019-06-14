const { getTags } = require('../db')
const { emoji } = require('../utils')

const
  REGEX = /^\!tagged\s+([\s\S]+)$/i,
  NAME = 'Get Tag'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let tags = msg.content.match(REGEX)[1].split(',').map(t => t.trim()).filter(t => t),
      records = await getTags(msg.channel.guild, tags)
  if (!records.length)
    return msg.channel.send(`No media found for the tags given ${ emoji('pepothink') }`)
  for (let r of records)
    if (r.attachable)
      await msg.channel.send(`#${ r.tag_id }`, { files: [r.url] })
    else
      await msg.channel.send(`#${ r.tag_id } ${ r.url }`)
}