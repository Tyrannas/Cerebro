import { Graphics, GameObject, TextField } from 'black-engine'
import { getRandomColor } from './utils'
import { TILE_SIZE } from './game'

export default class Player extends GameObject {
	constructor() {
		super()

		this.textFields = []
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
			const pos = this._getPos(player.body[i])
			g.beginPath()
			g.roundedRect(pos.x, pos.y, TILE_SIZE*0.9, TILE_SIZE*0.9, TILE_SIZE/5)
			g.fillStyle(i === 0 ? this.headColor : this.bodyColor)
			g.fill()
		}
	}

	_getPos(pos) {
		return {
			x: (pos.x + 0.5) * TILE_SIZE,
			y: (pos.y + 0.5) * TILE_SIZE
		}
	}
}