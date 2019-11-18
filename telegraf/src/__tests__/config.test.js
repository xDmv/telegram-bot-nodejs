const conf = require('../../dist/config');

test('Test Token', () => {
	const confg = conf.getConfig('eat_test_');
	expect(confg).toBeDefined();
	expect(confg).toHaveProperty('bot_section', expect.any(Object));
	const {bot_section} = confg;
	expect(bot_section).toHaveProperty('bot_token', expect.any(String));
});

test('Test user Admins', () => {
	const confg = conf.getAdmin('admin_data_');
	expect(confg).toBeDefined();
	expect(typeof(confg)).toBe('object');
});