require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

if (!process.env.TOKEN) {
  throw new Error('No token provided.')
}

const bot = new TelegramBot(process.env.TOKEN, {polling: true})

bot.onText(/\/echo (.+)/, async (message, match) => {
  const from     = message.from.id
  const response = match[1]

  await bot.sendMessage(from, response)
})

bot.on('message', async (message) => {
  const chatId = message.chat.id
  await bot.sendMessage(chatId, 'Received your message')
})
