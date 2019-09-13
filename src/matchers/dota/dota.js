const axios = require('axios');
const { LANE_ROLE, DOTA_HEROES_LIST, DOTA_LEAGUE_RANKS, LOBBY_TYPES, GAME_MODE, SKILL_LEVEL } = require('./constants')
const moment = require('moment')

const
  REGEX = /^\!dota(\s+([^\n]+)\s+([^\n]+))?$/i,
  NAME = 'Dota Parse'
  URL = 'https://api.opendota.com/api/'
  
exports.name = NAME
exports.regex = REGEX 

exports.process = async msg => {
  const 
    text_channel = msg.channel,
    entity_type = (msg.content.match(REGEX)[2] || '').trim()
    parse_id = (msg.content.match(REGEX)[3] || '').trim()          
    switch (entity_type) {
      case 'match':
        parse_match(parse_id)
          .then(response => text_channel.send(response))
          .catch(error => {
            console.log(error)
            if(error.response.status == 404)
              text_channel.send(`Match ${parse_id} not found`)
          })
      break
    default:
      text_channel.send(`Missing parse ${ emoji('pepothink') }`)
      return
  }
}

const parse_match = parse_id => {
 return axios.get(` ${URL}/matches/${parse_id}`).then(response => {
    if(response.data.version) {
      let match_info = {
        duration: parse_match_duration(response.data.duration),
        game_mode: GAME_MODE[response.data.game_mode],
        dire_score: response.data.dire_score,
        radiant_score: response.data.radiant_score,
        winner: (response.data.radiant_win) ? 'Radiant' : 'Dire',
        lobby_type: LOBBY_TYPES[response.data.lobby_type],
        skill: (response.data.skill) ? SKILL_LEVEL[response.data.skill] : 'Unknown',
      }
      let players = response.data.players.map(x => {
        let player = {
          personaname: x.personaname ? x.personaname.replace(/[^\x00-\x7F]/g, '') : 'anonymous',
          last_hits: x.lh_t[10],
          denies: x.dn_t[10],
          assists: x.assists,
          deaths: x.deaths,
          kills: x.kills,
          level: x.level,
          total_exp: x.total_xp,
          xp_per_min: x.xp_per_min,
          total_gold: x.total_gold,
          gold_per_min: x.gold_per_min,
          eff: parseFloat(x.lane_efficiency).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2}),
          rank_tier: x.rank_tier ? parse_tier(x.rank_tier) : 'Unknown',
          lane_role: LANE_ROLE[x.lane_role],
          hero_damage: x.hero_damage,
          tower_damage: x.tower_damage,
          heroe: DOTA_HEROES_LIST[x.hero_id],
          isRadiant: x.isRadiant
       }
       return player
      })
      return parse_table(players, match_info)
    }
    return `Match ${parse_id} its not parsed`
  })
}

const parse_tier = rank_tier => { 
  let splited_rank = rank_tier && rank_tier.toString().split('')
  return DOTA_LEAGUE_RANKS[splited_rank[0]] + `[${splited_rank[1]}]`
}

const parse_match_duration = seconds => { 
  let duration = moment.utc(seconds*1000)
  return duration.format(seconds >= 3600 ? 'hh:mm:ss' : 'mm:ss')
}

const parse_table = (players, match_info) => {
  const fields = [
    'personaname',
    'heroe'
  ]

  let radiant_players = players.filter(x => x.isRadiant)
  let dire_players = players.filter(x => !x.isRadiant)
  let player_str_dire = ''
  let player_str_radiant = ''
  
  const max_lengths = fields.map(f => max_length(players, f))
  
  radiant_players.map(x => player_str_radiant += `|${format_field(x.personaname,Math.min(20,max_lengths[0]) ,false)} - ${format_field(x.heroe,Math.min(19,max_lengths[1]))}|${format_field(x.lane_role,6)}|${format_field(x.kills,3)}|${format_field(x.deaths,3)}|${format_field(x.assists,3)}|${format_field(x.last_hits,5)}|${format_field(x.denies,5)}|${format_field(x.eff,7)}|${format_field(x.gold_per_min,5)}|${format_field(x.xp_per_min,5)}|${format_field(x.hero_damage,6)}|${format_field(x.tower_damage,6)}|${format_field(x.rank_tier,11)}|\n`)
  dire_players.map(x => player_str_dire += `|${format_field(x.personaname,Math.min(20,max_lengths[0]) ,false)} - ${format_field(x.heroe,Math.min(19,max_lengths[1]))}|${format_field(x.lane_role,6)}|${format_field(x.kills,3)}|${format_field(x.deaths,3)}|${format_field(x.assists,3)}|${format_field(x.last_hits,5)}|${format_field(x.denies,5)}|${format_field(x.eff,7)}|${format_field(x.gold_per_min,5)}|${format_field(x.xp_per_min,5)}|${format_field(x.hero_damage,6)}|${format_field(x.tower_damage,6)}|${format_field(x.rank_tier,11)}|\n`)

  let dif = 20 - max_lengths[0] + 19 - max_lengths[1]

  let table = "```"
  table = `${table}${match_info.radiant_score} - ${match_info.dire_score} in ${match_info.duration} - Game Mode: ${match_info.game_mode} - Lobby: ${match_info.lobby_type} - Skill: ${match_info.skill} - Winner: ${match_info.winner} \n\n`
  table = `${table}|${' '.repeat(Math.min(20,max_lengths[0]) + Math.min(19,max_lengths[1]) + 3)}|  Lane|  K|  D|  A|lh@10|dn@10| eff@10|  GPM|  XPM|  HD  |  TD  |       RANK|\n`
  table = `${table}| RADIANT ---${(match_info.winner === 'Radiant' ? 'Winner' : 'Loser-').padEnd(107 - dif, '-')}|\n`
  table = `${table}${player_str_radiant}`
  table = `${table}| DIRE ------${(match_info.winner === 'Radiant' ? 'Loser' : 'Winner').padEnd(107 - dif, '-')}|\n`
  table = `${table}${player_str_dire}`
  table = table + "```"
  return table
}

const format_field = (word, chars, alignRight = true) => {
  if (word.length > chars)
    return `${ word.toString().substr(0, chars - 3) }...`
  return word.toString()[alignRight ? 'padStart' : 'padEnd'](chars, ' ')
}

const max_length = (players, field) => Math.max.apply(this, players.map(p => (p[field] || '').length))

