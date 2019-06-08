const { doTodo } = require('../db')
const { showList } = require('../todoUtils')

const
  REGEX = /^\!done\s+([^\n]+)$/i,
  NAME = 'Todo Done'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let task = msg.content.match(REGEX)[1].trim()
  await doTodo(msg.author, task)
  await showList(msg)
}