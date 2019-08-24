const { ASSETS_BUCKET_DOMAIN } = require('../env')
const { emoji, getAttachments } = require('../utils')

const
  REGEX = /^\!play(\s+([^\n]+))?$/i,
  NAME = 'Voice Test',
  ON_IDLE_TIMEOUT = 300000

exports.name = NAME

exports.regex = REGEX 

let leave_timeout

exports.process = async msg => {
  const voice_channel = msg.member.voice.channel,
        filename = (msg.content.match(REGEX)[2] || '').trim(),
        attachment = getAttachments(msg)[0]
  if (!voice_channel) {
    msg.channel.send(`You are not in a voice channel ${ emoji('pepothink') }`)
    return
  }
  if (!(attachment || filename)) {
    msg.channel.send(`Missing media ${ emoji('pepothink') }`)
    return
  }

  const file_url = attachment ? attachment.url : `${ ASSETS_BUCKET_DOMAIN }/sounds/${ msg.channel.guild.id }/${ filename }.mp3`
  console.log('Playing', file_url)
  clearTimeout(leave_timeout)
  const connection = await voice_channel.join()
  connection.play(file_url)
  leave_timeout = setTimeout(_ => voice_channel.leave(), ON_IDLE_TIMEOUT)
}