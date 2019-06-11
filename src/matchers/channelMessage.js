const { ADMIN_USER } = require('../env')

const
  REGEX = /^!admin_dm (\d+) ([\s\S]+)$/i,
  NAME = 'Admin DM'

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  if (msg.author.id !== `${ ADMIN_USER }`)
    return
  let [_, user_id, content] = msg.content.match(REGEX),
      user = await msg.client.fetchUser(user_id)
  user.send(content)
}