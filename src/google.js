const { BEANSTALK, GOOGLE_PROJECT_ID } = require('./env')

exports.translate = async source => {
  let request = {
        parent: global.translation.locationPath(GOOGLE_PROJECT_ID, 'global'),
        contents: source,
        mimeType: 'text/plain',
        targetLanguageCode: 'en-US',
      },
      translations = (await global.translation.translateText(request))[0].translations.map(t => t.translatedText.replace(/\<@ (& )?\d+\>/g, a => a.replace(/ /g, '')))
  return translations
}

if (!BEANSTALK) {
  let mock = require('./googleDev')
  for (let m in mock)
    exports[m] = mock[m]
}