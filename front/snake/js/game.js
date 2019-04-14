import { Black, AssetManager, GameObject } from 'black-engine'
import World from './world';

const TILE_SIZE = 32

function tilePosToStagePos(pos) {
	return {
		x: (pos.x + 0.5) * TILE_SIZE,
		y: (pos.y + 0.5) * TILE_SIZE
	}
}

export default class Game extends GameObject {
	constructor() {
		super()
	}

	onAdded() {
		this.world = new World()
		this.add(this.world)

		this.callbackGameState({
			world: {
				width: 50,
				height: 20
			},
			players: [
				{
					name: 'alexis',
					body: [
						{x: 10, y: 10},
						{x: 10, y: 11},
						{x: 10, y: 12},
						{x: 10, y: 13}
					]
				},{
					name: 'felix',
					body: [
						{x: 20, y: 12},
						{x: 21, y: 12},
						{x: 22, y: 12}
					]
				}
			]
		})
		this.callbackGameState({
			world: {
				width: 50,
				height: 20
			},
			players: [
				{
					name: 'alexis',
					body: [
						{x: 11, y: 10},
						{x: 11, y: 11},
						{x: 11, y: 12},
						{x: 11, y: 13}
					]
				},{
					name: 'felix',
					body: [
						{x: 20, y: 12},
						{x: 21, y: 12},
						{x: 22, y: 12},
						{x: 23, y: 12},
						{x: 24, y: 12}
					]
				}
			]
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