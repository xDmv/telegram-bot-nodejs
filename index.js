const TelegramBot = require('node-telegram-bot-api');
const expo = require('./config');

const token = expo.my_token;
const admins = expo.admins_user;

const bot = new TelegramBot(token, { polling: true });



bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    if ((id !== admins[0]) && (id !== admins[1])) {
        if (msg.text) {
            if (JSON.stringify(msg.entities) !== undefined) {
                bot.deleteMessage(chatId, msg.message_id);
            } else {
                if (msg.reply_markup) {
                    bot.deleteMessage(chatId, msg.message_id);
                } else {
                    console.log(JSON.stringify(msg));
                    console.log(JSON.stringify('msg.entities == ', msg.entities));
                }
            }
        } else {
            bot.deleteMessage(chatId, msg.message_id);
        }
    }
});

bot.on('polling_error', (error) => {
    console.log(error.code); // => 'EFATAL'
});