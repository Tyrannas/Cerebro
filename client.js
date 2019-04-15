const _ = require('lodash');

clientWrapper('defaultBot', (state, myName) => {
	function manhattanDist(pos1, pos2) {
		return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
	}

	// Find me
	const me = _.find(state.players, { name: myName });
	const body = me.body;
	const head = body[0];

	const nearestDot = _.minBy(state.dots, (dot) => manhattanDist(dot.pos, head));

	const diffX = nearestDot.pos.x - head.x;
	const diffY = nearestDot.pos.y - head.y;
	if (Math.abs(diffX) > Math.abs(diffY)) {
		return diffX > 0 ? 'RIGHT' : 'LEFT';
	} else {
		return diffY > 0 ? 'DOWN' : 'UP';
	}
});

clientWrapper('defaultBot2', (state, myName) => {
	function manhattanDist(pos1, pos2) {
		return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
	}

	// Find me
	const me = _.find(state.players, { name: myName });
	const body = me.body;
	const head = body[0];

	const nearestDot = _.minBy(state.dots, (dot) => manhattanDist(dot.pos, head));

	const diffX = nearestDot.pos.x - head.x;
	const diffY = nearestDot.pos.y - head.y;
	if (Math.abs(diffX) > Math.abs(diffY)) {
		return diffX > 0 ? 'RIGHT' : 'LEFT';
	} else {
		return diffY > 0 ? 'DOWN' : 'UP';
	}
});

////////////////////////////////////////////////////////////////////////////////////
// TODO externalize

function clientWrapper(name_, loop_) {
	const io = require('socket.io-client');

	const socket = io.connect('http://localhost:1234');

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
