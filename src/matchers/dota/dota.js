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
    const text_channel = msg.channel,
          guild_id = text_channel.guild.id,
          entity_type = (msg.content.match(REGEX)[2] || '').trim()
          parse_id = (msg.content.match(REGEX)[3] || '').trim()          
      switch (entity_type) {
        case 'match':
          axios.get(` ${URL}/matches/${parse_id}`)
            .then(function (response) {
              console.log(response)
              if(response.data.version) {
                let match_info = {}
                match_info.duration = parse_match_duration(response.data.duration)
                match_info.game_mode = GAME_MODE[response.data.game_mode]
                match_info.dire_score = response.data.dire_score
                match_info.radiant_score = response.data.radiant_score
                match_info.winner = (response.data.radiant_win) ? 'Radiant' : 'Dire'
                match_info.lobby_type = LOBBY_TYPES[response.data.lobby_type]
                match_info.skill = (response.data.skill) ? SKILL_LEVEL[response.data.skill] : 'Unknown'
                let players = []  
                response.data.players.map(x => {
                  let player = {}
                  player.personaname = x.personaname ? x.personaname.replace(/[^a-zA-Z0-9 ]/g, "") : 'anonymous'
                  player.last_hits = x.lh_t[10]
                  player.denies = x.dn_t[10]
                  player.assists = x.assists
                  player.deaths = x.deaths
                  player.kills = x.kills
                  player.level = x.level
                  player.total_exp = x.total_xp
                  player.xp_per_min = x.xp_per_min
                  player.total_gold = x.total_gold
                  player.gold_per_min = x.gold_per_min
                  player.eff = parseFloat(x.lane_efficiency).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
                  player.rank_tier = x.rank_tier ? parse_tier(x.rank_tier) : 'Unknown'
                  player.lane_role = LANE_ROLE[x.lane_role]
                  player.hero_damage = x.hero_damage
                  player.tower_damage = x.tower_damage
                  player.heroe = DOTA_HEROES_LIST[x.hero_id]
                  player.isRadiant = x.isRadiant
                  players.push(player)
                })
                let final_table = parse_table(players, match_info)
                text_channel.send(final_table)
                return
              }       
              text_channel.send(`match ${parse_id} its not parsed`)
            })
            .catch(function (error) {
              console.log(error);
              if(error.response.status == 404)
                text_channel.send(`match ${parse_id} not found`)
            })
          break
        default:
          text_channel.send(`Missing parse ${ emoji('pepothink') }`)
          return
          break
      }
    }

    const parse_tier = rank_tier => { 
      let splited_rank = rank_tier && rank_tier.toString().split('')
      return DOTA_LEAGUE_RANKS[splited_rank[0]] + `[${splited_rank[1]}]`
    }

    const parse_match_duration = seconds => { 
      let duration = moment.utc(seconds*1000)
      return (seconds >= 3600) ? duration.format("hh:mm:ss") : duration.format("mm:ss")
    }

    const parse_table = (players, match_info) => {
      let player_str_dire = ''
      let player_str_radiant = ''

      players.map(x => {
        if(x.isRadiant) {
          player_str_radiant += `|${format_field(x.personaname,20,false)} - ${format_field(x.heroe,19)}|${format_field(x.lane_role,6)}|${format_field(x.kills,3)}|${format_field(x.deaths,3)}|${format_field(x.assists,3)}|${format_field(x.last_hits,7)}|${format_field(x.denies,7)}|${format_field(x.eff,8)}|${format_field(x.gold_per_min,5)}|${format_field(x.xp_per_min,5)}|${format_field(x.hero_damage,6)}|${format_field(x.tower_damage,6)}|${format_field(x.rank_tier,13)}|\n`
        } else {
          player_str_dire += `|${format_field(x.personaname,20,false)} - ${format_field(x.heroe,19)}|${format_field(x.lane_role,6)}|${format_field(x.kills,3)}|${format_field(x.deaths,3)}|${format_field(x.assists,3)}|${format_field(x.last_hits,7)}|${format_field(x.denies,7)}|${format_field(x.eff,8)}|${format_field(x.gold_per_min,5)}|${format_field(x.xp_per_min,5)}|${format_field(x.hero_damage,6)}|${format_field(x.tower_damage,6)}|${format_field(x.rank_tier,13)}|\n`
        }
      })
      
      let table = "```"
      table =  `${table}${match_info.radiant_score} - ${match_info.dire_score} in ${match_info.duration} - Game Mode: ${match_info.game_mode} - Lobby: ${match_info.lobby_type} -  Skill: ${match_info.skill} - Winner: ${match_info.winner} \n\n`
      table = `${table}|                                          |  Lane|  K|  D|  A| lh@10 | dn@10 | eff@10 | GPM | XPM |  HD  |  TD  |         RANK|\n`
      table = `${table}| RADIANT ---${(match_info.winner === 'Radiant' ? 'Winner' : 'Loser-').padEnd(114, '-')}|\n`
      table = table + player_str_radiant
      table = `${table}| DIRE ------${(match_info.winner === 'Radiant' ? 'Loser' : 'Winner').padEnd(114, '-')}|\n`
      table = table +player_str_dire
      table = table + "```"
      return table
    }

    const format_field = (word, chars, alignRight = true) => {
      if(word.length > chars) {
        let newField = word.toString().substr(0,chars-3) + '...'
        return newField
      } else {
        const dif = chars - word.toString().length
        return ' '.repeat(alignRight ? dif : 0) + word + ' '.repeat(alignRight ? 0 : dif)
      } 
    }