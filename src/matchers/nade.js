const { getNades } = require('../db')

const
  REGEX = /^\!nade\s+([\s\S]+)$/i,
  NAME = 'Nade'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let tags = msg.content.match(REGEX)[1].split(',').map(t => t.trim()).filter(t => t),
      nades = await getNades(tags)
  for (let n of nades)
    if (n.attachable)
      await msg.channel.send(`#${ n.nade_id }`, { files: [n.url] })
    else
      await msg.channel.send(`#${ n.nade_id } ${ n.url }`)
}