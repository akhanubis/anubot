const Discord = require('discord.js')
const { DISCORD_TOKEN, ACTIVITY_REFRESH_INTERVAL_IN_S, ALLOWED_SERVERS, ALLOWED_DM_USERS } = require('./env')
const { initAWS, initGoogle, initSpotify } = require('./startup')
const { populateLastSr, populateLastId, populateLastTagId } = require('./db')
const { setActivity, emoji } = require('./utils')
const { ERROR_EMOJI, SUCCESS_EMOJI } = require('./constants')
const { setupMonitoring } = require('./monitor.js')

const MATCHERS = [
  'match',
  'github',
  'stats',
  'music',
  'matchDelete',
  'matchReplace',
  'help',
  'constant',
  'translateLast',
  'translate',
  'lacqua',
  'poll',
  'tagGet',
  'tagSave',
  'tagDelete',
  'todo',
  'todoDone',
  'channelMessage',
  'jajaja',
  'music/play',
  'music/next',
  'music/stop',
  'music/join',
  'music/leave',
  'music/volume',
  'music/pause',
  'music/resume',
  'music/lyrics',
  'music/sound'
].map(f => require(`./matchers/${ f }`))

global.last_recorded_sr = {}
global.client = new Discord.Client()
const m = async _ => {
  initAWS()
  initGoogle()
  initSpotify()
  await Promise.all([populateLastSr(), populateLastId(), populateLastTagId()])
  console.log(`Last recorded SR: ${ Object.entries(global.last_recorded_sr).map(([a, b]) => `${ a }: ${ b }`).join(', ') }`)
  console.log(`Last recorded match_id: ${ global.last_id }`)
  console.log(`Last recorded tag_id: ${ global.last_tag_id }`)

  global.client.on('ready', () => {
    console.log(`Logged in as ${ global.client.user.tag }!`)
    setInterval(setActivity, ACTIVITY_REFRESH_INTERVAL_IN_S * 1000)
    setActivity()
  })
  global.client.on('message', async msg => {
    /*
    if bot
    or dm from unwanted person
    or message from unwanted server 
    */
    if (msg.author.bot || (msg.channel.type === 'dm' && !ALLOWED_DM_USERS.includes(msg.author.id)) || (msg.channel.type === 'text' && !ALLOWED_SERVERS.includes(msg.channel.guild.id)))
      return
    for (let m of MATCHERS)
      if (msg.content.match(m.regex)) {
        console.log(`Processing message with ${ m.name }`)
        try {
          await m.process(msg)
          if (!m.skip_reaction)
            msg.react(emoji(SUCCESS_EMOJI))
        }
        catch(e) {
          console.log('Error processing message')
          console.log(e)
          msg.react(emoji(ERROR_EMOJI))
        }
        break
      }
  })
  setupMonitoring()
  global.client.login(DISCORD_TOKEN)
}

m()