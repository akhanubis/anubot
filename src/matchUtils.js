const stringSimilarity = require('string-similarity')
const { MAPS_LIST, ACCOUNTS_LIST, PLAYERS_LIST, HEROES_LIST, RESULT_EMOJIS, PATS, MAIN_EMOJIS } = require('./constants')
const { emoji, pickRandom, loss, draw, humanizedResult } = require('./utils')

const
  MATCH_SUMMARY_REGEX = /^\*?\*?\((win|loss|draw)\) (.+)\*?\*?\n([\s\S]+)$/i,
  NOTES_REGEX = /\*?notes\:([^\n]+)/i,
  ACCOUNT_REGEX = /(\d\. )?([a-z0-9]+)\:(.+)$/i,
  SR_REGEX = /((\d{4})-)?(\d{4})/,
  REPLY = `
**(%RESULT%) %MAP% %MAIN_EMOJI%**
%PLAYERS_DATA%
%NOTES%
**SR CHANGES %RESULT_EMOJI%**
%SR_CHANGE_DATA%
`

exports.MATCH_SUMMARY_REGEX = MATCH_SUMMARY_REGEX

exports.parseMatch = msg => {
  let matching_msg = msg.content.match(MATCH_SUMMARY_REGEX),
      [_, result_text, map_text, extras_text] = matching_msg.map(a => a.toLowerCase()),
      result = result_text === 'win' ? 'W' : result_text === 'loss' ? 'L' : 'D'
  return {
    author: msg.author.username,
    result: result,
    map: parse_map(map_text),
    notes: parse_notes(extras_text),
    players: parse_players(extras_text, result),
    timestamp: new Date().toISOString()
  }
}

exports.formatMatch = match => {
  let m_emoji = main_emoji(match),
      r_emoji = pickRandom(RESULT_EMOJIS[match.result]),
      notes = match.notes ? `*NOTES: ${ match.notes }` : '%EMPTY_LINE%',
      sr_data = match.players.map((p, i) => {
        let diff = p.sr.start && p.sr.end ? `${ loss(match) ? '-' : '+' }${ Math.abs(p.sr.end - p.sr.start) }` : '??'
        return `${ i + 1 }. **${ diff }** (${ p.sr.start ? p.sr.start : '????' }-${ p.sr.end ? p.sr.end : '????' })`
      }).join("\n"),
      players_data = match.players.map((p, i) => `${ i + 1}. ${ p.account.toUpperCase() }: ${ [p.sr.end, ...p.heroes.map(a => a.toLowerCase())].filter(a => a).join(', ') }`).join("\n")
      
  return REPLY
    .replace('%RESULT%', humanizedResult(match).toUpperCase())
    .replace('%MAP%', match.map.toUpperCase())
    .replace('%MAIN_EMOJI%', emoji(m_emoji))
    .replace('%RESULT_EMOJI%', emoji(r_emoji))
    .replace('%SR_CHANGE_DATA%', sr_data)
    .replace('%PLAYERS_DATA%', players_data)
    .replace('%NOTES%', notes)
    .replace(/\%EMPTY_LINE\%\n/g, '')
}

exports.matchAppendId = (msg, match_id) => msg.edit(`${ msg.content }\nref #${ match_id }`)

const parse_map = t => {
  let possible_map = stringSimilarity.findBestMatch(t.replace(/\:[^:]+\:/, '').trim().toLowerCase(), Object.keys(MAPS_LIST))
  if (possible_map.bestMatch.rating < 0.8)
    throw(`No map found for ${ t }`)
  return MAPS_LIST[possible_map.bestMatch.target]
}

const parse_notes = t => {
  let notes = t.match(NOTES_REGEX)
  if (notes)
    return notes[1].trim()
}

const parse_sr = (account, data, result) => {
  let sr_data = data.match(SR_REGEX),
      start_sr, end_sr

  if (sr_data) {
    start_sr = parseInt(sr_data[2]) || undefined
    end_sr = parseInt(sr_data[3]) || undefined
    if (result === 'D')
      start_sr = end_sr
    else {
      /* assume last recorded sr is prev sr if it's in between a common sense range */
      let last_sr = last_recorded_sr[account]
      if (last_sr && ((result === 'W' && last_sr < end_sr - 10 && last_sr >= end_sr - 35) || (result === 'L' && last_sr > end_sr + 10 && last_sr <= end_sr + 35)))
        start_sr = last_sr
    }
  }
  return {
    start: start_sr,
    end: end_sr,
    diff: start_sr ? end_sr - start_sr : undefined
  }
}

const parse_heroes = data => Array.from(new Set(data.split(',').map(d => {
  let possible_hero = stringSimilarity.findBestMatch(d.trim().toLowerCase(), Object.keys(HEROES_LIST))
  if (possible_hero.bestMatch.rating >= 0.8)
    return HEROES_LIST[possible_hero.bestMatch.target]
}).filter(d => d)))

const parse_account = acc_text => {
  let possible_account = stringSimilarity.findBestMatch(acc_text, Object.keys(ACCOUNTS_LIST))
  if (possible_account.bestMatch.rating < 0.6)
    throw(`No account found for ${ acc_text }`)
  return ACCOUNTS_LIST[possible_account.bestMatch.target]
}

const find_player = account => Object.entries(PLAYERS_LIST).find(([_, accounts]) => accounts.includes(account))[0]

const parse_players = (t, result) => {
  return t.split("\n").filter(l => !l.match(NOTES_REGEX) && l.match(ACCOUNT_REGEX)).map(l => {
    let m = l.match(ACCOUNT_REGEX).map(a => (a || '').trim().toLowerCase()),
        acc = m[2],
        data = m[3],
        account = parse_account(acc)
    return {
      account: account,
      player: find_player(account),
      sr: parse_sr(account, data, result),
      heroes: parse_heroes(data)
    }
  })
}

const main_emoji = match => {
  let possible_emojis = []
  if (loss(match))
    possible_emojis = MAIN_EMOJIS.L
  else if (draw(match))
    possible_emojis = MAIN_EMOJIS.D
  else {
    let all_heroes_played = match.players.reduce((all, p) => [...all, ...p.heroes], []),
        pats = Array.from(new Set(all_heroes_played)).map(h => PATS[h]).filter(p => p)
    if (pats.length)
      possible_emojis = pats
    else
      possible_emojis = MAIN_EMOJIS.W
  }
  return emoji(pickRandom(possible_emojis))
}