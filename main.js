const Core = require('./core.js');

const dummy = (state, data) => {
	console.log('this is processing');
	return data;
};
const c = new Core({}, dummy);
