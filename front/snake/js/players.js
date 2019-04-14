import { Graphics, GameObject, TextField } from 'black-engine'
import { getRandomColor } from './utils'
import { TILE_SIZE, tilePosToStagePos } from './game'

class Player extends GameObject {
	constructor() {
		super()

		this.headColor = getRandomColor('bright')
		this.bodyColor = getRandomColor('dark')
	}

	onAdded() {
		this.g = new Graphics()
		this.add(this.g)
	}

	updatePlayer(player) {
		const g = this.g

		g.clear()

		for(let i = 0; i < player.body.length; i++) {
			const pos = tilePosToStagePos(player.body[i])
			g.beginPath()
			g.roundedRect(pos.x, pos.y, TILE_SIZE*0.9, TILE_SIZE*0.9, TILE_SIZE/5)
			g.fillStyle(i === 0 ? this.headColor : this.bodyColor)
			g.fill()
		}
	}
}

export default class Players extends GameObject {
	constructor() {
		super()

		this.playersGameObject = {}
	}

	updatePlayers(players) {

		// Manage players
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
	}
}