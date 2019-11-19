export const messageOptions = {
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

export const statisticOptions = {
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

export const errorOptions = {
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