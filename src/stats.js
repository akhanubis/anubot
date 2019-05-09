const { ACCOUNTS_LIST } = require('./constants')
const { matchesByAccount } = require('./db')
const { emoji, percentage } = require('./utils')

const
  REGEX = /^\!stats ([\S]+)/i,
  NAME = 'Stats',
  REPLY = `\`\`\`
  All time stats for %ACCOUNT%
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
  let [_, acc] = msg.content.match(REGEX),
      full_account = ACCOUNTS_LIST[acc.toLowerCase()]
  if (!full_account)
    msg.reply(`Who the fuck is ${ acc }? ${ emoji('dinking') }`)
  else
    matchesByAccount(full_account)
    .then(matches => {
      if (matches.length) {
        let s_data = stats(matches)
        msg.channel.send(REPLY.replace('%ACCOUNT%', full_account).replace('%WR_DRAW%', s_data.wr_draw).replace('%WR_NO_DRAW%', s_data.wr_no_draw).replace('%WINS%', s_data.wins).replace('%DRAWS%', s_data.draws).replace('%LOSSES%', s_data.losses))
      }
      else
        msg.channel.send(`No matches found for ${ full_account } ${ emoji('pepehands') }`)
    })
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