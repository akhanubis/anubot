const { deleteMatchById, saveMatch } = require('./db')
const { delayedDelete } = require('./utils')
const { parseMatch, formatMatch, matchAppendId } = require('./matchUtils')

const
  REGEX = /^!replacematch\s+\#(\d+)\n([\s\S]+)$/i,
  NAME = 'Replace match'

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let [_, match_id, new_match_raw] = msg.content.match(REGEX),
      new_match = parseMatch({
        content: new_match_raw,
        author: msg.author
      })
  deleteMatchById(match_id)
  .then(deleted_entries => {
    new_match.timestamp = deleted_entries[0].timestamp
    new_match.message_id = deleted_entries[0].message_id
    msg.channel.fetchMessage(new_match.message_id)
    .then(old_msg => old_msg.edit(formatMatch(new_match)))
    .then(old_msg => matchAppendId(old_msg, match_id))
    saveMatch(new_match, match_id)
    delayedDelete(msg)
  })
}