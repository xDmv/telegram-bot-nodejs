import Telegraf from 'telegraf';
import { getConfig } from '../config/config';
import { getAdmin } from '../config/config';

const config = getConfig('eat_test_');
const Token = config.bot_section.bot_token;
const bot = new Telegraf(Token);
const sqlite = require('sqlite-sync');
const moment = require('moment');

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
	);`
);

const messageOptions = {
	"reply_markup": {
		"inline_keyboard": [
			[
				{
					text: 'Общая статистика',
					callback_data: 'statistic_all'
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
	}
}

const statisticOptions = {
	"reply_markup": {
		"inline_keyboard": [
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
			]
		]
	}
}

const errorOptions = {
	"reply_markup": {
		"inline_keyboard":
		[
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
	}
}

// setting bot
bot.command('setting', (ctx) => {
	let messages : any;
	messages = ctx.message;
	let user_id : number = messages.from.id;
	let admins_user : any = getAdmin('eat_test_').admin_users.id_users;
	let Admins = [];
	let temp = admins_user.split(', ');
	for(let i = 0; i < temp.length; i++ ){
		Admins.push(Number(temp[i]));
	}
	if (Admins.indexOf(user_id) >= 0) {
		ctx.deleteMessage();
		let text = `/setting - вызов данного меню;`;
		bot.telegram.sendMessage(user_id, text, messageOptions );
	}
});

bot.on('callback_query', (ctx) => {
	let update: any = ctx.update;
	// console.log('temp: ', ctx.);
	let user_id : any;
	let callback_query_data = update.callback_query.data;
	// console.log(callback_query_data);
	// ctx.reply('txt mesage!');

	let datetime = Date.now();
	let statistic = '';

	function Statistic (time : number, iterval: string) {
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
		ctx.reply(statistic);
	};

	function ErrorTime (time: number, iterval:string) {
		let sql = "SELECT type, message, error, date FROM log WHERE `type_log` == 'error' and `date` >= " + time; 
		let error_array = sqlite.run(sql);
		if(error_array.length === 0) {
			ctx.reply(`Нет записей за последние ${iterval}`);
		}
		if(error_array.length > 0){
			for (let i = 0; i < error_array.length; i++) {
				let text = `Ошибки за последние ${iterval}:` + 
				`\nДата и время ошибки: ${moment(error_array[i].date).format('DD.MM.YYYY HH:mm:ss')}` + 
				`\nmessage: ${error_array[i].message}` + `\nerror: ${error_array[i].error}`;
				ctx.reply(text);
			}
		} 
	};

	if(callback_query_data === 'statistic_all'){
		const start = sqlite.run('SELECT date FROM log WHERE `id` = 1');
		let del_message = sqlite.run("SELECT count(*) as cont FROM log WHERE `type_log` == 'message'");
		let error_massage = sqlite.run("SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error'");
		let all_message = sqlite.run('SELECT COUNT(*) as cont FROM log');
		statistic = `
Статистика c '${moment(start[0].date).format('DD.MM.YYYY HH:mm:ss')}' по '${moment(datetime).format('DD.MM.YYYY HH:mm:ss')}'
		удалено сообщений: ${del_message[0].cont};
		вызвано ошибок: ${error_massage[0].cont};
		всего сообщений в базе: ${all_message[0].cont};`;
		ctx.reply(statistic);
	}

	if(callback_query_data === 'statistic_date'){
		ctx.reply('Выберите необходимый временной интервал:', statisticOptions);
	}

	if(callback_query_data === '24'){
		let start_date = moment(new Date()).add(-24, 'hour');
		Statistic(start_date, '24 часа');
	}

	if(callback_query_data === '2 days'){
		let start_date = moment(new Date()).add(-2, 'day');
		Statistic(start_date, '48 часов');
	}

	if(callback_query_data === '7 days'){
		let start_date = moment(new Date()).add(-7, 'day');
		Statistic(start_date, '7 дней');
	}

	if(callback_query_data === 'error_all'){
		ctx.reply('Выберите необходимый временной интервал для просмотра ошибок:', errorOptions);
	}

	if(callback_query_data === '24_error'){
		let start_date = moment(new Date()).add(-24, 'hour');
		ErrorTime(start_date, '24 часа');
	}

	if(callback_query_data === '2day_error'){
		let start_date = moment(new Date()).add(-2, 'day');
		ErrorTime(start_date, '2 дня');
	}

	if(callback_query_data === '7day_error'){
		let start_date = moment(new Date()).add(-7, 'day');
		ErrorTime(start_date, '7 дней');
	}

});

bot.on(['sticker', 'photo', 'document'], (ctx) => {
	let message : any ;
	let datetime = Date.now();
	message = ctx.message;
	const chatId = message.chat.id;
	const id = message.from.id;

	sqlite.insert("log", {
		id_user: id,
		chat_id: chatId,
		message_id: message.message_id,
		type: "del message not type 'text'",
		type_log: 'message',
		message: JSON.stringify(message),
		error: '',
		date: datetime
	});
	return ctx.deleteMessage();
})

bot.on('message', (ctx) => {
	let message : any ;
	let datetime = Date.now();
	message = ctx.message;
	const chatId = message.chat.id;
	const id = message.from.id;
	let type_message: string = message.entities;
	// console.log('messages: ', message);
	if(type_message === undefined 
		&& message.reply_markup === undefined){
		return console.log("OK, this text!");
		// return ctx.reply('OK, this text!');
	}
	sqlite.insert("log", {
		id_user: id,
		chat_id: chatId,
		message_id: message.message_id,
		type: "del message not type 'text'",
		type_log: 'message',
		message: JSON.stringify(message),
		error: '',
		date: datetime
	});
	console.log('delete message');
	ctx.deleteMessage();
});

(<any>bot).launch().then(() => {
	console.log('Bot started work');
});

