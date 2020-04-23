const moment = require('moment')
const { ACTIVITIES, WAIT_BEFORE_DESTROY_IN_S } = require('./constants')

exports.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

exports.shuffle = arr => {
  let j, x, i
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = arr[i]
    arr[i] = arr[j]
    arr[j] = x
  }
  return arr
}

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

const REPLACEMENTS = [
  [/&quot;/g, '"'],
  [/&#34;/g, '"'],
  [/&amp;/g, '&'],
  [/&#38;/g, '&'],
  [/&apos;/g, "'"],
  [/&#39;/g, "'"],
  [/&#x2019;/g, "'"],
  [/&lt;/g, '<'],
  [/&#60;/g, '<'],
  [/&gt;/g, '>'],
  [/&#62;/g, '>'],
  [/&#x2013;/g, '–'],
  [/&#xF1;/g, 'ñ'],
  [/&#xBF;/g, '¿'],
  [/&#xA1;/g, '¡'],
  [/&#xE1;/g, 'á'],
  [/&#xE9;/g, 'é'],
  [/&#xED;/g, 'í'],
  [/&#xF3;/g, 'ó'],
  [/&#xFA;/g, 'ú'],
]
exports.htmlUnescape = text => REPLACEMENTS.reduce((out, [regex, replacement]) => out.replace(regex, replacement), text)