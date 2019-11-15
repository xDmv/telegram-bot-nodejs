const conf = require('../../dist/config/config');

test('Test config', () => {
	const confg = conf.getConfig('eat_test_');
	expect(confg).toBeDefined();
	expect(confg).toHaveProperty('bot_section', expect.any(Object));
	const {bot_section} = confg;
	expect(bot_section).toHaveProperty('bot_token', expect.any(String));
})

test('Test config Admin', () => {
	const confg = conf.getAdmin('eat_test_');
	expect(confg).toBeDefined();
	expect(confg).toHaveProperty('admin_users', expect.any(Object));
	const {admin_users} = confg;
	expect(admin_users).toHaveProperty('id_users');
})