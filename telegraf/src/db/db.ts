const sqlite = require('sqlite-sync');

export function initializeDB() {
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

	return (typeof(sqlite.connect('statistic.db')));
}

export function setDB(
	db_name: string,
	id: number, 
	chatId: number, 
	message_id: number,
	type: string,
	type_log: string,
	messages: string,
	error: string,
	datetime: number) {

	const rezult =	sqlite.insert(db_name, {
			id_user: id,
			chat_id: chatId,
			message_id: message_id,
			type: type,
			type_log: type_log,
			message: messages,
			error: error,
			date: datetime
		});
	
	return (rezult);
}

export function getDB(sql: string) {
	let proverka = sqlite.run(
		'SELECT * FROM log;'
	);
	if(Object.keys(proverka).length !== 0){
		let rezult = sqlite.run(sql);
		return rezult;
	}
	if(Object.keys(proverka).length === 0){
		return 'error';
	}
}
