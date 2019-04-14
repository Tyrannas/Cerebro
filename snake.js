const _ = require('lodash')
/***
State de la forme:
{
	width: int,
	height: int,
	players: {id:[{x: int, y: int}]}
	dots: [{x:int, y:int}]
}
***/
const directions = {
	UP: {name: 'UP', opposite: 'DOWN', x:0, y:-1},
	DOWN: {name: 'DOWN' , opposite: 'UP', x:0, y:1},
	LEFT: {name:'LEFT', opposite: 'RIGHT', x:-1, y:0},
	RIGHT: {name: 'RIGHT', opposite: 'LEFT',x:1, y:0},
}

function findFreeSpot(state){
	const x_seed = _.random(0, state.width)
	const y_seed = _.random(0, state.height)
	for(let y = y_seed; y < state.height; y++){
		for(let x = x_seed; x < state.width; x++){
			let post = {x: x, y: y}
			if( _.find(state.players, pos)){
				continue
			}
			else {
				return pos
			}
		}
	}
	for(let y = 0; y < y_seed; y++){
		for(let x = 0; x < x_seed; x++){
			let post = {x: x, y: y}
			if( _.find(state.players, pos)){
				continue
			}
			else {
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
	const playersToInit = new Set()
	for (const [id, blocks] of Object.entries(state.players)) {
  		if(blocks.length === 0){
  			playersToInit.add(id)
  			delete state.players[id]
  			continue
  		}
  		// update positions
  		let newBlocks = blocks
  		const dir = undefined

  		if(blocks.length > 1)
  			dir = computeDirection(blocks)
		if(dir && inputs[id] === directions[dir].opposite){
			//position invalid
			newBlocks.unshift({x: blocks[0].x + directions[dir].x, y: blocks[0].y + directions[dir].y}).pop()
		}
		else{
			newBlocks.unshift({x: blocks[0].x + directions[inputs[id]].x, y: blocks[0].y + directions[inputs[id]].y}).pop()
		}
		state.players[id] = newBlocks

		// update length
		state.dots.forEach((dot,index) => {
			if(newBlocks[0].x === dot.x && newBlocks[0].y === dot.y){
				state.dots.splice(index, 1)
			}
		})
	}

	// check for collisions
	for (const [id, blocks] of Object.entries(state.players)) {
		const head = blocks[0]
		for (const [id2, blocks2] of Object.entries(state.players)) {
			// collision with other players or with the walls ? 
			if((id !== id2 && _.find(blocks2, head)) || head.x === state.width || head.y === state.height || head.x < 0 || head.y < 0){
				playersToInit.add(id)
			}
		}
	}

	playersToInit.forEach(player => {
		// once all collisions are done, remove the "dead" players
		delete state.players[player]
	})
	// update players to init
	playersToInit.forEach(player => {
		state.players[player] = findFreeSpot(state)
	})

	for(i = 0; i < Object.keys(state.players).length - state.dots.length; i++){
		state.dots.push(findFreeSpot(state))
	}

	return state
}

module.exports = transformState