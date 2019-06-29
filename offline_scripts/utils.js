const dotenv = require('dotenv')
const AWS = require('aws-sdk')
const argv = require('yargs').argv
const fs = require('fs')

dotenv.config({ path: argv.envFile || '.env' })

const
    MATCHES_TABLE = process.env.MATCHES_TABLE

const log = a => console.log(a)

const init_aws = _ => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })
    global.db = new AWS.DynamoDB.DocumentClient()
}

const cli_args = required_args => {
    let args = {}
    for (let arg_name of required_args) {
        if (argv[arg_name] === null || argv[arg_name] === undefined)
            throw new Error(`Missing argument ${ arg_name }`)
        args[arg_name] = argv[arg_name]
    }
    return args
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

const read_csv = (file_name, attr_indexes, lines_to_skip) => {
    let entries = fs.readFileSync(file_name).toString().split("\r\n")
    entries = entries.slice(lines_to_skip || 0)
    return entries.map(e => {
        let obj = {}, fields = e.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(f => f.replace(/(^"|"$)/g, '').replace(/\\"/g, '"'))
        for (let attr in attr_indexes)
            obj[attr] = fields[attr_indexes[attr]]
        return obj
    })
}

const write_csv = (file_name, data, attrs) => {
    let csv_string = attrs.map(a => a.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(',')
    csv_string += "\r\n"
    csv_string += data.map(d => attrs.map(a => (d[a] || '').toString().match(',') ? `"${ d[a] }"`: d[a]).join(',')).join("\r\n")
    fs.writeFileSync(file_name, csv_string)
}

const append_csv = (file_name, element, attrs) => {
    let csv_string = `${ attrs.map(a => element[a]).join(',') }\r\n`
    fs.appendFileSync(file_name, csv_string)
}

const walk_dir = dir => {
    let results = [],
        list = fs.readdirSync(dir)
    list.forEach(file => {
        file = dir + '/' + file
        let stat = fs.statSync(file)
        if (stat && stat.isDirectory())
            results = results.concat(walk(file))
        else 
            results.push(file)
    })
    return results
}

const scan_db = async (db_params, callback) => {
    let last_evaluated_key, data
    if (!db_params.TableName)
        db_params.TableName = MATCHES_TABLE
    while(true) {
        db_params.ExclusiveStartKey = last_evaluated_key
        data = await global.db.scan(db_params).promise()
        last_evaluated_key = data.LastEvaluatedKey
        for (let item of data.Items)
            await callback(item)
        if (!last_evaluated_key)
            break
    }
    return Promise.resolve()
}

module.exports = {
    log: log,
    init_aws: init_aws,
    cli_args: cli_args,
    sleep: sleep,
    read_csv: read_csv,
    write_csv: write_csv,
    append_csv: append_csv,
    walk_dir: walk_dir,
    scan_db: scan_db,
    MATCHES_TABLE: MATCHES_TABLE
}