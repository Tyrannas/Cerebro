const Cerebro = require('./core.js');
// const Snake = require('./snake.js');

const dummy = (state, data) => {
	console.log('this is processing');
	return data;
};
const c = new Cerebro({}, dummy);
