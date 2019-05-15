const Discord = require('discord.js')
const { DISCORD_TOKEN, ACTIVITY_REFRESH_INTERVAL_IN_S, ALLOWED_SERVERS } = require('./env')
const { initAWS, initGoogle } = require('./startup')
const { populateLastSr, populateLastId } = require('./db')
const { setActivity, emoji } = require('./utils')
const { ERROR_EMOJI, SUCCESS_EMOJI } = require('./constants')

const MATCHERS = [
  'match',
  'github',
  'stats',
  'music',
  'matchDelete',
  'matchReplace',
  'help',
  'constant',
  'translate',
  'translateLast'
].map(f => require(`./matchers/${ f }`))

global.last_recorded_sr = {}
global.client = new Discord.Client()
const m = async _ => {
  initAWS()
  initGoogle()
  await Promise.all([populateLastSr(last_recorded_sr), populateLastId()])
  console.log(`Last recorded SR: ${ Object.entries(last_recorded_sr).map(([a, b]) => `${ a }: ${ b }`) }`)

  global.client.on('ready', () => {
    console.log(`Logged in as ${ global.client.user.tag }!`)
    setInterval(setActivity, ACTIVITY_REFRESH_INTERVAL_IN_S * 1000)
    setActivity()
  })
  global.client.on('message', async msg => {
    if (!ALLOWED_SERVERS.includes(msg.channel.guild.id) || msg.author.bot)
      return
    for (let m of MATCHERS)
      if (msg.content.match(m.regex)) {
        console.log(`Processing message with ${ m.name }`)
        try {
          await m.process(msg)
          msg.react(emoji(SUCCESS_EMOJI))
        }
        catch(e) {
          console.log('Error processing message')
          console.log(e)
          msg.react(emoji(ERROR_EMOJI))
        }
      }
  })
  global.client.login(DISCORD_TOKEN)
}

m()