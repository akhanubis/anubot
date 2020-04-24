const { USER_IDS } = require('../constants')

const
  REGEX = /manquitos\s*│\s*ember spirit/i,
  REPLIES = [
    'el ember lo hizo de nuevo',
    '<:handsup:702331680140165140>'
  ],
  NAME = 'Ember Spirit'

exports.name = NAME

exports.regex = REGEX

exports.skip_reaction = true

exports.listen_to_bots = true

exports.process = async msg => {
  const lines = msg.content.split("\n"),
        winnerLineIndex = lines.findIndex(l => l.match(/ \(WINNER\) ────/)),
        emberLineIndex = lines.findIndex(l => l.match(REGEX)),
        indexesDiff = emberLineIndex - winnerLineIndex
  if (winnerLineIndex >= 0 && emberLineIndex >=0 && (indexesDiff < 0 || indexesDiff > 5))
    if (msg.author.id === USER_IDS.gaben)
      for (reply of REPLIES)
        await msg.channel.send(reply)
}