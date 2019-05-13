const { ACCOUNTS_LIST } = require('./constants')
const { BEANSTALK, MATCHES_TABLE, MATCHES_TABLE_MATCH_ID_INDEX } = require('./env')

exports.saveMatch = async (match, overriden_id) => {
  let match_common_data = { ...match, match_id: parseInt(overriden_id || next_id()), players: undefined },
      promises = match.players.map(p => global.db.put({
        TableName: MATCHES_TABLE,
        Item: {
          ...match_common_data,
          ...p,
          played_with: match.players.filter(p2 => p2 !== p).map(p2 => p2.account)
        }
      }).promise())
  await Promise.all(promises)
  console.log(`${ match_common_data.match_id }-${ match.map } saved`)
  return match_common_data.match_id
}

exports.populateLastSr = last_sr => {
  console.log('Fetching initial latest SR data...')
  let promises = Object.values(ACCOUNTS_LIST).map(acc => global.db.query({
    TableName: MATCHES_TABLE,
    KeyConditionExpression: 'account = :a',
    ExpressionAttributeValues: { ':a': acc },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: 'account, sr.#end',
    ExpressionAttributeNames: { '#end': 'end' }
  }).promise())
  return Promise.all(promises)
  .then(responses => {
    for (let response of responses) {
      let last_match = response.Items[0]
      if (last_match)
        last_sr[last_match.account] = (last_match.sr || {}).end
    }
  })
}

exports.matchesByAccount = async (acc, since) => {
  let last_evaluated_key,
      out = [],
      params = {
        TableName: MATCHES_TABLE,
        KeyConditionExpression: `account = :a`,
        ExpressionAttributeValues: { ':a': acc }
      }
  if (since) {
    params.KeyConditionExpression += ' AND #timestamp >= :t'
    params.ExpressionAttributeValues[':t'] = since
    params.ExpressionAttributeNames = { '#timestamp': 'timestamp' }
  }
  while(true) {
    params.ExclusiveStartKey = last_evaluated_key
    data = await global.db.query(params).promise()
    last_evaluated_key = data.LastEvaluatedKey
    out = [...out, ...data.Items]
    if (!last_evaluated_key)
      break
  }
  return out
}

exports.deleteMatchById = async id => {
  let existing = (await global.db.query({
    TableName: MATCHES_TABLE,
    IndexName: MATCHES_TABLE_MATCH_ID_INDEX,
    KeyConditionExpression: 'match_id = :m',
    ExpressionAttributeValues: { ':m': parseInt(id) }
  }).promise()).Items
  if (!existing.length)
    throw('No match found')
  await Promise.all(existing.map(entry => global.db.delete({
      TableName: MATCHES_TABLE,
      Key: {
        account: entry.account,
        timestamp: entry.timestamp
      }
    }).promise()))
  return existing
}

exports.populateLastId = async _ => {
  console.log('Fetching initial latest match_id...')
  let promises = Object.values(ACCOUNTS_LIST).map(acc => global.db.query({
    TableName: MATCHES_TABLE,
    KeyConditionExpression: 'account = :a',
    ExpressionAttributeValues: { ':a': acc },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: 'match_id'
  }).promise())
  let responses = await Promise.all(promises)
  console.log(responses.map(r => (r.Items[0] || {}).match_id))
  global.last_id = Math.max.apply(this, responses.map(r => (r.Items[0] || {}).match_id || 0))
}

const next_id = _ => ++global.last_id

if (!BEANSTALK) {
  let mock = require('./dbDev')
  for (let m in mock)
    exports[m] = mock[m]
}