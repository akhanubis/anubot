const { ACCOUNTS_LIST, DAY_TO_MS } = require('../constants')
const { matchesByAccount } = require('../db')
const { emoji, percentage, replaceText } = require('../utils')

const
  REGEX = /^\!stats ([\S]+)(\s+\d+d)?/i,
  NAME = 'Stats',
  REPLY = `\`\`\`
%TIME_WINDOW% stats for %ACCOUNT%
----------------------------
W-D-L: %W%-%D%-%L% (%WR%%)
Heroes: Comming soon...
%PLAYED_WITH%
\`\`\``,
  WITH_ENTRY = 'With %ACCOUNT%: %W%-%D%-%L% (%WR%%)'

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
            played_with = format_played_with(s_data.with)
            replacements = {
              TIME_WINDOW: humanized_time,
              ACCOUNT: full_account,
              WR: s_data.WR,
              W: s_data.W,
              D: s_data.D,
              L: s_data.L,
              PLAYED_WITH: played_with
            },
            content = replaceText(REPLY, replacements)
        msg.channel.send(content)
      }
      else
        msg.channel.send(`No matches found for ${ full_account } ${ emoji('pepehands') }`)
    })
  }
}

const stats = matches => {
  let out = {
    W: 0,
    D: 0,
    L: 0,
    with: {}
  }
  for (let m of matches) {
    out[m.result]++
    for (let a of m.played_with || []) {
      if (!out.with[a])
        out.with[a] = {
          W: 0,
          D: 0,
          L: 0
        }
      out.with[a][m.result]++
    }
  }
  out.WR = percentage(out.W / (out.W + out.D + out.L))
  return out
}

const format_played_with = data => {
  return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).map(([acc, stats]) => replaceText(WITH_ENTRY, {
    ACCOUNT: acc,
    W: stats.W,
    D: stats.D,
    L: stats.L,
    WR: percentage(stats.W / (stats.W + stats.D + stats.L))
  })).join("\n")
}