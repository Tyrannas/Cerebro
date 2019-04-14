const Cerebro = require('./core.js');
const transform = require('./snake.js');

const dummy = (state, data) => {
	console.log('this is processing');
	return data;
};

const c = new Cerebro({width: 500, height: 500, dots:[], players:{}}, transform, 2500);
