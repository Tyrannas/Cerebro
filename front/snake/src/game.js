import { Black, AssetManager, GameObject, Graphics } from 'black-engine'
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
		this.g = this.addChild(new Graphics())
		this.world = this.addChild(new World())
	}

	callbackGameState(gameState) {

		// Resize stage
		const width = gameState.world.width * TILE_SIZE
		const height = gameState.world.height * TILE_SIZE
		Black.stage.setSize(width, height)

		// Draw walls
		const g = this.g
		g.clear()
		g.beginPath();
		const size = TILE_SIZE*0.1
		g.lineStyle(size, 0x999999);
		g.rect(size/2, size/2, width-size, height-size);
		g.stroke();

		// Update world
		this.world.callbackGameState(gameState)
	}
}

export {
	TILE_SIZE,
	tilePosToStagePos
}