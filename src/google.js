const { BEANSTALK, GOOGLE_PROJECT_ID } = require('./env')

exports.translate = async source => {
  let request = {
        parent: global.translation.locationPath(GOOGLE_PROJECT_ID, 'global'),
        contents: [source],
        mimeType: 'text/plain',
        targetLanguageCode: 'en-US',
      },
      translation = (await global.translation.translateText(request))[0].translations[0].translatedText
  return translation.replace(/\<@ (& )?\d+\>/g, a => a.replace(/ /g, ''))
}

if (!BEANSTALK) {
  let mock = require('./googleDev')
  for (let m in mock)
    exports[m] = mock[m]
}