const { doTodo } = require('../db')
const { showList, activeTasks } = require('../todoUtils')

const
  REGEX = /^\!done\s+([^\n]+)$/i,
  NAME = 'Todo Done'

exports.name = NAME

exports.regex = REGEX 

exports.process = async msg => {
  let task = msg.content.match(REGEX)[1].trim()
  if (task.match(/\d+/)) {
    const tasks = await activeTasks(msg.author),
          task_by_index = tasks[parseInt(task) - 1]
    if (task_by_index)
      task = task_by_index.task_id.match(/^\d+__(.+)$/)[1]
  }
  await doTodo(msg.author, task)
  await showList(msg)
}