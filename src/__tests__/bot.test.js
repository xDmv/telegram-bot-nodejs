const testbot = require('../../dist/bot');
const conf = require('../../dist/config');

describe('Unit test Bot', () => {

	beforeAll(async () => {
		config = conf.createTestConfig();
		tlgfBot = testbot.createBot(config.bot_section);
	})

	test('testing createBot', () => {
		expect(tlgfBot).toBeDefined();
		expect(tlgfBot).toHaveProperty('launch', expect.any(Function));
	});

})

