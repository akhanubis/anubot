const Discord = require('discord.js')
const { DISCORD_TOKEN } = require('./env')
const { initAWS } = require('./startup')
const { populateLastSr } = require('./db')
const matchMatcher = require('./match')
const roboMatcher = require('./robo')

const MATCHERS = [
  matchMatcher,
  roboMatcher
]

global.last_recorded_sr = {}

const m = async _ => {
  initAWS()
  await populateLastSr(last_recorded_sr)
  console.log(`Last recorded SR: ${ Object.entries(last_recorded_sr).map(([a, b]) => `${ a }: ${ b }`) }`)

  const client = new Discord.Client()

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
  })
  client.on('message', msg => {
    for (let m of MATCHERS)
      if (msg.content.match(m.regex)) {
        try {
          m.process(msg)
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