/* TODO: store this in a Dynamo metadata table */

exports.WAIT_BEFORE_DESTROY_IN_S = 10

exports.DAY_TO_MS = 86400000

exports.ERROR_EMOJI = '💣'

exports.SUCCESS_EMOJI = '👌'

exports.MAPS_LIST = {
  'hanamura': 'Hanamura',
  'horizon': 'Horizon Lunar Colony',
  'horizon lunar colony': 'Horizon Lunar Colony',
  'horizon colony': 'Horizon Lunar Colony',
  'lunar colony': 'Horizon Lunar Colony',
  'paris': 'Paris',
  'anubis': 'Temple of Anubis',
  'temple of anubis': 'Temple of Anubis',
  'volskaya': 'Volskaya Industries',
  'volskaya industries': 'Volskaya Industries',
  'dorado': 'Dorado',
  'la havana': 'Havana',
  'havana': 'Havana',
  'junkertown': 'Junkertown',
  'rialto': 'Rialto',
  'route': 'Route 66',
  'route 66': 'Route 66',
  'watchpoint': 'Watchpoint: Gibraltar',
  'gibraltar': 'Watchpoint: Gibraltar',
  'watchpoint: gibraltar': 'Watchpoint: Gibraltar',
  'blizzard': 'Blizzard World',
  'blizzard world': 'Blizzard World',
  'eichenwalde': 'Eichenwalde',
  'hollywood': 'Hollywood',
  'king\'s row': 'King\'s Row',
  'numbani': 'Numbani',
  'busan': 'Busan',
  'ilios': 'Ilios',
  'lijiang': 'Lijiang Tower',
  'lijiang tower': 'Lijiang Tower',
  'nepal': 'Nepal',
  'oasis': 'Oasis'
}

exports.ACCOUNTS_LIST = {
  'rama': 'Ramanujan',
  'ramanujan': 'Ramanujan',
  'pablo': 'Pablo',
  'traianus': 'Traianus',
  'bokchoy': 'Bokchoy',
  'bok': 'Bokchoy',
  'milk': 'Milk',
  'ninjin': 'Ninjin',
  'lola': 'Lola',
  'robo': 'Robogeeker',
  'robogeeker': 'Robogeeker',
  'dwon': 'Dwon',
  'neon': 'NeonXD',
  'coyce': 'Coyce',
  'trutututu': 'Trutututu',
  'bats': 'Trutututu',
  'freestyle': 'Freestyle',
  'sorrume': 'Sorrume',
  'sorru': 'Sorrume',
  'kat': 'Kat',
  'kat!': 'Kat',
  'dinkle': 'Dinkleberg!',
  'dinkleberg!': 'Dinkleberg!',
  'goofygoober': 'GoofyGoober',
  'goofy': 'GoofyGoober',
  'goober': 'GoofyGoober',
  'speedy': 'Speedy',
  'katacola': 'Katacola',
  'kata': 'Katacola'
}

exports.PLAYERS_LIST = {
  'Pablo': ['Ramanujan', 'Pablo', 'Traianus'],
  'Ninjin': ['Bokchoy', 'Milk', 'Ninjin', 'Lola'],
  'Robo': ['Robogeeker', 'Dwon'],
  'Coyce': ['Coyce'],
  'Neon': ['NeonXD'],
  'Bats': ['Trutututu'],
  'Freestyle': ['Freestyle', 'Sorrume'],
  'Kat': ['Kat', 'Dinkleberg!', 'Speedy', 'Katacola'],
  'Goober': ['GoofyGoober']
}

exports.HEROES_LIST = {
  'ana': 'Ana',
  'ashe': 'Ashe',
  'baptiste': 'Baptiste',
  'bap': 'Baptiste',
  'bastion': 'Bastion',
  'brigitte': 'Brigitte',
  'brig': 'Brigitte',
  'dva': 'D.Va',
  'd.va': 'D.Va' ,
  'd va': 'D.Va',
  'doom': 'Doomfist',
  'doomfist': 'Doomfist',
  'genji': 'Genji',
  'hanzo': 'Hanzo',
  'junk': 'Junkrat',
  'junkrat': 'Junkrat',
  'lucio': 'Lúcio',
  'lúcio': 'Lúcio',
  'mccree': 'McCree',
  'mei': 'Mei',
  'mercy': 'Mercy',
  'moira': 'Moira',
  'orisa': 'Orisa',
  'pharah': 'Pharah',
  'reaper': 'Reaper',
  'rein': 'Reinhardt',
  'reinhardt': 'Reinhardt',
  'hog': 'Roadhog',
  'roadhog': 'Roadhog',
  'sigma': 'Sigma',
  'soldier': 'Soldier: 76',
  'soldier 76': 'Soldier: 76',
  'sombra': 'Sombra',
  'symm': 'Symmetra',
  'symmetra': 'Symmetra',
  'torb': 'Torbjörn',
  'torbjorn': 'Torbjörn',
  'tracer': 'Tracer',
  'widow': 'Widowmaker',
  'widowmaker': 'Widowmaker',
  'winston': 'Winston',
  'monkey': 'Winston',
  'hammond': 'Wrecking Ball',
  'ball': 'Wrecking Ball',
  'wrecking ball': 'Wrecking Ball',
  'zarya': 'Zarya',
  'zar': 'Zarya',
  'zen': 'Zenyatta',
  'zenyatta': 'Zenyatta'
}

exports.ACTIVITIES = [
  ['with manquito :)', {type: 'PLAYING'}],
  ['crypto go up', { type: 'WATCHING' }],
  ['crypto go down', { type: 'WATCHING' }],
  ['jinnytty', { type: 'WATCHING' }],
  ['39daph', { type: 'WATCHING' }],
  ['gorgc', { type: 'WATCHING' }],
  ['hadestown', { type: 'LISTENING' }],
  ['hades', {type: 'PLAYING'}],
  ['outer wilds', {type: 'PLAYING'}],
  ['secret hitler', {type: 'PLAYING'}]
]

exports.USER_IDS = {
  anu: '113794572236226563',
  gaben: '314530943941738506'
}

exports.LAUGH_BITS = [
  {
    bit: 'ja'
  },
  {
    bit: 'ha'
  },
  {
    bit: 'lo',
    odd: true
  }
]

exports.MAJOR_LAUGHS = [
  {
    prefix: 'LMA',
    intensifier: 'O',
    suffix: ''
  },
  {
    prefix: 'L',
    intensifier: 'O',
    suffix: 'L'
  }
]

exports.PUBLIC_CONSTANTS = {
  heroes: exports.HEROES_LIST,
  maps: exports.MAPS_LIST
}

exports.MONITORED_GUILDS = {
  '574791914038099971': '574791914038099984' /* aula */
}