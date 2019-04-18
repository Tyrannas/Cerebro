const _ = require('lodash')
const io = require('socket.io')

class Cerebro {
	constructor(initialState, transformFunction, tickDuration = 500, port = 42000) {
		this.transformFunction = transformFunction
		this.tickDuration = tickDuration
		this.state = initialState
		this.inputs = {}
		this.server = io.listen(port)
		console.log('listening on port: ' + port)
		this.start()
	}

	onConnect(player) {
		console.info(`Client connected [id=${player.id}]`)
		player.once('name', (name) => {
			console.info(`Player connected: ${name}`)

			// Manage conflicts names
			if(this._getPlayerIndex(name) >= 0) {
				let cnt = 1
				while(true) {
					cnt++
					const newName = name + ' (' + cnt + ')'
					if(this._getPlayerIndex(newName) < 0) {
						name = newName
						break
					}
				}
			}
			
			// Send player its name
			player.emit('name', name)
			
			// Add player to state
			this.state.players.push({
				name
			})

			// When an input is received, put it in states object
			player.on('input', (data) => {
				this.inputs[name] = data
			})
			
			// When the player disconnects, remove it from state
			player.on('disconnect', () => {
				const index = this._getPlayerIndex(name);
				if(index >= 0) {
					this.state.players.splice(this._getPlayerIndex(name), 1)
				}
			})
		})
	}

	generateNewState() {
		this.state = this.transformFunction(this.state, this.inputs)
		this.inputs = {}
		this.server.emit('update', this.state)
	}

	start() {
		this.server.on('connection', this.onConnect.bind(this))
		setInterval(() => this.generateNewState(), this.tickDuration)
	}

	_getPlayerIndex(name) {
		return _.findIndex(this.state.players, { name })
	}
}

module.exports = Cerebro
