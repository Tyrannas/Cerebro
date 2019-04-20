const _ = require('lodash');
const randomColor = require('randomcolor')

/***
State de la forme:
{
	world: {
		width: int,
		height: int
	},
	players: {
		id: {
			name: string
			body: [{x: int, y: int}]
		}
	},
	dots: [
		{
			pos: {x:int, y:int}
		}
	]
	// TODO add walls
}
***/

function getRandomColor() {
	const rgb = randomColor({ luminosity: 'dark', format: 'rgbArray' })
	return rgb[0] * 256*256 + rgb[1] * 256 + rgb[2]
}

const DIRECTIONS = {
	UP: { name: 'UP', opposite: 'DOWN', x: 0, y: -1 },
	DOWN: { name: 'DOWN', opposite: 'UP', x: 0, y: 1 },
	LEFT: { name: 'LEFT', opposite: 'RIGHT', x: -1, y: 0 },
	RIGHT: { name: 'RIGHT', opposite: 'LEFT', x: 1, y: 0 }
};

function posToIndex(state, pos) {
	return pos.y * state.world.width + pos.x;
}

function findFreeSpot(state) {
	const busySpots = new Set();

	for (const player of state.players) {
		for (const pos of player.body) {
			busySpots.add(posToIndex(state, pos));
		}
	}
	for (const dot of state.dots) {
		busySpots.add(posToIndex(state, dot.pos));
	}

	const x_seed = _.random(0, state.world.width - 1);
	const y_seed = _.random(0, state.world.height - 1);
	for (let y = y_seed; y < state.world.height; y++) {
		for (let x = x_seed; x < state.world.width; x++) {
			const pos = { x, y };
			if (!busySpots.has(posToIndex(state, pos))) {
				return pos;
			}
		}
	}
	for (let y = 0; y < y_seed; y++) {
		for (let x = 0; x < x_seed; x++) {
			const pos = { x, y };
			if (!busySpots.has(posToIndex(state, pos))) {
				return pos;
			}
		}
	}
}

function computeDirection(blocks) {
	if (blocks[0].x > blocks[1].x) return 'RIGHT';
	if (blocks[0].x < blocks[1].x) return 'LEFT';
	if (blocks[0].y > blocks[1].y) return 'DOWN';
	if (blocks[0].y < blocks[1].y) return 'UP';
}

function transformState(state, inputs) {
	state = _.cloneDeep(state);

	for (const player of state.players) {
		// Init color
		if (!player.color) {
			player.color = getRandomColor();
		}

		// Create empty body for new players
		if (!player.body) {
			player.body = [];
			continue;
		}

		// Update positions
		const body = player.body;

		let playerDir = inputs[player.name];

		let dir;
		if (body.length > 1) {
			dir = computeDirection(body);
		}

		if (!playerDir || !DIRECTIONS[playerDir]) {
			playerDir = dir ? dir : 'RIGHT';
		}

		if (dir && playerDir === DIRECTIONS[dir].opposite) {
			// Position invalid, continue forward
			body.unshift({ x: body[0].x + DIRECTIONS[dir].x, y: body[0].y + DIRECTIONS[dir].y });
		} else {
			body.unshift({ x: body[0].x + DIRECTIONS[playerDir].x, y: body[0].y + DIRECTIONS[playerDir].y });
		}

		// Find collision with dot
		let eatDot = false;
		for (let i = 0; i < state.dots.length; i++) {
			const dot = state.dots[i];
			if (body[0].x === dot.pos.x && body[0].y === dot.pos.y) {
				state.dots.splice(i, 1);
				eatDot = true;
				break;
			}
		}
		// If no dot is eaten, delete the last body part
		if (!eatDot) {
			body.pop();
		}
	}

	// Check for collisions
	checkCollision: for (const player of state.players) {
		// Exclude empty players
		if (player.body.length === 0) {
			continue;
		}

		const head = player.body[0];

		// Collision with the walls
		if (head.x >= state.world.width || head.y >= state.world.height || head.x < 0 || head.y < 0) {
			player.body = [];
			continue;
		}

		// Collision with others players
		for (const player2 of state.players) {
			for (const part of player2.body) {
				if (head.x === part.x && head.y === part.y && head !== part) {
					player.body = [];
					continue checkCollision;
				}
			}
		}
	}

	// Set body to empty players
	for (const player of state.players) {
		if (player.body.length === 0) {
			player.body.push(findFreeSpot(state));
		}
	}

	const nbDotsToAdd = Object.keys(state.players).length - state.dots.length + (state.extraDots || 0);
	for (i = 0; i < nbDotsToAdd; i++) {
		state.dots.push({
			pos: findFreeSpot(state)
		});
	}

	// Compute scores
	for (const player of state.players) {
		const current = player.body.length
		const last = _.get(state.scores, [player.name, 'current'], current)
		const best = _.get(state.scores, [player.name, 'best'], 0)
		let history = _.get(state.scores, [player.name, 'history'], [])
		if(current < last) {
			// just died
			history.push(last);
		}
		state.scores[player.name] = {
			current,
			best: Math.max(best, current),
			history: history.slice(-10)
		}
	}

	return state;
}

module.exports = transformState;
