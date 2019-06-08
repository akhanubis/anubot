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

exports.saveNades = async (tags, nades) => {
  console.log(`[Dev] Storing nades with tags ${ tags.join(', ') }`)
  return nades.map(_ => Math.floor(Math.random() * 1000000))
}

exports.populateLastNadeId = _ => {
  console.log('[Dev] Populating last nade_id')
  global.last_nade_id = 30
  return Promise.resolve()
}

exports.deleteNadeById = id => {
  console.log(`[Dev] Deleting nade by id ${ id }`)
  return Promise.resolve([{ timestamp: new Date().toISOString(), nade_id: id }])
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
    }
  ]
}