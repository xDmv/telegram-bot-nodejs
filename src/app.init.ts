import { ConfigT } from './config';
import { createBot, initializeTlgfBot, TelegrafBotT } from './bot';
import { initializeDB, sqlite } from './db';

export type AppT= {
	Bot: TelegrafBotT,
	config: ConfigT,
}

export function createApp (config: ConfigT) : AppT {
	const Bot = createBot(config.bot_section);
	return {
		config,
		Bot
	}
}

export async function initializeApp(app: AppT): Promise<AppT> {
	await initializeDB();
	await initializeTlgfBot(app.Bot, app.config);
	return app
}