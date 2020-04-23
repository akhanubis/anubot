const { listTodo } = require('./db')
const { replaceText, emoji } = require('./utils')

const
  REPLY = `
TO DO:
%LIST%
`

exports.activeTasks = async user => {
  const tasks = await listTodo(user)
  tasks.sort((a, b) => {
    if (!!a.done === !!b.done)
      return a.timestamp.localeCompare(b.timestamp)
    return a.done ? -1 : 1
  })
  return tasks
}

exports.showList = async msg => {
  let tasks = await exports.activeTasks(msg.author),
      output = []
  if (tasks.length)
    output = [replaceText(REPLY, {
      LIST: tasks.map((t, i) => `${ i + 1 }. ${ strike_markdown(t) }${ t.task }${ strike_markdown(t) }`).join("\n")
    })]
  if (!tasks.filter(t => !t.done).length)
    output = [...output, `You dont have anything to do! ${ emoji('pat') }`]
  await msg.channel.send(output.join("\n"))
}

const strike_markdown = task => task.done ? '~~' : ''
