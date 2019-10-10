const TelegramBot = require('node-telegram-bot-api');
const data = require('./config');
const sqlite = require('sqlite-sync');

sqlite.connect('statistic.db');
sqlite.run(`CREATE TABLE IF NOT EXISTS log(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_user INTEGER,
    chat_id INTEGER,
    message_id INTEGER,
    type TEXT,
    message TEXT,
    error TEXT,
    date INTEGER
    );`, function(res) {
    if (res.error)
        throw res.error;
});


// data for work bot
const token = data.my_token;
const admins = data.admins_user;

const bot = new TelegramBot(token, { polling: true, filepath: false });

bot.onText(/\/setting/, (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    if (admins.indexOf(id) > 0) {
        const log = sqlite.run('SELECT * FROM log');
        console.log(JSON.stringify(log));
        bot.sendMessage(msg.from.id, 'statistic.\n');
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    let datetime = Date.now();
    if (
        (id !== admins[0]) &&
        (id !== admins[1])
    ) {
        if (msg.text) {
            if (JSON.stringify(msg.entities) !== undefined) {
                sqlite.insert("log", {
                    id_user: id,
                    chat_id: chatId,
                    message_id: msg.message_id,
                    type: "del message type = 'text'",
                    message: JSON.stringify(msg),
                    error: '',
                    date: datetime
                });
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
            sqlite.insert("log", {
                id_user: id,
                chat_id: chatId,
                message_id: msg.message_id,
                type: "del message not type 'text'",
                message: JSON.stringify(msg),
                error: '',
                date: datetime
            });
            bot.deleteMessage(chatId, msg.message_id);
        }
    }
});

bot.on('polling_error', (error) => {
    let datetime = Date.now();
    sqlite.insert("log", {
        id_user: id,
        chat_id: chatId,
        message_id: msg.message_id,
        type: "error",
        message: JSON.stringify(msg),
        error: JSON.stringify(error),
        date: datetime
    });
    console.log(error.code); // => 'EFATAL'
});
bot.on('webhook_error', (error) => {
    let datetime = Date.now();
    sqlite.insert("log", {
        id_user: id,
        chat_id: chatId,
        message_id: msg.message_id,
        type: "error",
        message: JSON.stringify(msg),
        error: JSON.stringify(error),
        date: datetime
    });
    console.log(error.code); // => 'EPARSE'
});