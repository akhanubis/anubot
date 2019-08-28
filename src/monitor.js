const { MONITORED_GUILDS } = require('./constants')

const member_name = member => `**${ member.user.tag }**`

module.exports = {
  setupMonitoring: _ => {
    global.client.on('guildMemberAdd', member => {
      let notification_channel_id = MONITORED_GUILDS[member.guild.id]
      if (notification_channel_id)
        member.guild.channels.get(notification_channel_id).send(`${ member_name(member) } joined the desert`)
    })
    global.client.on('guildMemberRemove', member => {
      let notification_channel_id = MONITORED_GUILDS[member.guild.id]
      if (notification_channel_id)
        member.guild.channels.get(notification_channel_id).send(`${ member_name(member) } left the desert`)
    })
  }
}