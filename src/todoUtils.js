const { listTodo } = require('./db')
const { replaceText } = require('./utils')

const
  REPLY = `
TODO:
%LIST%
`,
  NO_TASKS_REPLY = 'You dont have anything to do! Pat pat pat'

exports.showList = async msg => {
  let tasks = await listTodo(msg.author)
  if (tasks.length)
    msg.channel.send(replaceText(REPLY, {
      LIST: tasks.map(t => `${ strike_markdown(t) }${ t.task }${ strike_markdown(t) }`).join("\n")
    }))
  else
    msg.channel.send(NO_TASKS_REPLY)
}

const strike_markdown = task => task.done ? '~~' : ''