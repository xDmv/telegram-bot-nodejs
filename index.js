const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment');
const data = require('./config.json');

// data for work bot
const token = data.token;
const admins = data.admins_user;

const bot = new TelegramBot(token, { polling: true, filepath: false });

// add sql-lite database
const sqlite = require('sqlite-sync');

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
    );`, function(res) {
    if (res.error)
        throw res.error;
});

// setting bot
bot.onText(/\/setting/, (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    let datetime = Date.now();
    if (admins.indexOf(id) > 0) {
        // const log = sqlite.run('SELECT * FROM log');
        const start = sqlite.run('SELECT date FROM log WHERE `id` = 1');
        let del_message = 0;
        let error_massage = 0;
        let all_message = 0;
        let statistic = '';
        // console.log('log: \n', JSON.stringify(log));

        bot.sendMessage(id, 'Список команд:\n' +
            '/setting - вызов данного меню\n' +
            '/statistic all - вся статистика за весь период работы; \n' +
            '/error message - узнать подробности об ошибках\n' +
            '/del message - узнать подробности об удаленных сообщениях\n' +
            '/unit-test - провести тестирование бота на работоспособность');
        // all statistic:
        // let static_all = [];
        // log.forEach(function(element) {
        //     static_all.push('`' + JSON.stringify(element) + '`');
        // });
        // bot.sendMessage(id, static_all.join(',\n '), { parse_mode: 'markdown' });
        del_message = sqlite.run("SELECT count(*) as cont FROM log WHERE `type_log` == 'message'");
        error_massage = sqlite.run("SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error'");
        all_message = sqlite.run('SELECT COUNT(*) as cont FROM log');
        console.log('date: ', moment(start[0].date).format('DD.MM.YYYY hh:mm:ss'));
        console.log('del_message: ', del_message[0].cont);
        statistic = 'Статистика c \'' + moment(start[0].date).format('DD.MM.YYYY hh:mm:ss') + '\' по \'' + moment(datetime).format('DD.MM.YYYY hh:mm:ss') +
            '\' \n удалено сообщений: ' + del_message[0].cont +
            '\n вызвано ошибок: ' + error_massage[0].cont +
            '\n всего сообщений в базе: ' + all_message[0].cont;
        bot.sendMessage(id, statistic, { parse_mode: 'markdown' });
    }
});

// filter message
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
                    type_log: 'message',
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
                type_log: 'message',
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
        type_log: 'error',
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
        type_log: 'error',
        message: JSON.stringify(msg),
        error: JSON.stringify(error),
        date: datetime
    });
    console.log(error.code); // => 'EPARSE'
});