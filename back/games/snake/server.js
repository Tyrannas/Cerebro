const Cerebro = require('../../core/core.js');
const transform = require('./snake.js');

const snake = new Cerebro(
	{
		world: {
			width: 60,
			height: 35
		},
		extraDots: 2,
		dots: [],
		players: [],
		score: {}
	},
	transform,
	100
);
