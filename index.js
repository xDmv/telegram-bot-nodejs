const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment');
const data = require('./config.json');

// data for work bot
const token = data.token;
const admins = data.admins_user;
const commands = data.commands;

const bot = new TelegramBot(token, { polling: true, filepath: false });

if (!token) {
    throw new Error('Bot token not provided');
}


// add sql-lite database
const sqlite = require('sqlite-sync');

let user_id = 123456789;
let chat_Id = 123456789;
let messages_id = 0;
let messages = 'example';

sqlite.connect('statistic.db');
sqlite.run(`CREATE TABLE IF NOT EXISTS log(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_user INTEGER,
    chat_id INTEGER,
    message_id INTEGER,
    type TEXT,
    type_log TEXT,
    message TEXT,
    error TEXT,
    date INTEGER
    );`, function (res) {
    if (res.error)
        throw res.error;
});

// setting bot
bot.onText(/\/setting/, (msg) => {
    user_id = msg.from.id;
    chat_Id = msg.chat.id;
    messages_id = msg.message_id;
    messages = msg;
    if (admins.indexOf(msg.from.id) >= 0) {
        let text = `Список команд: 
            /setting - вызов данного меню;
            /statistic - вся статистика за весь период работы;`;
        bot.sendMessage(msg.from.id, text);
    }
});

// statistic all
bot.onText(/\/statistic/, (msg) => {
    let datetime = Date.now();
    user_id = msg.from.id;
    chat_Id = msg.chat.id;
    messages_id = msg.message_id;
    messages = msg;
    if (admins.indexOf(msg.from.id) >= 0) {
        const start = sqlite.run('SELECT date FROM log WHERE `id` = 1');
        let statistic = '';
        let del_message = sqlite.run("SELECT count(*) as cont FROM log WHERE `type_log` == 'message'");
        let error_massage = sqlite.run("SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error'");
        let all_message = sqlite.run('SELECT COUNT(*) as cont FROM log');
        statistic = 'Статистика c \'' + moment(start[0].date).format('DD.MM.YYYY HH:mm:ss') + '\' по \'' + moment(datetime).format('DD.MM.YYYY HH:mm:ss') +
            '\' \n удалено сообщений: ' + del_message[0].cont +
            '\n вызвано ошибок: ' + error_massage[0].cont +
            '\n всего сообщений в базе: ' + all_message[0].cont;
        bot.sendMessage(user_id, statistic, { parse_mode: 'markdown' });
    }
});

bot.onText(/\/del/, (msg) => {
    user_id = msg.from.id;
    chat_Id = msg.chat.id;
    messages_id = msg.message_id;
    messages = msg;
    let del_massage = sqlite.run("SELECT * FROM log WHERE `type_log` == 'message'");
    console.log(JSON.stringify(del_massage));
    bot.sendMessage(msg.from.id, 'находится в разработке!');
});

bot.onText(/\/error/, (msg) => {
    user_id = msg.from.id;
    chat_Id = msg.chat.id;
    messages_id = msg.message_id;
    messages = msg;
    let error_massage = sqlite.run("SELECT * FROM log WHERE `type_log` == 'error'");
    console.log(JSON.stringify(error_massage));
    bot.sendMessage(msg.from.id, 'находится в разработке!');
});

// filter message
bot.on('message', (msg) => {
    user_id = msg.from.id;
    chat_Id = msg.chat.id;
    messages_id = msg.message_id;
    messages = msg;
    const chatId = msg.chat.id;
    const id = msg.from.id;
    let datetime = Date.now(); commands
    if (
        (id !== admins[0]) &&
        (id !== admins[1])
    ) {
        if (msg.text) {
            if (commands.indexOf(msg.text) >= 0) {
                bot.deleteMessage(chatId, msg.message_id);
                return
            }
            if (JSON.stringify(msg.entities) !== undefined) {
                sqlite.insert("log", {
                    id_user: id,
                    chat_id: chatId,
                    message_id: msg.message_id,
                    type: "del message type = 'text'",
                    type_log: 'message',
                    message: JSON.stringify(msg),
                    error: '',
                    date: datetime
                }, function (res) {
                    if (res.error)
                        throw res.error;
                    console.log(res);
                });
                bot.deleteMessage(chatId, msg.message_id);
            } else {
                if (msg.reply_markup) {
                    bot.deleteMessage(chatId, msg.message_id);
                } else {
                    console.log(JSON.stringify(msg));
                }
            }
        } else {
            sqlite.insert("log", {
                id_user: id,
                chat_id: chatId,
                message_id: msg.message_id,
                type: "del message not type 'text'",
                type_log: 'message',
                message: JSON.stringify(msg),
                error: '',
                date: datetime
            }, function (res) {
                if (res.error)
                    throw res.error;
                console.log(res);
            });
            bot.deleteMessage(chatId, msg.message_id);
        }
    }
});


bot.on('polling_error', (error) => {
    let datetime = Date.now();
    console.log('|++++|');
    console.log('chatId: ', messages);
    sqlite.insert("log", {
        id_user: user_id,
        chat_id: chat_Id,
        message_id: messages_id,
        type: "error",
        type_log: 'error',
        message: JSON.stringify(messages),
        error: JSON.stringify(error),
        date: datetime
    });
    console.log(error); // => 'EFATAL'
});

bot.on('webhook_error', (error) => {
    console.log('/---/');
    // sqlite.insert("log", {
    //     id_user: msg.from.id,
    //     chat_id: msg.chat.id,
    //     message_id: msg.message_id,
    //     type: "error",
    //     type_log: 'error',
    //     message: JSON.stringify(msg),
    //     error: JSON.stringify(error),
    //     date: datetime
    // });
    console.log(error.code); // => 'EPARSE'
});

// sqlite.close();