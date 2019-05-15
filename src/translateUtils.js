const { delayedDelete } = require('./utils')

exports.translateAndReply = (msg, dm, translations) => {
  msg[dm ? 'author' : 'channel'].send(`[English] ${ translations.join("\n") }`)
  delayedDelete(msg)
}