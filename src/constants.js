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
  'ahura': 'AhuraMahzda',
  'ahuramahzda': 'AhuraMahzda',
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
  'kat': 'Kat',
  'kat!': 'Kat',
  'dinkle': 'Dinkleberg!',
  'dinkleberg!': 'Dinkleberg!',
  'goofygoober': 'GoofyGoober',
  'goofy': 'GoofyGoober',
  'goober': 'GoofyGoober',
  'speedy': 'Speedy'
}

exports.PLAYERS_LIST = {
  'Pablo': ['Ramanujan', 'Pablo', 'Traianus'],
  'Ninjin': ['AhuraMahzda', 'Milk', 'Ninjin', 'Lola'],
  'Robo': ['Robogeeker', 'Dwon'],
  'Coyce': ['Coyce'],
  'Neon': ['NeonXD'],
  'Bats': ['Trutututu'],
  'Freestyle': ['Freestyle'],
  'Kat': ['Kat', 'Dinkleberg!', 'Speedy'],
  'Goober': ['GoofyGoober']
}

exports.HEROES_LIST = {
  'ana': 'Ana',
  'ashe': 'Ashe',
  'baptiste': 'Baptiste',
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
  'soldier': 'Soldier: 76',
  'soldier 76': 'Soldier: 76',
  'sombra': 'Sombra',
  'symm': 'Symmetra',
  'symmetra': 'Symmetra',
  'torb': 'Torbjörn',
  'torbjorn': 'Torbjörn',
  'traccer': 'Tracer',
  'widow': 'Widowmaker',
  'widowmaker': 'Widowmaker',
  'winston': 'Winston',
  'hammond': 'Wrecking Ball',
  'ball': 'Wrecking Ball',
  'wrecking ball': 'Wrecking Ball',
  'zarya': 'Zarya',
  'zen': 'Zenyatta',
  'zenyatta': 'Zenyatta'
}

exports.ACTIVITIES = [
  ['the sr go down', { type: 'WATCHING' }],
  ['leonard cohen', { type: 'LISTENING' }],
  ['ariana grande', { type: 'LISTENING' }],
  ['my teammates flame me :(', { type: 'LISTENING' }],
  ['a happy song', { type: 'PLAYING' }],
  ['with your heart', { type: 'PLAYING' }],
  ['with my donger', { type: 'PLAYING' }],
  ['cba\'s instagram feed', { type: 'LISTENING' }],
  ['overwatch league', { type: 'WATCHING' }],
  ['arteezy stream', { type: 'WATCHING' }],
  ['kanye west', { type: 'LISTENING' }],
  ['a song of ice and fire', { type: 'LISTENING' }]
]

exports.PATS = {
  Widowmaker: 'patwidow',
  Sombra: 'patsombra',
  Pharah: 'patpharah',
  Mercy: 'patmercy',
  Brigitte: 'patbrigitte',
  Ana: 'patana',
  Reinhardt: 'patrein',
  Ashe: 'patashe'
}

exports.USER_IDS = {
  cactus: '421125233970380810',
  anu: '113794572236226563'
}

exports.MAIN_EMOJIS = {
  W: ['ole', 'mmyea'],
  L: ['feelssadman', 'rager', 'pepehands', 'pepegun', 'pepefreeze', 'monkaS'],
  D: ['498163652889804831', '498163653275680778']
}

exports.RESULT_EMOJIS = {
  W: [':peach:', ':v:', ':cherries:', ':lemon:', ':strawberry:', ':medal:', ':four_leaf_clover:', ':dart:', ':love_letter:', ':avocado:', ':sunflower:', ':fire:', ':stuck_out_tongue:', ':beach_umbrella:'],
  L: [':head_bandage:', ':speak_no_evil:', ':chicken:', ':boom:', ':wilted_rose:', ':8ball:', ':space_invader:', ':game_die:', ':knife:', ':crossed_swords:', ':skull_crossbones:', ':pill:', ':syringe:'],
  D: [':peach:', ':v:', ':cherries:', ':lemon:', ':strawberry:', ':medal:', ':four_leaf_clover:', ':dart:', ':love_letter:', ':avocado:', ':sunflower:', ':fire:', ':stuck_out_tongue:', ':beach_umbrella:', ':head_bandage:', ':speak_no_evil:', ':chicken:', ':boom:', ':wilted_rose:', ':8ball:', ':space_invader:', ':game_die:', ':knife:', ':crossed_swords:', ':skull_crossbones:', ':pill:', ':syringe:']
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