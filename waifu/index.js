require('log-prefix')('[Waifubot]')
const Discord = require('discord.js')
const axios = require('axios')
const { WAIFU_DISCORD_TOKEN, INFURA_PROJECT_ID } = require('./env')
const UniswapWaifu = require('./UniswapWaifu.json')
const Web3 = require('web3')
const BigNumber = require('bignumber.js')

const CONTRACT_ADDRESS = '0xb27c012b36e79decb305fd1e512ba90eb035a6fa'

global.client = new Discord.Client()

const set_price = async contract => {
  console.log('Fetching price')
  const [coingecko_result, contract_result] = await Promise.all([
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=waifu-token&vs_currencies=usd&include_24hr_change=true'),
    contract.methods.getReserves().call()
  ])
  const usd_price = coingecko_result.data['waifu-token'].usd,
        change_24h = coingecko_result.data['waifu-token'].usd_24h_change,
        waif_supply = new BigNumber(contract_result._reserve0),
        eth_supply = new BigNumber(contract_result._reserve1),
        uniswap_price = eth_supply.div(waif_supply)

  global.client.guilds.forEach(guild => {
    guild.members.get(global.client.user.id).setNickname(`$${ usd_price } (${ Math.sign(change_24h) }${ Math.abs(change_24h / 100).toFixed(1) }%)`)
  })
  global.client.user.setActivity(`${ uniswap_price.toFixed(8) } ETH`, { type: 'WATCHING' })
}

const m = async _ => {
  const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${ INFURA_PROJECT_ID }`)),
        contract = new web3.eth.Contract(UniswapWaifu, CONTRACT_ADDRESS)

  global.client.on('ready', () => {
    console.log(`Logged in as ${ global.client.user.tag }!`)
    setInterval(_ => set_price(contract), 60000)
    set_price(contract)
  })
  global.client.login(WAIFU_DISCORD_TOKEN)
}

m()