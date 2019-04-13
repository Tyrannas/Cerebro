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
	UP: 'UP',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT',
}

function transform({state}, inputs){
	let newState = {}
	const playersToInit = new Set()
	for (const [id, blocks] of Object.entries(players)) {
  		if(blocks.length === 0){
  			playersToInit.add(id)
  		}
  		else {
  			const directionX = blocks[0].x - blocks[1].x
  			const directionY = blocks[0].y - blocks[1].y
  			const filtered = directions.filter()
  			const direction =  
  		}
	}
}