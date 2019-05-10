const { saveMatch } = require('./db')
const { delayedDelete } = require('./utils')
const { parseMatch, formatMatch, reactToMatch, matchAppendId, MATCH_SUMMARY_REGEX } = require('./matchUtils')

const
  NAME = 'Match'

exports.name = NAME

exports.regex = MATCH_SUMMARY_REGEX

exports.process = msg => {
  let match = parseMatch(msg)
  for (let p of match.players)
    if (p.sr)
      global.last_recorded_sr[p.account] = p.sr.end

  reply_to_match(msg, match).then(new_msg => {
    match.message_id = new_msg.id
    saveMatch(match)
    matchAppendId(new_msg)
    reactToMatch(new_msg, match)
    delayedDelete(msg)
  })
}

const reply_to_match = (msg, match) => msg.channel.send(formatMatch(match))