const stringSimilarity = require('string-similarity')
const { MAPS_LIST, ACCOUNTS_LIST, PLAYERS_LIST, HEROES_LIST, PATS, WIN_REACTIONS, RESULT_EMOJIS } = require('./constants')
const { saveMatch } = require('./db')
const { emoji, pickRandom, loss, draw, humanizedResult } = require('./utils')

const
  MATCH_SUMMARY_REGEX = /^\*?\*?\((win|loss|draw)\) (.+)\*?\*?\n([\s\S]+)$/i,
  NOTES_REGEX = /\*?notes\:([^\n]+)/i,
  ACCOUNT_REGEX = /(\d\. )?([a-z0-9]+)\:(.+)$/i,
  SR_REGEX = /((\d{4})-)?(\d{4})/,
  NAME = 'Match',
  REPLY = `
**(%RESULT%) %MAP% %RESULT_EMOJI%**
%PLAYERS_DATA%
%NOTES%
**SR CHANGES %RESULT_EMOJI_2%**
%SR_CHANGE_DATA%
`


exports.name = NAME

exports.regex = MATCH_SUMMARY_REGEX

exports.process = msg => {
  let matching_msg = msg.content.match(MATCH_SUMMARY_REGEX),
      [_, result_text, map_text, extras_text] = matching_msg.map(a => a.toLowerCase()),
      result = result_text === 'win' ? 'W' : result_text === 'loss' ? 'L' : 'D'
      match = {
        author: msg.author.username,
        result: result,
        map: parse_map(map_text),
        notes: parse_notes(extras_text),
        players: parse_players(extras_text, result),
        timestamp: new Date().toISOString()
      }
  for (let p of match.players)
    if (p.sr)
      global.last_recorded_sr[p.account] = p.sr.end

  saveMatch(match)
  .then(_ => {
    reply_to_match(msg, match).then(new_msg => react_to_match(new_msg, match))
    msg.delete()
  })
}

const parse_map = t => {
  let possible_map = stringSimilarity.findBestMatch(t.trim().toLowerCase(), Object.keys(MAPS_LIST))
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

const parse_heroes = data => data.split(',').map(d => {
  let possible_hero = stringSimilarity.findBestMatch(d.trim().toLowerCase(), Object.keys(HEROES_LIST))
  if (possible_hero.bestMatch.rating >= 0.8)
    return HEROES_LIST[possible_hero.bestMatch.target]
}).filter(d => d)

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

const react_to_match = (msg, match) => {
  let e
  if (loss(match))
    e = 'feelssadman'
  else if (draw(match))
    e = 'zzz~1'
  else {
    let all_heroes_played = match.players.reduce((all, p) => [...all, ...p.heroes], []),
        pattable_heroes = Object.keys(PATS)
    all_heroes_played = Array.from(new Set(all_heroes_played))
    let pattable_heroes_played = all_heroes_played.filter(h => pattable_heroes.includes(h))
    if (pattable_heroes_played.length)
      e = PATS[pickRandom(pattable_heroes_played)]
    else
      e = pickRandom(WIN_REACTIONS)
  }
  return msg.react(emoji(e))
}

const reply_to_match = (msg, match) => {
  let r_emoji = pickRandom(RESULT_EMOJIS[match.result]),
      r_emoji_2 = pickRandom(RESULT_EMOJIS[match.result].filter(e => e !== r_emoji)),
      notes = match.notes ? `***NOTES**: ${ match.notes }` : '%EMPTY_LINE%',
      sr_data = match.players.map((p, i) => {
        let diff = p.sr.start && p.sr.end ? `${ loss(match) ? '-' : '+' }${ Math.abs(p.sr.end - p.sr.start) }` : '??'
        return `${ i + 1 }. **${ diff }** (${ p.sr.start ? p.sr.start : '????' }-${ p.sr.end ? p.sr.end : '????' })`
      }).join("\n"),
      players_data = match.players.map((p, i) => `${ i + 1}. **${ p.account }**: ${ [p.sr.end, ...p.heroes].filter(a => a).join(', ') }`).join("\n")
      
  return msg.channel.send(REPLY
    .replace('%RESULT%', humanizedResult(match).toUpperCase())
    .replace('%MAP%', match.map.toUpperCase())
    .replace('%RESULT_EMOJI%', emoji(r_emoji))
    .replace('%RESULT_EMOJI_2%', emoji(r_emoji_2))
    .replace('%SR_CHANGE_DATA%', sr_data)
    .replace('%PLAYERS_DATA%', players_data)
    .replace('%NOTES%', notes)
    .replace(/\%EMPTY_LINE\%\n/g, '')
  )
}