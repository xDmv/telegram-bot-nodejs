import Telegraf from 'telegraf';
import { getConfig } from '../config/config';
import { getAdmin } from '../config';
import { initializeDB, getDB, setDB } from '../db';
import { messageOptions, statisticOptions, errorOptions } from './optionsButton';

const config = getConfig('eat_test_');
const Admins = getAdmin('admin_data_'); 



const Token = config.bot_section.bot_token;
const bot = new Telegraf(Token);
const moment = require('moment');

const db = initializeDB();
db;



// setting bot
bot.command('setting', (ctx) => {
	let messages : any;
	messages = ctx.message;
	if (Admins.indexOf(messages.from.id) >= 0) {
		ctx.deleteMessage();
		let text = `/setting - вызов данного меню;`;
		bot.telegram.sendMessage(messages.from.id, text, messageOptions );
	}
});

bot.on('callback_query', (ctx) => {
	let update: any = ctx.update;
	// console.log('temp: ', ctx.from.id);
	let user_id : any;
	let callback_query_data = update.callback_query.data;
	// console.log(callback_query_data);
	// ctx.reply('txt mesage!');

	let datetime = Date.now();
	let statistic = '';

	function Statistic (time : number, iterval: string) {
		let sql = "SELECT count(*) as cont FROM log WHERE `type_log` == 'message' and `date` >= " + time; 
		let del_message = getDB(sql);
		if(del_message === 'error'){
			return ctx.reply('На данный момент в базе нет записей');
		}
		sql = "SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error' and `date` >= " + time;
		let error_massage = getDB(sql);
		sql = "SELECT COUNT(*) as cont FROM log WHERE `date` >= " + time;
		let all_message = getDB(sql);
		if (del_message.length === 0 &&
			error_massage.length === 0 &&
			all_message.length === 0) {
			ctx.reply(`Нет записей за последние ${iterval}`);
		}
		statistic = `
		Статистика за последние ${iterval}:
				удалено сообщений: ${del_message[0].cont};
				вызвано ошибок: ${error_massage[0].cont};
				всего сообщений в базе: ${all_message[0].cont};`;
		ctx.reply(statistic);
	};

	function ErrorTime (time: number, iterval:string) {
		let sql = "SELECT type, message, error, date FROM log WHERE `type_log` == 'error' and `date` >= " + time; 
		let error_array = getDB(sql);
		if(error_array === 'error'){
			return ctx.reply('На данный момент в базе нет записей');
		}
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
		const start = getDB('SELECT date FROM log WHERE `id` = 1');
		if(start === 'error'){
			return ctx.reply('На данный момент в базе нет записей');
		}
		let del_message = getDB("SELECT count(*) as cont FROM log WHERE `type_log` == 'message'");
		let error_massage = getDB("SELECT COUNT(*) as cont FROM log WHERE `type_log` == 'error'");
		let all_message = getDB('SELECT COUNT(*) as cont FROM log');
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

bot.on(['sticker', 'photo', 'document', 'contact', 'location', 'audio'], (ctx) => {
	let message : any = ctx.message;
	let datetime = Date.now();

	setDB(
		"log",
		message.from.id,
		message.chat.id,
		message.message_id,
		"del message not type 'text'",
		'message',
		JSON.stringify(message),
		'',
		datetime
	);
	return ctx.deleteMessage();
})

bot.on('message', (ctx) => {
	let message : any ;
	let datetime = Date.now();
	message = ctx.message;
	const chatId = message.chat.id;
	const id = message.from.id;
	let type_message: string = message.entities;
	if(type_message === undefined 
		&& message.reply_markup === undefined){
		return console.log("OK, this text!");
	}
	setDB(
		"log",
		message.from.id,
		message.chat.id,
		message.message_id,
		"del message not type 'text'",
		'message',
		JSON.stringify(message),
		'',
		datetime
	);
	console.log('delete message');
	ctx.deleteMessage();
});

(<any>bot).launch().then(() => {
	console.log('Bot started work');
});

