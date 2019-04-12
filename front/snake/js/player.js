import { Graphics, GameObject } from 'black-engine'
import { TILE_SIZE } from './game'

export default class Player extends GameObject {
	constructor() {
		super()

		this.headColor = parseInt((Math.random()*0xFFFFFF<<0).toString(16), 16)
		this.bodyColor = parseInt((Math.random()*0xFFFFFF<<0).toString(16), 16)
	}

	onAdded() {
		this.g = new Graphics()
		this.add(this.g)
	}

	updateBody(body) {
		const g = this.g

		g.clear()

		for(let i = 0; i < body.length; i++) {
			const pos = this._getPos(body[i])
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