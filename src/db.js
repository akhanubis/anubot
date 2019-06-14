const { ACCOUNTS_LIST } = require('./constants')
const { BEANSTALK, MATCHES_TABLE, MATCHES_TABLE_MATCH_ID_INDEX, TAGS_TABLE, TAGS_TABLE_SCANNABLE_INDEX, TAGS_TABLE_GUILD_TAG_ID_INDEX, TODOS_TABLE, TODOS_TABLE_USER_ID_INDEX } = require('./env')

const TODO_MAX_ENTRIES = 15

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

exports.populateLastSr = _ => {
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
        global.last_recorded_sr[last_match.account] = (last_match.sr || {}).end
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
  return out.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
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
  global.last_id = Math.max.apply(this, responses.map(r => (r.Items[0] || {}).match_id || 0))
}

exports.populateLastTagId = async _ => {
  console.log('Fetching initial latest tag_id...')
  let latest_entry = (await global.db.query({
    TableName: TAGS_TABLE,
    IndexName: TAGS_TABLE_SCANNABLE_INDEX,
    KeyConditionExpression: 'scannable = :t',
    ExpressionAttributeValues: { ':t': 't' },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: 'tag_id'
  }).promise()).Items[0] || {}
  global.last_tag_id = latest_entry.tag_id || 0
}

exports.getTags = async (guild, tags) => {
  let promises = tags.map(t => global.db.query({
        TableName: TAGS_TABLE,
        KeyConditionExpression: 'guild_tag = :t',
        ExpressionAttributeValues: { ':t': guild_preffix(guild, t) },
        ProjectionExpression: '#url, tag_id, attachable',
        ExpressionAttributeNames: { '#url': 'url' }
      }).promise()),
      records_per_tag = (await Promise.all(promises)).map(result => result.Items),
      occurrences = {},
      url_to_record = {}
  for (let records of records_per_tag)
    for (let r of records) {
      url_to_record[r.url] = r
      occurrences[r.url] = (occurrences[r.url] || 0) + 1
    }
  /* return records that match all the tags */
  return Object.keys(occurrences).filter(url => occurrences[url] === records_per_tag.length).map(url => url_to_record[url])
}

exports.saveTags = async (guild, author, tags, medias) => {
  let new_ids = []
  for (let m of medias) {
    let tag_id = next_tag_id(),
        timestamp = new Date().toISOString(),
        promises = tags.map(t => global.db.put({
          TableName: TAGS_TABLE,
          Item: {
            guild_tag: guild_preffix(guild, t),
            tag: t,
            guild_tag_id: guild_preffix(guild, tag_id),
            tag_id: tag_id,
            timestamp: timestamp,
            url: m.url,
            attachable: m.attachable,
            scannable: 't',
            scannable_timestamp: timestamp,
            tagged_by: author.id
          }
        }).promise())
    await Promise.all(promises)
    new_ids.push(tag_id)
  }
  return new_ids
}

exports.deleteTagById = async (guild, id) => {
  let existing = (await global.db.query({
    TableName: TAGS_TABLE,
    IndexName: TAGS_TABLE_GUILD_TAG_ID_INDEX,
    KeyConditionExpression: 'guild_tag_id = :n',
    ExpressionAttributeValues: { ':n': guild_preffix(guild, id) }
  }).promise()).Items
  if (!existing.length)
    throw('No tag found')
  await Promise.all(existing.map(entry => global.db.delete({
      TableName: TAGS_TABLE,
      Key: {
        guild_tag: entry.guild_tag,
        timestamp: entry.timestamp
      }
    }).promise()))
  return existing
}

exports.saveTodo = (user, task) => {
  let ts = new Date().toISOString()
  return global.db.put({
    TableName: TODOS_TABLE,
    Item: {
      task_id: task_id(user, task),
      timestamp: ts,
      task: task,
      user_id: user.id,
      list_timestamp: ts
    }
  }).promise()
}

exports.doTodo = async (user, task) => {
  let matching_tasks = (await global.db.query({
    TableName: TODOS_TABLE,
    KeyConditionExpression: 'task_id = :t',
    ExpressionAttributeValues: { ':t': task_id(user, task) },
    FilterExpression: 'attribute_not_exists(done)',
    ProjectionExpression: 'task_id, #timestamp',
    ExpressionAttributeNames: { '#timestamp': 'timestamp' }
  }).promise()).Items
  await Promise.all(matching_tasks.map(t => global.db.update({
    TableName: TODOS_TABLE,
    Key: t,
    UpdateExpression: 'SET done = :t',
    ExpressionAttributeValues: { ':t': true }
  }).promise()))
}

exports.listTodo = async user => {
  return (await global.db.query({
    TableName: TODOS_TABLE,
    IndexName: TODOS_TABLE_USER_ID_INDEX,
    KeyConditionExpression: 'user_id = :u',
    ExpressionAttributeValues: { ':u': user.id },
    Limit: TODO_MAX_ENTRIES,
    ScanIndexForward: false
  }).promise()).Items.reverse()
}

const next_id = _ => ++global.last_id

const next_tag_id = _ => ++global.last_tag_id

const task_id = (user, task) => `${ user.id }__${ task.substr(0, 100) }`

const guild_preffix = (guild, value) => `${ guild.id }__${ value }`

if (!BEANSTALK) {
  let mock = require('./dbDev')
  for (let m in mock)
    exports[m] = mock[m]
}