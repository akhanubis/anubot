const { listTodo } = require('./db')
const { replaceText, emoji } = require('./utils')

const
  REPLY = `
TO DO:
%LIST%
`

exports.showList = async msg => {
  let tasks = await listTodo(msg.author)
  if (tasks.length)
    await msg.channel.send(replaceText(REPLY, {
      LIST: tasks.sort((a, b) => {
        if (!!a.done === !!b.done)
          return a.timestamp.localeCompare(b.timestamp)
        return a.done ? -1 : 1
      }).map(t => `${ strike_markdown(t) }${ t.task }${ strike_markdown(t) }`).join("\n")
    }))
  if (!tasks.filter(t => !t.done).length)
    msg.channel.send(`You dont have anything to do! ${ emoji('pat') }`)
}

const strike_markdown = task => task.done ? '~~' : ''
