const _ = require('lodash');

let remote = '213.32.64.83';
if(process.argv.length > 2) {
	remote = process.argv[2];
}

function clientWrapper(name_, loop_, host='http://'+ remote +':42000') {
	const io = require('socket.io-client');

	const socket = io.connect(host);

	let myName;

	socket.on('connect', (data) => {
		socket.emit('name', name_);
	});

	socket.on('name', (data) => {
		console.log('My name is', data);
		myName = data;
	});

	socket.on('update', (state) => {
		// Not in the game
		if (!myName) {
			return;
		}
		const me = _.find(state.players, { name: myName });
		if(!me) {
			return;
		}

		socket.emit('input', loop_(state, myName));
	});
}

module.exports = clientWrapper