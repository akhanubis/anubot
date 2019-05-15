const { translate } = require('../google')
const { previousMessages } = require('../utils')

const
  REGEX = /^\!translatelast\s*$/i,
  NAME = 'Translate Last'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let prev_messages = Array.from((await previousMessages(msg)).values()),
      last_author = prev_messages[0].author.id
      last_same_author = []
  for (let i = 0; i < prev_messages.length; i++)
    if (prev_messages[i].author.id === last_author)
      last_same_author.unshift(prev_messages[i].content)
    else
      break

  translations = await translate(last_same_author)
  msg.channel.send(translations.join("\n"))
}