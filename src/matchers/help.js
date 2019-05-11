const
  REGEX = /^\!help/i,
  NAME = 'Help',
  REPLY = `
**COMMANDS**
__!stats an_account__
*Shows stats for the given account*
\`\`\`
!stats krusher99
\`\`\`
__!deletematch #a_match_id__
*Removes the given match from the match history*
\`\`\`
!deletematch #5
\`\`\`
__!replacematch #a_match_id
%MATCH_SUMMARY%__
*Multiline command. Replaces old match data with new data for the given match. See create match trigger for information in %MATCH_SUMMARY% format*
\`\`\`
!replacematch #5
(win) paris
krusher99: 3200-3225, ana, mercy
420bootywizard: 2750-2774, genji, pharah
notes: ez combos for an ez win
\`\`\`
__!constant a_constant__
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
**TRIGGERS** (bot will react to any messages matching the format of any triggers)
\`\`\`
(result) map
an_account: start_sr-end_sr, hero_1, hero_2, hero_3
another_account: start_sr-end_sr, hero_1, hero_2, hero_3
yet_another_account: start_sr-end_sr, hero_1, hero_2, hero_3
notes: description of the match
\`\`\`
*Creates a new entry in the match history based on the information given.
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

exports.name = NAME

exports.regex = REGEX

exports.process = msg => msg.channel.send(REPLY)