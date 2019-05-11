const { PUBLIC_CONSTANTS } = require('../constants')

const
  REGEX = /^\!constant\s+([a-z]+)/i,
  NAME = 'Constant'

exports.name = NAME

exports.regex = REGEX

exports.process = msg => {
  let [_, constant] = msg.content.match(REGEX),
      matching_constant = PUBLIC_CONSTANTS[constant.toLowerCase()]
  if (matching_constant) {
    let no_dups = {}
    for (let c in matching_constant) {
      no_dups[matching_constant[c]] = no_dups[matching_constant[c]] || []
      no_dups[matching_constant[c]].push(c)
    }
    let reply = Object.entries(no_dups).sort((a, b) => a[0].localeCompare(b[0])).map(([name, aliases]) => `${ name }: ${ aliases.join(', ') }`).join("\n")
    msg.channel.send(reply)
  }
  else
    msg.channel.send(`No constant found for ${ constant }`)
}