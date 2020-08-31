require('log-prefix')('[Sushibot]')
const Discord = require('discord.js')
const axios = require('axios')
const { SUSHI_DISCORD_TOKEN, INFURA_PROJECT_ID } = require('./env')
const BigNumber = require('bignumber.js')

const CONTRACT_ADDRESS = '0xce84867c3c02b05dc570d0135103d3fb9cc19433'

const PRICE_PRECISION = 100000

global.client = new Discord.Client()

const set_price = async _ => {
  console.log('Fetching price')
  const [coingecko_result, contract_result] = await Promise.all([
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=sushi&vs_currencies=usd&include_24hr_change=true'),
    axios.post(`https://mainnet.infura.io/v3/${ INFURA_PROJECT_ID }`, {
      "jsonrpc":"2.0",
      "method":"eth_call",
      "params": [{"to": CONTRACT_ADDRESS,"data": "0x0902f1ac" }, "latest"], /* data taken from contract.methods.getReserves().encodeABI() */
      "id":1
    }) 
  ])
  const usd_price = coingecko_result.data['sushi'].usd,
        change_24h = coingecko_result.data['sushi'].usd_24h_change,
        sushi_supply = new BigNumber(`0x${ contract_result.data.result.substr(2, 64) }`, 16).times(Math.pow(10, -18)),
        eth_supply = new BigNumber(`0x${ contract_result.data.result.substr(66, 64) }`, 16).times(Math.pow(10, -18)),
        uniswap_price = eth_supply.div(sushi_supply)

  global.client.guilds.forEach(guild => {
    guild.members.get(global.client.user.id).setNickname(`$${ Math.round(usd_price * PRICE_PRECISION) / PRICE_PRECISION } (${ change_24h >= 0 ? '+' : '' }${ change_24h.toFixed(1) }%)`)
  })
  global.client.user.setActivity(`${ uniswap_price.toFixed(8) } ETH`, { type: 'WATCHING' })
}

const m = async _ => {
  let timeout

  global.client.on('ready', () => {
    console.log(`Logged in as ${ global.client.user.tag }!`)
    clearInterval(timeout)
    timeout = setInterval(set_price, 60000)
    set_price()
  })
  global.client.login(SUSHI_DISCORD_TOKEN)
}

m()