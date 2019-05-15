const
  REGEX = /^\!lacqua\s+([\s\S]+)$/i,
  NAME = 'Lacqua',
  REPLY = 'http://lmgtfy.com/?q=__QUESTION__'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  let question = msg.content.match(REGEX)[1]
  msg.channel.send(REPLY.replace('__QUESTION__', encodeURI(question)))
}