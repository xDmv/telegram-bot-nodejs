const db = require('../../dist/db')

test('Test conect DB', () => {
	let confg = db.initializeDB();
	expect(confg).toBe('object'); 
});

test('Test get data DB', () => {
	let getdb = db.getDB('SELECT date FROM log WHERE `id` = 1');
	expect(typeof(getdb[0].date)).toBe('number');
});