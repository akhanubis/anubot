const { translate } = require('../google')

const
  REGEX = /^\!translate ([\s\S]+)$/i,
  NAME = 'Translate'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let source_text = msg.content.match(REGEX)[1]
      translation = await translate(source_text)
  msg.channel.send(translation)
}