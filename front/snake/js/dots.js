import { Graphics, GameObject } from 'black-engine'
import { TILE_SIZE, tilePosToStagePos } from './game'

class Dot extends GameObject {
	constructor() {
		super()

		this.color = 0xffffff
	}

	onAdded() {
		this.g = new Graphics()
		this.add(this.g)
	}

	updateDot(dot) {
		const g = this.g

		g.clear()
		const pos = tilePosToStagePos(dot.pos)
		g.beginPath()
		g.circle(pos.x, pos.y, TILE_SIZE*0.45)
		g.fillStyle(this.color)
		g.fill()
	}
}

export default class Dots extends GameObject {
	constructor() {
		super()

		this.name = 'dots'
	}

	updateDots(dots) {
		while(this.numChildren < dots.length) {
			this.addChild(new Dot())
		}
		while(this.numChildren > dots.length) {
			this.removeChildAt(this.numChildren-1)
		}

		for(let i = 0; i < dots.length; i++) {
			this.getChildAt(i).updateDot(dots[i])
		}
	}
}