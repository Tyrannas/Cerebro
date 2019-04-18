const _ = require('lodash');
const clientWrapper = require('./wrapper')


function manhattanDist(pos1, pos2) {
	return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function posToIndex(state, pos) {
	return pos.y * state.world.width + pos.x;
}

const DIRECTIONS = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 }
};
function getPosWithDir(pos, dir) {
	return {
		x: pos.x + DIRECTIONS[dir].x,
		y: pos.y + DIRECTIONS[dir].y,
	}
}

clientWrapper('defaultBot', (state, myName) => {

	// Find me
	const me = _.find(state.players, { name: myName });
	const body = me.body;
	const head = body[0];

	// Find nearest dot
	const nearestDot = _.minBy(state.dots, (dot) => manhattanDist(dot.pos, head));

	// Find busy spots
	const busySpots = new Set();
	for (const player of state.players) {
		for (const pos of player.body) {
			busySpots.add(posToIndex(state, pos));
		}
	}

	// Compute best 
	const diffX = nearestDot.pos.x - head.x;
	const diffY = nearestDot.pos.y - head.y;
	const choices = []
	if (Math.abs(diffX) > Math.abs(diffY)) {
		choices.push(diffX > 0 ? 'RIGHT' : 'LEFT')
		choices.push(diffY > 0 ? 'DOWN' : 'UP')
		choices.push(diffX <= 0 ? 'RIGHT' : 'LEFT')
		choices.push(diffY <= 0 ? 'DOWN' : 'UP')
	} else {
		choices.push(diffY > 0 ? 'DOWN' : 'UP')
		choices.push(diffX > 0 ? 'RIGHT' : 'LEFT')
		choices.push(diffY <= 0 ? 'DOWN' : 'UP')
		choices.push(diffX <= 0 ? 'RIGHT' : 'LEFT')
	}
	for(const dir of choices) {
		const newPos = getPosWithDir(head, dir)
		if(newPos.x >= 0 && newPos.y >= 0 && newPos.x < state.world.width && newPos.y < state.world.height) {
			if(!busySpots.has(posToIndex(state, newPos))) {
				return dir;
			}
		}
	}
});
