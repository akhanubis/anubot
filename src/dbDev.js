exports.saveMatch = async match => {
  let id = ++global.last_id
  console.log(`[Dev] Storing ${ id }-${ match.map }`)
  return id
}

exports.populateLastSr = _ => {
  console.log('[Dev] Populating last SR')
  return Promise.resolve()
}

exports.populateLastId = _ => {
  console.log('[Dev] Populating last match_id')
  global.last_id = 10
  return Promise.resolve()
}

exports.deleteMatchById = id => {
  console.log(`[Dev] Deleting match by id ${ id }`)
  return Promise.resolve([{ timestamp: new Date().toISOString(), match_id: 6, message_id: 123456 }])
}

exports.saveTags = async (guild, tags, medias) => {
  console.log(`[Dev] Storing tags ${ tags.join(', ') } for guild ${ guild.id }`)
  return medias.map(_ => Math.floor(Math.random() * 1000000))
}

exports.populateLastTagId = _ => {
  console.log('[Dev] Populating last tag_id')
  global.last_tag_id = 30
  return Promise.resolve()
}

exports.deleteTagById = (guild, id) => {
  console.log(`[Dev] Deleting tag by id ${ id } for guild ${ guild.id }`)
  return Promise.resolve([{ timestamp: new Date().toISOString(), tag_id: id }])
}

exports.saveTodo = (user, task) => console.log(`[Dev] Saving TODO task ${ task } for ${ user.username }`)

exports.doTodo = (user, task) => console.log(`[Dev] Marking TODO task ${ task } for ${ user.username } as done`)

exports.listTodo = _ => {
  console.log('[Dev] Returning TODO list')
  return [
    {
      task: 'clean my desk',
      done: true
    },
    {
      task: 'take a shower'
    },
    {
      task: 'a done task',
      done: true
    }
  ]
}