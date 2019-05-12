const { ACCOUNTS_LIST, DAY_TO_MS } = require('../constants')
const { matchesByAccount } = require('../db')
const { emoji, percentage, replaceText } = require('../utils')

const
  REGEX = /^\!stats ([\S]+)(\s+\d+d)?/i,
  NAME = 'Stats',
  REPLY = `\`\`\`
  %TIME_WINDOW% stats for %ACCOUNT%
  ----------------------------

  Win Rate (draw as loss): %WR_DRAW%%\n
  Win Rate (no draw): %WR_NO_DRAW%%\n
  Wins: %WINS%\n
  Draws: %DRAWS%\n
  Losses: %LOSSES%\n
  Heroes: Comming soon...
  \`\`\``

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let [_, acc, days] = msg.content.match(REGEX),
      full_account = ACCOUNTS_LIST[acc.toLowerCase()]
  if (!full_account)
    msg.channel.send(`Who the fuck is ${ acc }? ${ emoji('dinking') }`)
  else {
    let start_timestamp = null
    if (days) {
      days = parseInt(days)
      start_timestamp = new Date(new Date().getTime() - days * DAY_TO_MS).toISOString()
    }
    matchesByAccount(full_account, start_timestamp)
    .then(matches => {
      if (matches.length) {
        let s_data = stats(matches),
            humanized_time = days ? `Last ${ days } day${ days > 1 ? 's' : '' }`: 'All time',
            replacements = {
              TIME_WINDOW: humanized_time,
              ACCOUNT: full_account,
              WR_DRAW: s_data.wr_draw,
              WR_NO_DRAW: s_data.wr_no_draw,
              WINS: s_data.wins,
              DRAWS: s_data.draws,
              LOSSES: s_data.losses
            },
            content = replaceText(REPLY, replacements)
        msg.channel.send(content)
      }
      else
        msg.channel.send(`No matches found for ${ full_account } ${ emoji('pepehands') }`)
    })
  }
}

stats = matches => {
  let out = {
    wins: matches.filter(m => m.result === 'W').length,
    draws: matches.filter(m => m.result === 'D').length,
    losses: matches.filter(m => m.result === 'L').length,
  }
  out.wr_draw = percentage(out.wins / (out.wins + out.draws + out.losses))
  out.wr_no_draw = (out.wins + out.losses) ? percentage(out.wins / (out.wins + out.losses)) : '-'
  return out
}