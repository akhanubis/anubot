const
  REGEX = /^\!poll/i,
  NAME = 'Poll',
  POLL_REACTIONS = ['1⃣', '2⃣', '3⃣', '4⃣', '498163653661687809' /* succ emoji */]

exports.name = NAME

exports.regex = REGEX

exports.skip_reaction = true

exports.process = async msg => {
  for (let r of POLL_REACTIONS)
    await msg.react(r)
}