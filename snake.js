const _ = require('lodash')

/***
State de la forme:
{
	width: int,
	height: int,
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

const DIRECTIONS = {
	UP: {name: 'UP', opposite: 'DOWN', x:0, y:-1},
	DOWN: {name: 'DOWN', opposite: 'UP', x:0, y:1},
	LEFT: {name:'LEFT', opposite: 'RIGHT', x:-1, y:0},
	RIGHT: {name: 'RIGHT', opposite: 'LEFT',x:1, y:0},
}

function posToIndex(state, pos) {
	return pos.y * state.width + pos.x
}

function findFreeSpot(state){
	const busySpots = new Set()

	for (const player of Object.values(state.players)) {
		for(const pos of player.body) {
			busySpots.add(posToIndex(state, pos))
		}
	}
	for(const dot of state.dots) {
		busySpots.add(posToIndex(state, dot.pos))
	}

	const x_seed = _.random(0, state.width-1)
	const y_seed = _.random(0, state.height-1)
	for(let y = y_seed; y < state.height; y++) {
		for(let x = x_seed; x < state.width; x++) {
			const pos = {x, y}
			if(!busySpots.has(posToIndex(state, pos))) {
				return pos
			}
		}
	}
	for(let y = 0; y < y_seed; y++) {
		for(let x = 0; x < x_seed; x++) {
			const pos = {x, y}
			if(!busySpots.has(posToIndex(state, pos))) {
				return pos
			}
		}
	}
}

function computeDirection(blocks){
	if(blocks[0].x > blocks[1].x)
		return 'RIGHT'
	if(blocks[0].x < blocks[1].x)
		return 'LEFT'
	if(blocks[0].y > blocks[1].y)
		return 'DOWN'
	if(blocks[0].y < blocks[1].y)
		return 'UP'
}

function transformState(state, inputs){
	state = _.cloneDeep(state)

	const playersToInit = new Set()

	for (const [id, player] of Object.entries(state.players)) {
		// Manage new players
  		if(!player.body) {
			playersToInit.add(id)
			delete state.players[id]
			continue
		}
		
		// Update positions
		const body = player.body

		let playerDir = inputs[id]
		if(!playerDir || !DIRECTIONS[playerDir]) {
			playerDir = 'RIGHT'
		}

		let dir
  		if(body.length > 1) {
			dir = computeDirection(body)
		}

		if(dir && playerDir === DIRECTIONS[dir].opposite) {
			// Position invalid, continue forward
			body.unshift({x: body[0].x + DIRECTIONS[dir].x, y: body[0].y + DIRECTIONS[dir].y})
		} else {
			body.unshift({x: body[0].x + DIRECTIONS[playerDir].x, y: body[0].y + DIRECTIONS[playerDir].y})
		}

		// Find collision with dot
		let eatDot = false
		for(const dot of state.dots) {
			if(body[0].x === dot.x && body[0].y === dot.y) {
				state.dots.splice(index, 1)
				eatDot = true
				break
			}
		}
		// If no dot is eaten, delete the last body part
		if(!eatDot) {
			body.pop()
		}
	}

	// Check for collisions
	for (const [id, player] of Object.entries(state.players)) {
		const head = player.body[0]

		// Collision with the walls
		if(head.x >= state.width || head.y >= state.height || head.x < 0 || head.y < 0) {
			playersToInit.add(id)
			continue
		}

		// Collision with others players
		for (const [id2, player2] of Object.entries(state.players)) {
			if(id === id2) {
				continue
			}
			for(const part of player.body) {
				if(head.x === part.x && head.y === part.y) {
					playersToInit.add(id)
					break
				}
			}
		}
	}

	// Update players to init
	playersToInit.forEach(playerId => {
		state.players[playerId] = {
			name: playerId, // TODO get name
			body: [findFreeSpot(state)]
		}
	})

	for(i = 0; i < Object.keys(state.players).length - state.dots.length; i++){
		state.dots.push({
			pos: findFreeSpot(state)
		})
	}

	return state
}

module.exports = transformState