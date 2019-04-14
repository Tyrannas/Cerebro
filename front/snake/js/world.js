import { Black, AssetManager, GameObject } from 'black-engine'
import { TILE_SIZE } from './game'
import Players from './players';

export default class World extends GameObject {
	constructor() {
		super()
	}

	onAdded() {
		this.players = new Players()
		this.add(this.players)
	}

	callbackGameState(gameState) {
        // Manage players
		this.players.updatePlayers(gameState.players)		
	}
}
