const TelegramBot = require('node-telegram-bot-api');
const expo = require('./config');

const token = expo.my_token;
const admins = expo.admins_user;

const bot = new TelegramBot(token, { polling: true });



bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    console.log('expo == ', JSON.stringify(expo.admins_user));
    if ((id !== admins[0]) && (id !== admins[1]) && (id !== admins[2])) {
        if (msg.text) {
            if (JSON.stringify(msg.entities) !== undefined) {
                bot.deleteMessage(chatId, msg.message_id);
            }
        } else {
            bot.deleteMessage(chatId, msg.message_id);
        }
    }
});

bot.on('polling_error', (error) => {
    console.log(error.code); // => 'EFATAL'
});