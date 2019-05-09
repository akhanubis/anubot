const { ACTIVITIES, EMOJIS } = require('./constants')

exports.pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

exports.emoji = name => EMOJIS[name] || global.client.emojis.find(e => e.name === name) || name

exports.setActivity = () => global.client.user.setActivity(...exports.pickRandom(ACTIVITIES))

exports.percentage = n => (Math.round(10000 * n) / 100).toFixed(2)