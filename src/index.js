const Discord = require('discord.js')
const { DISCORD_TOKEN, ACTIVITY_REFRESH_INTERVAL_IN_S, ALLOWED_SERVER } = require('./env')
const { initAWS } = require('./startup')
const { populateLastSr } = require('./db')
const { setActivity, emoji } = require('./utils')
const { ERROR_EMOJI, SUCCESS_EMOJI } = require('./constants')

const MATCHERS = [
  require('./match'),
  require('./github'),
  require('./stats'),
  require('./music'),
  require('./matchDelete')
]

global.last_recorded_sr = {}
global.client = new Discord.Client()
const m = async _ => {
  initAWS()
  await populateLastSr(last_recorded_sr)
  console.log(`Last recorded SR: ${ Object.entries(last_recorded_sr).map(([a, b]) => `${ a }: ${ b }`) }`)

  global.client.on('ready', () => {
    console.log(`Logged in as ${ global.client.user.tag }!`)
    setInterval(setActivity, ACTIVITY_REFRESH_INTERVAL_IN_S * 1000)
    setActivity()
  })
  global.client.on('message', async msg => {
    if (msg.channel.guild.id !== ALLOWED_SERVER || msg.author.bot)
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