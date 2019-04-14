import { GameObject } from 'black-engine'
import Players from './players';
import Dots from './dots';

export default class World extends GameObject {
	constructor() {
		super()
	}

	onAdded() {
		this.players = new Players()
		this.add(this.players)

		this.dots = new Dots()
        this.add(this.dots)
		
		// doesnt work now
        this.on('playerSummary', playerSummary => {
            console.log(playerSummary)
        })
	}

	callbackGameState(gameState) {
		this.players.updatePlayers(gameState.players)
		this.dots.updateDots(gameState.dots)
	}
}
