const { MATCHES_TABLE, cli_args, init_aws, scan_db } = require('./utils')

const m = async _ => {
  const argv = cli_args(['newAccount', 'oldAccount'])
  init_aws()
  let matches = (await global.db.query({
    TableName: MATCHES_TABLE,
    KeyConditionExpression: 'account = :a',
    ExpressionAttributeValues: { ':a': argv.oldAccount }
  }).promise()).Items
  console.log(`Updating ${ matches.length } matches played by ${ argv.oldAccount }...`)
  for (let m of matches) {
    await global.db.put({
      TableName: MATCHES_TABLE,
      Item: { ...m, account: argv.newAccount }
    }).promise()
    await global.db.delete({
      TableName: MATCHES_TABLE,
      Key: {
        account: m.account,
        timestamp: m.timestamp
      }
    }).promise()
  }
  console.log(`Updating played with...`)
  await scan_db({
    ProjectionExpression: 'account, #timestamp, played_with',
    FilterExpression: 'contains(played_with, :a)',
    ExpressionAttributeValues: { ':a': argv.oldAccount },
    ExpressionAttributeNames: { '#timestamp': 'timestamp' }
  }, m => {
    return global.db.update({
      TableName: MATCHES_TABLE,
      Key: {
        account: m.account,
        timestamp: m.timestamp
      },
      UpdateExpression: 'SET played_with = :a',
      ExpressionAttributeValues: { ':a': [argv.newAccount, ...m.played_with.filter(a => a !== argv.oldAccount)] }
    }).promise()
  })
}

m()