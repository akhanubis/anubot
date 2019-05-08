const Discord = require('discord.js')
const stringSimilarity = require('string-similarity')
const { DISCORD_TOKEN } = require('./env')
const { MAPS_LIST, ACCOUNTS_LIST, PLAYERS_LIST, HEROES_LIST } = require('./constants')
const { initAWS } = require('./startup')
const { populateLastSr, saveMatch } = require('./db')


const
  MATCH_SUMMARY_REGEX = /^\*?\*?\((win|loss|draw)\) (.+)\*?\*?\n([\s\S]+)$/i,
  NOTES_REGEX = /notes\:([\s\S]+)$/i,
  SR_REGEX = /((\d{4})-)?(\d{4})/

const last_recorded_sr = {}

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

const parse_sr = (account, data) => {
  let sr_data = data.match(SR_REGEX),
      start_sr, end_sr

  if (sr_data) {
    start_sr = parseInt(sr_data[2]) || undefined
    end_sr = parseInt(sr_data[3]) || undefined
    /* assume last recorded sr is prev sr */
    let last_sr = last_recorded_sr[account]
    if (last_sr && last_sr >= end_sr - 30 && last_sr <= end_sr + 30)
      start_sr = last_sr
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

const parse_players = t => {
  return t.split("\n").filter(l => !l.startsWith('notes:')).map(l => {
    let [acc, data] = l.split(':').map(a => a.trim().toLowerCase()),
        account = parse_account(acc)
    return {
      account: account,
      player: find_player(account),
      sr: parse_sr(account, data),
      heroes: parse_heroes(data)
    }
  })
}

const m = async _ => {
  initAWS()
  await populateLastSr(last_recorded_sr)
  console.log(`Last recorded SR: ${ Object.entries(last_recorded_sr).map(([a, b]) => `${ a }: ${ b }`) }`)

  const client = new Discord.Client()

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })
  client.on('message', msg => {
    let matching_msg = msg.content.match(MATCH_SUMMARY_REGEX)
    if (matching_msg) {
      let [_, result_text, map_text, extras_text] = matching_msg.map(a => a.toLowerCase())

      try {
        let match = {
          author: msg.author.username,
          result: result_text === 'win' ? 'W' : result_text === 'loss' ? 'L' : 'D',
          map: parse_map(map_text),
          notes: parse_notes(extras_text),
          players: parse_players(extras_text),
          timestamp: new Date().toISOString()
        }
        for (let p of match.players)
          if (p.sr)
            last_recorded_sr[p.account] = p.sr.end

        saveMatch(match)
      }
      catch(e) {
        console.log('Error parsing match')
        console.log(e)
      }
    }
  })
  client.login(DISCORD_TOKEN)
}

m()