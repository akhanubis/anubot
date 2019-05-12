const moment = require('moment')
const { pickRandom, replaceText } = require('../utils')


const
  REGEX = /^-p(lay)? (.+)/i,
  REPLIES = [
    'ugh, why u do this %AUTHOR%?',
    //'this is my jam!',
    'please no, not %ARTIST% again'
  ],
  NAME = 'Music',
  COMMAND_CD_IN_S = 1800,
  ARTISTS = ['kanye']

let last_time_run = null

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  if (not_in_cooldown()) {
    let song = msg.content.match(REGEX)[2],
        artist = ARTISTS.find(a => song.split(' ').map(b => b.toLowerCase()).includes(a))
    if (artist) {
      last_time_run = moment.utc()
      let content = replaceText(pickRandom(REPLIES), {
        ARTIST: artist,
        AUTHOR: msg.author.username
      })
      msg.channel.send(content)
    }
  }
}

const not_in_cooldown = _ => !last_time_run || moment.utc().diff(last_time_run, 'seconds') > COMMAND_CD_IN_S