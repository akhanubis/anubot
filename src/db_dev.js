exports.saveMatch = match => {
  console.log(`[Dev] Storing ${ match.map }`)
  return Promise.resolve()
}

exports.populateLastSr = _ => {
  console.log('[Dev] Populating last SR')
  return Promise.resolve()
}

exports.deleteMatchByMessageId = id => {
  console.log(`[Dev] Deleting match by message id ${ id }`)
  return Promise.resolve()
}