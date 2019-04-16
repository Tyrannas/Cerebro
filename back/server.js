const Cerebro = require('./core/core.js');
const transform = require('./games/snake.js');

const snake = new Cerebro(
	{
		world: {
			width: 20,
			height: 15
		},
		extraDots: 2,
		dots: [],
		players: [],
		score: {}
	},
	transform,
	100
);
