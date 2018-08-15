require('dotenv').config()

if (!process.env.TOKEN) {
  throw new Error('No token provided.')
}

const TelegramBot = require('node-telegram-bot-api')
const emojilib    = require('emojilib').lib

const bot = new TelegramBot(process.env.TOKEN, {polling: true})

const translate = sentence => sentence.split(' ').reduce((prev, curr) => [getEmojiList(curr), ...prev], []).join('')

const getEmojiList = word => {
  word = word.trim().toLowerCase().replace(/[&\/\\#,+()$~%.'":*?!<>{}]/, '')

  const result = []

  for (let e in emojilib) {
    const keywords = emojilib[e].keywords

    if (keywords.indexOf(word) >= 0 || word === e) {
      result.push(emojilib[e].char)
    }
  }

  return result
}

const sendMessage = async (to, message) => {
  try {
    await bot.sendMessage(to, message)
  } catch (e) {
    console.log(e.message)
  }
}

bot.onText(/\/help/, async (message) => sendMessage(message.from.id, 'Just type your message to get emojis 💩💩💩 !'))

bot.on('message', async (message) => {
  const translated = translate(message.text)
  const response   = translated.length ? translated : `No corresponded emojis found: ${message.text}. Try another one.`
  await sendMessage(message.chat.id, response)
})
