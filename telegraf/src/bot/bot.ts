import Telegraf from 'telegraf';
import { getConfig } from '../config/config';

const config = getConfig('eat_test_');
const Token = config.bot_section.bot_token;
const bot = new Telegraf(Token);

bot.on('message', (ctx) => {
	let message : any ;
	message = ctx.message;
	console.log('message2: \n', message);
	let type_message: string = message.entities;
	// console.log(`type_message: ${type_message}`);
	if(type_message === undefined 
		&& message.reply_markup === undefined
		&& message.sticker === undefined){
		return ctx.reply('OK, this text!');
	}
	console.log('del');
	ctx.deleteMessage();
});
(<any>bot).launch();
