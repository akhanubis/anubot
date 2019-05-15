const { delayedDelete } = require('./utils')

exports.translateAndReply = (msg, dm, translations, destroy_msg = true) => {
  msg[dm ? 'author' : 'channel'].send(`[English] ${ translations.join("\n") }`)
  if (destroy_msg)
    delayedDelete(msg)
}