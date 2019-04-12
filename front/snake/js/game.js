import { Black, AssetManager, GameObject } from 'black-engine'
import Player from './player'

const TILE_SIZE = 32

export default class Game extends GameObject {
	constructor() {
		super()

		this.playersGameObject = {}
	}

	onAdded() {
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
						{x: 22, y: 12},
						{x: 23, y: 12},
						{x: 24, y: 12}
					]
				}
			]
		})
	}

	callbackGameState(gameState) {

		// Manage world
		const world = gameState.world
		const width = world.width * TILE_SIZE
		const height = world.height * TILE_SIZE
		// if(Black.stage.width !== width || Black.stage.height !== height) { // does not work
		console.log(Black.stage)
		Black.stage.setSize(width, height)
		// }

		// Manage players
		const playersName = new Set()
		for(const player of gameState.players) {
			const name = player.name
			playersName.add(name)

			let playerGameObject = this.playersGameObject[name]
			if(!playerGameObject) {
				playerGameObject = new Player()
				this.addChild(playerGameObject)
			}

			playerGameObject.updateBody(player.body)
		}

		// Clear dead players
		for(const name in this.playersGameObject) {
			if(!playersName.has(name)) {
				this.removeChild(this.playersGameObject[name])
				delete this.playersGameObject[name]
			}
		}
		
	}
}

export {
	TILE_SIZE
}