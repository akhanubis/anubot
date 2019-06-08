const { deleteNadeById } = require('../db')

const
  REGEX = /^!deletenade\s+\#(\d+)/i,
  NAME = 'Delete Nade'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let nade_id = msg.content.match(REGEX)[1]
  await deleteNadeById(nade_id)
  msg.channel.send(`Nade #${ nade_id } deleted`)
}