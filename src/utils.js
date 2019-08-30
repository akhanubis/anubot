const moment = require('moment')
const { ACTIVITIES, WAIT_BEFORE_DESTROY_IN_S } = require('./constants')

exports.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

exports.emoji = name =>  global.client.emojis.get(name) || global.client.emojis.find(e => e.name === name) || name

exports.setActivity = () => global.client.user.setActivity(...exports.pickRandom(ACTIVITIES))

exports.percentage = n => (Math.round(10000 * n) / 100).toFixed(2)

exports.float = (n, decimal_places = 2) => (Math.round(n * Math.pow(10, decimal_places)) / Math.pow(10, decimal_places)).toFixed(2)

exports.win = m => m.result === 'W'

exports.loss = m => m.result === 'L'

exports.draw = m => m.result === 'D'

exports.humanizedResult = m => exports.win(m) ? 'win' : exports.draw(m) ? 'draw' : 'loss'

exports.delayedDelete = m => {
  if (m.channel.type !== 'dm')
    setTimeout(() => m.delete(), WAIT_BEFORE_DESTROY_IN_S * 1000)
}

exports.replaceText = (text, replacements) => Object.entries(replacements).reduce((replaced, [k, v]) => replaced.replace(`%${ k }%`, v), text)

exports.previousMessages = (msg, limit = 10) => msg.channel.messages.fetch({ limit: limit, before: msg.id }).then(a => exports.toArray(a))

exports.latestMessages = (channel, limit = 10) => channel.messages.fetch({ limit: limit }).then(a => exports.toArray(a))

exports.onCooldown = (last_time_run, cd_in_seconds) => last_time_run && moment.utc().diff(last_time_run, 'seconds') < cd_in_seconds

exports.now = _ => moment.utc()

exports.getAttachments = msg => exports.toArray(msg.attachments || { values: [] })

exports.toArray = col => [...col.values()]

exports.htmlUnescape = text => text
  .replace(/&quot;/g, '"').replace(/&#34;/g, '"')
  .replace(/&amp;/g, '&').replace(/&#38;/g, '&')
  .replace(/&apos;/g, "'").replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&#60;/g, "<")
  .replace(/&gt;/g, ">").replace(/&#62;/g, ">")