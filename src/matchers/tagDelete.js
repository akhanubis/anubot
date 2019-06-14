const { deleteTagById } = require('../db')

const
  REGEX = /^!deletetag\s+\#(\d+)/i,
  NAME = 'Delete Tag'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let tag_id = msg.content.match(REGEX)[1]
  await deleteTagById(msg.channel.guild, tag_id)
  msg.channel.send(`Tag #${ tag_id } deleted`)
}