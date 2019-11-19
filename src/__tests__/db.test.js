const db = require('../../dist/db');

describe('Unit test DB function', () => {

	beforeAll(async () => {
		// config = createTestConfig();
		// pgDB = createPgDB(config.db_section);
		await db.initializeDB();
	});

	test('Test conect DB', () => {
		const confg = db.initializeDB();
		expect(confg).toBeDefined();
		expect(typeof(confg)).toBe("object");
	});

	test('testing setting data in the DB', () => {
		let datetime = Date.now();
		const db_name = 'log';
		const test_data = {
			id_user: 0,
			chat_id: 0,
			message_id: 0,
			type: 'test',
			type_log: 'unit-test DB',
			message: '',
			error: '',
			date: datetime
		};
		const testingDB = db.setDB(
			db_name,
			test_data.id_user,
			test_data.chat_id,
			test_data.message_id,
			test_data.type,
			test_data.type_log,
			test_data.message,
			test_data.error,
			test_data.date
		);
		expect(testingDB).toBeDefined();
		expect(typeof(testingDB)).toBe('number');
	});

	test('Test get data DB', () => {
		let getdb = db.getDB('SELECT date FROM log WHERE `id` = 1');
		expect(typeof(getdb[0].date)).toBe('number');
	});

	test('Test destroed sqlite', () => {
		const closeDB = db.stopDB();
		expect(closeDB).toBeDefined();
	});

})