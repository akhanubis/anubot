# Anubot
Discord bot with a bunch of tools as translation, Overwatch match parsin, tagging media system, etc.


## COMMANDS
###### !stats an-account Nd
*Shows stats for the given account for the last N days.
'Nd' is optional*
```
!stats krusher99 7d
```
###### !deletematch #a-match-id
*Removes the given match from the match history and removes the discord message related to that match*
```
!deletematch #5
```
###### !replacematch #a-match-id %MATCH-SUMMARY%
*Multiline command. Replaces old match data with new data for the given match and updates the related discord message accordingly.
See create match trigger for information in %MATCH-SUMMARY% format*
```
!replacematch #5
(win) paris
krusher99: 3200-3225, ana, mercy
420bootywizard: 2750-2774, genji, pharah
notes: ez combos for an ez win
```
###### !constant a-constant
*Returns all the possible values for the constant provided.
'a_constant' must be one of (heroes, maps).*
```
!constant heroes
```
###### !repo
*Returns a link to the git repository where the bot code resides*
```
!repo
```
###### !translate a-sentence-not-in-english
*Translates the given sentence to English*
```
!translate hola, cómo estás?
```
###### !translatedm a-sentence-not-in-english
*Translates the given sentence to English and sends the result via DM*
```
!translatedm hola, cómo estás?
```
###### !translatelast
*Translates the previous message sent to the channel to English*
```
!translatelast
```
###### !translatelastdm
*Translates the previous message sent to the channel to English and sends the result via DM*
```
!translatelastdm
```
###### !lacqua a question
*Answers any questions you may have, no matter how hard or complex they are*
```
!lacqua how to gain sr
```
###### !poll something
*Adds 1-5 reactions to the message to use them as poll options*
```
!poll how cool am I?
```
###### !tag tag1, tag2, tag3 %LINKS%
*Stores attachments and external links with the given tags to be able to retrieve them via !tagged.
Optional multiline command. You can provide the media via attachment or as text after the first line*
```
!tag ariana grande, music, pop
https://open.spotify.com/track/2tpIAmAq9orm1Owh5pja1w?si=O7JEs7VQRN27GLCiTC_7Yw
https://open.spotify.com/track/3wFLWP0FcIqHK1wb1CPthQ?si=Zqm0DRtEQleZsk0dbGfjMw
```
###### !tagged tag1,tag2,tag3
*Retrieves the previously stored media (via !tag) that matches all the tags provided*
```
!tagged music
```
###### !deletetag #a-tag-id
*Removes the given media and all its tag associations*
```
!deletetag #5
```
###### !todo
*Shows your TODO list*
```
!todo
```
###### !todo a task
*Adds a task to your TODO list*
```
!todo clean my desk
```
###### !done a task
*Marks a task from your TODO list as done*
```
!done clean my desk
```
--------------------------
## TRIGGERS

The bot will react to any messages matching the format of any triggers
```
(result) map
an_account: start_sr-end_sr, hero_1, hero_2, hero_3
another_account: start_sr-end_sr, hero_1, hero_2, hero_3
yet_another_account: start_sr-end_sr, hero_1, hero_2, hero_3
notes: description of the match
```
*Creates a new entry in the match history based on the information given and then posts the newly created match data.
'result' must be one of (win, loss, draw).
'start_sr-' is optional.
'-end_sr' is optional.
Notes are optional.*
```
(win) paris
krusher99: 3200-3225, ana, mercy
420bootywizard: 2750-2774, genji, pharah
notes: ez combos for an ez win
```
Some more hidden triggers... you will have to browse the source code to find them ;)
