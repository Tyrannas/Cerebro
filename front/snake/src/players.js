import { Graphics, GameObject, TextField } from 'black-engine'
import { TILE_SIZE, tilePosToStagePos } from './game'

class Player extends GameObject {
	constructor() {
		super()
	}

	onAdded() {
		this.g = new Graphics()
		this.add(this.g)
	}

	updatePlayer(player) {
		const g = this.g

		g.clear()

		for(let i = 0; i < player.body.length; i++) {
			const offset = Math.min(5, i) * 0.03
			const pos = tilePosToStagePos(player.body[i], offset)
			g.beginPath()
			g.roundedRect(pos.x, pos.y, TILE_SIZE*(1-2*offset), TILE_SIZE*(1-2*offset), TILE_SIZE/5)
			g.fillStyle(player.color)
			g.fill()
		}

		g.beginPath()
		for(let i = 0; i < player.body.length; i++) {
			const pos = tilePosToStagePos(player.body[i], 0.5)
			if(i === 0) {
				g.moveTo(pos.x, pos.y);
			}
			g.lineTo(pos.x, pos.y)
		}
		g.lineStyle(TILE_SIZE*0.5, player.color)
		g.stroke()
	}
}

export default class Players extends GameObject {
	constructor() {
		super()

		this.playersGameObject = {}
	}

	updatePlayers(players) {

		// // Manage players
		const playersName = new Set()
		for(const player of players) {
			const name = player.name
			playersName.add(name)

			if(!this.playersGameObject[name]) {
				this.playersGameObject[name] = new Player()
				this.addChild(this.playersGameObject[name])
			}

			this.playersGameObject[name].updatePlayer(player)
		}

		// Clear dead players
		for(const name in this.playersGameObject) {
			if(!playersName.has(name)) {
				this.removeChild(this.playersGameObject[name])
				delete this.playersGameObject[name]
			}
		}

		// Players summary
		const playerSummary = Object.entries(this.playersGameObject).map(([name, gameObject]) => {
			return {
				name,
				color: gameObject.color
			}
		})
		this.post('playerSummary', playerSummary)
	}
}