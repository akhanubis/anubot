const { ACTIVITIES, WAIT_BEFORE_DESTROY_IN_S } = require('./constants')

exports.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

exports.emoji = name =>  global.client.emojis.get(name) || global.client.emojis.find(e => e.name === name) || name

exports.setActivity = () => global.client.user.setActivity(...exports.pickRandom(ACTIVITIES))

exports.percentage = n => (Math.round(10000 * n) / 100).toFixed(2)

exports.win = m => m.result === 'W'

exports.loss = m => m.result === 'L'

exports.draw = m => m.result === 'D'

exports.humanizedResult = m => exports.win(m) ? 'win' : exports.draw(m) ? 'draw' : 'loss'

exports.delayedDelete = m => setTimeout(() => m.delete(), WAIT_BEFORE_DESTROY_IN_S * 1000)

exports.replaceText = (text, replacements) => Object.entries(replacements).reduce((replaced, [k, v]) => replaced.replace(`%${ k }%`, v), text)

exports.previousMessage = msg => msg.channel.fetchMessages({ limit: 1, before: msg.id }).then(collection => collection.first())