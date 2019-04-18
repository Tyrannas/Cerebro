function clientWrapper(name_, loop_, host='http://213.32.64.83:42000') {
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

		socket.emit('input', loop_(state, myName));
	});
}

module.exports = clientWrapper