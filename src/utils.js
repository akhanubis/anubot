const { ACTIVITIES } = require('./constants')

exports.emoji = name => global.client.emojis.find(e => e.name === name) || `*${ name }*`

exports.setActivity = () => global.client.user.setActivity(...ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)])

exports.percentage = n => (Math.round(10000 * n) / 100).toFixed(2)