const { translate } = require('../google')
const { translateAndReply } = require('../translateUtils')

const
  REGEX = /^\!translate(dm)?([\s\S]+)$/i,
  NAME = 'Translate'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let [_, dm, source_text] = msg.content.match(REGEX)
      translations = await translate([source_text])
  translateAndReply(msg, dm, translations)
}