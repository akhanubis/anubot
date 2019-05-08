const
  ROBO_REGEX = /\!robo/i,
  REPLY = 'Did someone say !robo?',
  NAME = 'Robo'

exports.name = NAME

exports.regex = ROBO_REGEX

exports.process = msg => {
  if (!msg.author.bot)
    msg.reply(REPLY)
}