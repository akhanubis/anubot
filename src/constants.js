/* TODO: store this in a Dynamo metadata table */

exports.WAIT_BEFORE_DESTROY_IN_S = 10

exports.ERROR_EMOJI = '💣'

exports.SUCCESS_EMOJI = '👌'

exports.MAPS_LIST = {
  'hanamura': 'Hanamura',
  'horizon': 'Horizon Lunar Colony',
  'horizon lunar colony': 'Horizon Lunar Colony',
  'horizon colony': 'Horizon Lunar Colony',
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
  'freestyle': 'Freestyle'
}

exports.PLAYERS_LIST = {
  'Pablo': ['Ramanujan', 'Pablo', 'Traianus'],
  'Ninjin': ['AhuraMahzda', 'Milk', 'Ninjin', 'Lola'],
  'Robo': ['Robogeeker', 'Dwon'],
  'Coyce': ['Coyce'],
  'Neon': ['NeonXD'],
  'Bats': ['Trutututu'],
  'Freestyle': ['Freestyle']
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
  ['the SR go down', { type: 'WATCHING' }],
  ['Leonard Cohen', { type: 'LISTENING' }],
  ['Ariana Grande', { type: 'LISTENING' }],
  ['teammates flame me :(', { type: 'LISTENING' }],
  ['a happy song', { type: 'PLAYING' }]
]

exports.EMOJIS = {
  ole: '548558440822472714',
  'unamused~1': '498163653275680778',
  rager: '555849538695331861',
  feelssadman: '560563582144741388',
  mmyea: '560563647529877544',
  'zzz~1': '498163652889804831',
  patwidow: '576068002215362561',
  patsombra: '576068035576725514',
  patpharah: '576082671218851841',
  patmercy: '576068114249285652',
  patgenji: '576084695305945095',
  patbrigitte: '576068065641627669',
  patana: '576067950495268885'
}

exports.PATS = {
  Widowmaker: 'patwidow',
  Sombra: 'patsombra',
  Pharah: 'patpharah',
  Mercy: 'patmercy',
  Genji: 'patgenji',
  Brigitte: 'patbrigitte',
  Ana: 'patana'
}

exports.USER_IDS = {
  cactus: '421125233970380810',
  anu: '113794572236226563'
}

exports.WIN_REACTIONS = ['ole', 'mmyea']

exports.RESULT_EMOJIS = {
  W: [':peach:', ':v:', ':cherries:', ':lemon:', ':strawberry:', ':medal:', ':four_leaf_clover:', ':dart:', ':love_letter:', ':avocado:', ':sunflower:', ':fire:', ':blush:', ':stuck_out_tongue:', ':beach_umbrella:'],
  L: [':head_bandage:', ':speak_no_evil:', ':chicken:', ':boom:', ':wilted_rose:', ':8ball:', ':space_invader:', ':game_die:', ':knife:', ':crossed_swords:', ':skull_crossbones:', ':pill:', ':syringe:'],
  D: [':peach:', ':v:', ':cherries:', ':lemon:', ':strawberry:', ':medal:', ':four_leaf_clover:', ':dart:', ':love_letter:', ':avocado:', ':sunflower:', ':fire:', ':blush:', ':stuck_out_tongue:', ':beach_umbrella:', ':head_bandage:', ':speak_no_evil:', ':chicken:', ':boom:', ':wilted_rose:', ':8ball:', ':space_invader:', ':game_die:', ':knife:', ':crossed_swords:', ':skull_crossbones:', ':pill:', ':syringe:']
}