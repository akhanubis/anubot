const { saveTodo } = require('../db')
const { showList } = require('../todoUtils')

const
  REGEX = /^\!todo(\s+([^\n]+))?$/i,
  NAME = 'Todo'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let task = (msg.content.match(REGEX)[2] || '').trim()
  if (task)
    await saveTodo(msg.author, task)
  await showList(msg)
}