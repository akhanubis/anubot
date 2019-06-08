const
  REGEX = /^\!help/i,
  NAME = 'Help',
  REPLY_CHUNKS = [
    `
**COMMANDS**
__!stats an-account Nd__
*Shows stats for the given account for the last N days.
'Nd' is optional*
\`\`\`
!stats krusher99 7d
\`\`\`
__!deletematch #a-match-id__
*Removes the given match from the match history and removes the discord message related to that match*
\`\`\`
!deletematch #5
\`\`\`
__!replacematch #a-match-id
%MATCH-SUMMARY%__
*Multiline command. Replaces old match data with new data for the given match and updates the related discord message accordingly.
See create match trigger for information in %MATCH-SUMMARY% format*
\`\`\`
!replacematch #5
(win) paris
krusher99: 3200-3225, ana, mercy
420bootywizard: 2750-2774, genji, pharah
notes: ez combos for an ez win
\`\`\`
__!constant a-constant__
*Returns all the possible values for the constant provided.
'a_constant' must be one of (heroes, maps).*
\`\`\`
!constant heroes
\`\`\`
__!repo__
*Returns a link to the git repository where the bot code resides*
\`\`\`
!repo
\`\`\`
__!translate a-sentence-not-in-english__
*Translates the given sentence to English*
\`\`\`
!translate hola, cómo estás?
\`\`\`
__!translatedm a-sentence-not-in-english__
*Translates the given sentence to English and sends the result via DM*
\`\`\`
!translatedm hola, cómo estás?
\`\`\`
__!translatelast__
*Translates the previous message sent to the channel to English*
\`\`\`
!translatelast
\`\`\`
__!translatelastdm__
*Translates the previous message sent to the channel to English and sends the result via DM*
\`\`\`
!translatelastdm
\`\`\`
__!lacqua a question__
*Answers any questions you may have, no matter how hard or complex they are*
\`\`\`
!lacqua how to gain sr
\`\`\`
__!poll something__
*Adds 1-5 reactions to the message to use them as poll options*
\`\`\`
!poll how cool am I?
\`\`\`
`,
    `
__!savenades tag1, tag2, tag3
%LINKS%__
*Stores attachments and external links with the given tags to be able to retrieve them later with !nade.
Optional multiline command. You can provide the media via attachment or as text after the first line*
\`\`\`
!savenade ariana grande, music, pop
https://open.spotify.com/track/2tpIAmAq9orm1Owh5pja1w?si=O7JEs7VQRN27GLCiTC_7Yw
https://open.spotify.com/track/3wFLWP0FcIqHK1wb1CPthQ?si=Zqm0DRtEQleZsk0dbGfjMw
\`\`\`
__!nade tag1,tag2,tag3__
*Retrieves the previously stored media (via !savenades) that matches all the tags provided*
\`\`\`
!nade music
\`\`\`
__!deletenade #a-nade-id__
*Removes the given media and all its tag associations*
\`\`\`
!deletenade #5
\`\`\`
__!todo__
*Shows your TODO list*
\`\`\`
!todo
\`\`\`
__!todo a task__
*Adds a task to your TODO list*
\`\`\`
!todo clean my desk
\`\`\`
__!done a task__
*Marks a task from your TODO list as done*
\`\`\`
!done clean my desk
\`\`\`
`,
    `
--------------------------
**TRIGGERS** (bot will react to any messages matching the format of any triggers)
\`\`\`
(result) map
an_account: start_sr-end_sr, hero_1, hero_2, hero_3
another_account: start_sr-end_sr, hero_1, hero_2, hero_3
yet_another_account: start_sr-end_sr, hero_1, hero_2, hero_3
notes: description of the match
\`\`\`
*Creates a new entry in the match history based on the information given and then posts the newly created match data.
'result' must be one of (win, loss, draw).
'start_sr-' is optional.
'-end_sr' is optional.
Notes are optional.*
\`\`\`
(win) paris
krusher99: 3200-3225, ana, mercy
420bootywizard: 2750-2774, genji, pharah
notes: ez combos for an ez win
\`\`\`
Some more hidden triggers... you will have to browse the source code to find them ;)
`
  ]

exports.name = NAME

exports.regex = REGEX

exports.process = async msg => {
  for (let r of REPLY_CHUNKS)
    await msg.channel.send(r)
}