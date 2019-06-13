const { LAUGH_BITS, MAJOR_LAUGHS } = require('../constants')
const { now, onCooldown, pickRandom } = require('../utils')

const
  REGEX = /\b(a{0,2}(j|h){1,3}a{1,3}((j|h){1,3}a{1,3})*(j|h){1,2}a{0,2}|(lo){1,}l|lo+l|lmao{1,}|(lu){1,}l|lo+l|omegalul|k{4,})\b/i,
  NAME = 'Jajaja',
  COMMAND_CD_IN_S = 120,
  LAUGH_CD_IN_S = 30,
  COOLDOWNS = {},
  INTENSITY_VARIANCE = 3,
  MINOR_LAUGH_MIN_INTENSITY = 4,
  MAJOR_LAUGH_MIN_INTENSITY = 10

exports.name = NAME

exports.regex = REGEX

exports.skip_reaction = true

exports.process = msg => {
  COOLDOWNS[msg.channel.id] = COOLDOWNS[msg.channel.id] || {}
  /* laugh on CD means 2 laughs in less than CD time, bot should laugh along && bot laugh not on CD means bot hasnt laughed in a while */
  if (onCooldown(COOLDOWNS[msg.channel.id].last_laugh, LAUGH_CD_IN_S) && !onCooldown(COOLDOWNS[msg.channel.id].last_bot_laugh, COMMAND_CD_IN_S)) {
    COOLDOWNS[msg.channel.id].last_bot_laugh = now()

    let source_laugh = msg.content.match(REGEX)[1],
        source_intensity = source_laugh.length,
        uppercase = source_laugh === source_laugh.toUpperCase()
        out_laugh = source_intensity >= MAJOR_LAUGH_MIN_INTENSITY ? major_laugh(source_intensity) : minor_laugh(source_intensity, uppercase)
    msg.channel.send(out_laugh)
  }
  COOLDOWNS[msg.channel.id].last_laugh = now()
}

const major_laugh = intensity => {
  let l = pickRandom(MAJOR_LAUGHS)
  return `${ l.prefix }${ repeat(l.intensifier, random_intensity(intensity)) }${ l.suffix }`
}

const minor_laugh = (intensity, source_uppercase) => {
  let l = pickRandom(LAUGH_BITS),
      out = `${ repeat(l.bit, Math.max(MINOR_LAUGH_MIN_INTENSITY, random_intensity(intensity)) / l.bit.length) }${ l.odd ? l.bit[0] : '' }`
  if (!l.odd && out.length > 5 && Math.random() > 0.5)
    out = out.substr(1)
  if (Math.random() > (source_uppercase ? 0.2 : 0.8))
    out = out.toUpperCase()
  return out
}

const random_intensity = source_intensity => source_intensity - INTENSITY_VARIANCE + Math.random() * INTENSITY_VARIANCE * 2

const repeat = (str, times) => str.repeat(Math.max(1, Math.floor(times)))