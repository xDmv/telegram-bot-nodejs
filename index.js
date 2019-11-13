const TelegramBot = require('node-telegram-bot-api');
var moment = require('moment');
const data = require('./config.json');

// data for work bot
const Token = data.token;
const Admins = data.admins_user;
const Commands = data.commands;

const bot = new TelegramBot(Token, { polling: true, filepath: false });

if (!Token) {
	throw new Error('Bot token not provided');
}

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
	);`, function (res) {
	if (res.error)
		throw res.error;
});

let user_id = 123456789;
let chat_Id = 123456789;
let messages_id = 0;
let messages = 'error message';

let messageOptions = {
	parse_mode: "HTML",
	disable_web_page_preview: false,
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{
					text: 'Общая статистика',
					callback_data: '/statistic'
				},
				{
					text: 'Указать интервал',
					callback_data: 'statistic_date'
				}
			],
			[
				{
					text: 'Посмотреть ошибки',
					callback_data: 'error_all'
				}
			]
		]
	})
}

let statisticOptions = {
	parse_mode: "HTML",
	disable_web_page_preview: false,
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{
					text: 'Последние 24 часа',
					callback_data: '24'
				}
			],
			[
				{
					text: 'Последние 2 дня',
					callback_data: '2 days'
				}
			],
			[
				{
					text: 'Последние 7 дней',
					callback_data: '7 days'
				}
			],
			[
				{
					text: 'Установить интервал',
					callback_data: 'termine'
				}
			]
		]
	})
}

let errorOptions = {
	parse_mode: "HTML",
	disable_web_page_preview: false,
	reply_markup: JSON.stringify({
		inline_keyboard: [
			[
				{
					text: 'Последние 24 часа',
					callback_data: '24_error'
				}
			],[
				{
					text: 'Последние 2 дня',
					callback_data: '2day_error'
				}
			],[
				{
					text: 'Последние 7 дней',
					callback_data: '7day_error'
				}
			]
		]
	})
}

// setting bot
bot.onText(/\/setting/, (msg) => {
	user_id = msg.from.id;
	chat_Id = msg.chat.id;
	messages_id = msg.message_id;
	messages = msg;
	if (Admins.indexOf(msg.from.id) >= 0) {
		let text = `/setting - вызов данного меню;`;
		bot.sendMessage(msg.from.id, text, messageOptions, {parse_mode: 'markdown'});
	}
});

bot.on('callback_query', (msg) => {
	let user_id = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
	let datetime = Date.now();
	let statistic = '';

	function Statistic (time, iterval) {
		let sql = "SELECT count(*) as cont FROM log WHERE `type_log` == 'message' and `date` >= " + time; 
		let del_message = sqlite.run(sql);
		sql = "SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error' and `date` >= " + time;
		let error_massage = sqlite.run(sql);
		sql = "SELECT COUNT(*) as cont FROM log WHERE `date` >= " + time;
		let all_message = sqlite.run(sql);
		statistic = `
		Статистика за последние ${iterval}:
				удалено сообщений: ${del_message[0].cont};
				вызвано ошибок: ${error_massage[0].cont};
				всего сообщений в базе: ${all_message[0].cont};`;
		bot.sendMessage(user_id, statistic);
	};

	function ErrorTime (time, iterval) {
		let sql = "SELECT type, message, error, date FROM log WHERE `type_log` == 'error' and `date` >= " + time; 
		let error_array = sqlite.run(sql);
		for (let i = 0; i < error_array.length; i++) {
			let text = `Ошибки за последние ${iterval}:` + 
			`\nДата и время ошибки: ${moment(error_array[i].date).format('DD.MM.YYYY HH:mm:ss')}` + 
			`\nmessage: ${error_array[i].message}` + `\nerror: ${error_array[i].error}`;
			bot.sendMessage(user_id, text);
		}
	};

	if(msg.data === '/statistic'){
		const start = sqlite.run('SELECT date FROM log WHERE `id` = 1');
		let del_message = sqlite.run("SELECT count(*) as cont FROM log WHERE `type_log` == 'message'");
		let error_massage = sqlite.run("SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error'");
		let all_message = sqlite.run('SELECT COUNT(*) as cont FROM log');
		statistic = `
Статистика c '${moment(start[0].date).format('DD.MM.YYYY HH:mm:ss')}' по '${moment(datetime).format('DD.MM.YYYY HH:mm:ss')}'
		удалено сообщений: ${del_message[0].cont};
		вызвано ошибок: ${error_massage[0].cont};
		всего сообщений в базе: ${all_message[0].cont};`;
		bot.sendMessage(user_id, statistic, { parse_mode: 'markdown' });
	}

	if(msg.data === 'statistic_date'){
		bot.sendMessage(user_id, 'Выберите необходимый временной интервал:', statisticOptions);
	}

	if(msg.data === '24'){
		let start_date = moment(new Date()).add(-24, 'hour');
		Statistic(start_date, '24 часа');
	}

	if(msg.data === '2 days'){
		let start_date = moment(new Date()).add(-2, 'day');
		Statistic(start_date, '48 часов');
	}

	if(msg.data === '7 days'){
		let start_date = moment(new Date()).add(-7, 'day');
		Statistic(start_date, '7 дней');
	}

	if(msg.data === 'termine'){
		bot.sendMessage(user_id, 'В разработке');
	}

	if(msg.data === 'error_all'){
		bot.sendMessage(user_id, 'Выберите необходимый временной интервал для просмотра ошибок:', errorOptions);
	}

	if(msg.data === '24_error'){
		let start_date = moment(new Date()).add(-24, 'hour');
		ErrorTime(start_date, '24 часа');
	}

	if(msg.data === '2day_error'){
		let start_date = moment(new Date()).add(-2, 'day');
		ErrorTime(start_date, '2 дня');
	}

	if(msg.data === '7day_error'){
		let start_date = moment(new Date()).add(-7, 'day');
		ErrorTime(start_date, '7 дней');
	}
});

// filter message
bot.on('message', (msg) => {
	user_id = msg.from.id;
	chat_Id = msg.chat.id;
	messages_id = msg.message_id;
	messages = msg;
	const chatId = msg.chat.id;
	const id = msg.from.id;
	let datetime = Date.now();
	if (Admins.indexOf(msg.from.id) >= 0) {
		if (msg.text) {
			if (Commands.indexOf(msg.text) >= 0) {
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
					console.log('true');
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
	let text_eror = error.message + "\n" + error.stack;
	sqlite.insert("log", {
		id_user: user_id,
		chat_id: chat_Id,
		message_id: messages_id,
		type: "error",
		type_log: 'error',
		message: JSON.stringify(messages),
		error: JSON.stringify(text_eror),
		date: datetime
	});
	console.log(error); // => 'EFATAL'
});

bot.on('webhook_error', (error) => {
	let datetime = Date.now();
	let text_eror = error.message + "\n" + error.stack + "\n" + error.code;
	sqlite.insert("log", {
		id_user: user_id,
		chat_id: chat_Id,
		message_id: messages_id,
		type: "error",
		type_log: 'error',
		message: JSON.stringify(messages),
		error: JSON.stringify(text_eror),
		date: datetime
	});
	console.log(error.code); // => 'EPARSE'
});
