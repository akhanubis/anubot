exports.saveMatch = async match => {
  let id = await exports.nextId()
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
  console.log(`[Dev] Deleting match by message id ${ id }`)
  return Promise.resolve([{ timestamp: new Date().toISOString(), match_id: 6, message_id: 123456 }])
}