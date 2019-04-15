const Cerebro = require('./core.js');
const transform = require('./snake.js');

const dummy = (state, data) => {
	console.log('this is processing');
	return data;
};

const c = new Cerebro({
	world: {
		width: 20,
		height: 15
	},
	extraDots: 100,
	dots: [],
	players: []
}, transform, 2500);
