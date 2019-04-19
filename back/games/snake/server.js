const Cerebro = require('../../core/core.js');
const transform = require('./snake.js');

const snake = new Cerebro(
	{
		dots: [],
		players: [],
		score: {}
	},
	transform,
	{
		// Options
		forceState: {
			world: {
				width: 60,
				height: 42
			},
			extraDots: 2
		}
	}
);

process.on('SIGINT', function() {
	snake.save();
	process.exit(0);
});