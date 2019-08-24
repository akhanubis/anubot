const fs = require('fs')

const
  REGEX = /^\!voice$/i,
  NAME = 'Voice Test',
  ON_IDLE_TIMEOUT = 300000

exports.name = NAME

exports.regex = REGEX 

let leave_timeout

exports.process = async msg => {
  const voice_channel = msg.member.voiceChannel
  voice_channel.join()
  .then(connection => {
    console.log("JOINED")
    clearTimeout(leave_timeout)
    connection.playFile('./test.mp3')
    leave_timeout = setTimeout(_ => voice_channel.leave(), ON_IDLE_TIMEOUT)
  })
}