import { Black, AssetManager, GameObject } from 'black-engine'
import io from 'socket.io-client'
import World from './world';

const TILE_SIZE = 32

function tilePosToStagePos(pos, offset=0) {
	return {
		x: (pos.x + offset) * TILE_SIZE,
		y: (pos.y + offset) * TILE_SIZE
	}
}

export default class Game extends GameObject {
	constructor() {
		super()
	}

	onAdded() {
		this.world = new World()
		this.add(this.world)

		const socket = io.connect('http://localhost:1234')
		socket.on('update', data => {
			console.log(data)
			this.callbackGameState(data)
		})
	}

	callbackGameState(gameState) {

		// Resize stage
		const width = gameState.world.width * TILE_SIZE
		const height = gameState.world.height * TILE_SIZE
		Black.stage.setSize(width, height)

		// Update world
		this.world.callbackGameState(gameState)
	}
}

export {
	TILE_SIZE,
	tilePosToStagePos
}