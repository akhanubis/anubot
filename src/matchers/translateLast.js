const { translate } = require('../google')
const { previousMessages, emoji } = require('../utils')
const { translateAndReply } = require('../translateUtils')

const
  REGEX = /^\!translatelast(dm)?\s*$/i,
  NAME = 'Translate Last'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let prev_messages = await previousMessages(msg),
      dm = msg.content.match(REGEX)[1],
      last_author = prev_messages[0].author.id
      last_same_author = []
  for (let i = 0; i < prev_messages.length; i++)
    if (prev_messages[i].author.id === last_author && prev_messages[i].content)
      last_same_author.unshift(prev_messages[i].content)
    else
      break
  if (last_same_author.length) {
    translations = await translate(last_same_author)
    translateAndReply(msg, dm, translations)
  }
  else
    msg[dm ? 'author' : 'channel'].send(`Nothing to translate ${ emoji('pepothink') }`)
}