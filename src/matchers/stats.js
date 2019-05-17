const { ACCOUNTS_LIST, DAY_TO_MS } = require('../constants')
const { matchesByAccount } = require('../db')
const { emoji, percentage, float, replaceText, draw } = require('../utils')

const
  REGEX = /^\!stats ([\S]+)(\s+\d+d)?/i,
  NAME = 'Stats',
  REPLY = `\`\`\`
%TIME_WINDOW% stats for %ACCOUNT%
----------------------------
W-D-L: %W%-%D%-%L% (%WR%%)
----------------------------
%PLAYED_AS%
----------------------------
%PLAYED_WITH%
----------------------------
+%AVG_SR_WIN% avg SR on win
-%AVG_SR_LOSS% avg SR on loss
\`\`\``,
  WITH_ENTRY = 'With %ACCOUNT%: %W%-%D%-%L% (%WR%%)',
  AS_ENTRY = '%HERO%: %W%-%D%-%L% (%WR%%)'

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
            played_with = format_played_with_as(s_data.with, WITH_ENTRY),
            played_as = format_played_with_as(s_data.as, AS_ENTRY)
            replacements = {
              TIME_WINDOW: humanized_time,
              ACCOUNT: full_account,
              WR: s_data.WR,
              W: s_data.W,
              D: s_data.D,
              L: s_data.L,
              PLAYED_WITH: played_with,
              PLAYED_AS: played_as,
              AVG_SR_WIN: s_data.AVG_SR_WIN,
              AVG_SR_LOSS: s_data.AVG_SR_LOSS
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
    with: {},
    as: {},
    sr: {
      W: {
        count: 0,
        total: 0
      },
      L: {
        count: 0,
        total: 0
      }
    }
  }
  for (let m of matches) {
    out[m.result]++
    if (m.sr && m.sr.diff && !draw(m)) {
      out.sr[m.result].count++
      out.sr[m.result].total += m.sr.diff
    }
    for (let a of m.played_with || []) {
      if (!out.with[a])
        out.with[a] = {
          W: 0,
          D: 0,
          L: 0
        }
      out.with[a][m.result]++
    }
    for (let a of m.heroes || []) {
      if (!out.as[a])
        out.as[a] = {
          W: 0,
          D: 0,
          L: 0
        }
      out.as[a][m.result]++
    }
  }
  out.WR = percentage(out.W / (out.W + out.D + out.L))
  out.AVG_SR_WIN = float(out.sr.W.count ? out.sr.W.total / out.sr.W.count : 0)
  out.AVG_SR_LOSS = float(out.sr.L.count ? Math.abs(out.sr.L.total / out.sr.L.count) : 0)
  return out
}

const format_played_with_as = (data, entry_text) => {
  return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).map(([acc_or_hero, stats]) => replaceText(entry_text, {
    ACCOUNT: acc_or_hero,
    HERO: acc_or_hero,
    W: stats.W,
    D: stats.D,
    L: stats.L,
    WR: percentage(stats.W / (stats.W + stats.D + stats.L))
  })).join("\n")
}