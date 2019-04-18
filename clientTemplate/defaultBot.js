const _ = require('lodash');
const clientWrapper = require('./wrapper')

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
