const { deleteMatchByMessageId, saveMatch } = require('./db')
const { delayedDelete } = require('./utils')
const { parseMatch, formatMatch, matchAppendId } = require('./matchUtils')

const
  REGEX = /^!replacematch\s+\#(\d+)\n([\s\S]+)$/i,
  NAME = 'Replace match'

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let [_, message_id, new_match_raw] = msg.content.match(REGEX),
      new_match = {
        ...parseMatch({
          content: new_match_raw,
          author: msg.author
        }),
        message_id: message_id
      }
  deleteMatchByMessageId(message_id)
  .then(deleted_entries => {
    new_match.timestamp = deleted_entries[0].timestamp
    msg.channel.fetchMessage(message_id)
    .then(old_msg => old_msg.edit(formatMatch(new_match)))
    .then(_ => matchAppendId(old_msg))
    saveMatch(new_match)
    delayedDelete(msg)
  })
}