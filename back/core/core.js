const fs = require('fs')
const _ = require('lodash')
const io = require('socket.io')

class Cerebro {
	constructor(initialState, transformFunction, {
		minTickDuration = 100,
		maxTickDuration = 1000,
		port = 42000,
		saveName = 'default',
		saveDuration = 10000,
		forceState = {}
	}) {
		this.saveFileName = saveName + '.save'
		this.saveDuration = saveDuration
		this.state = _.assign(this.getSave(initialState), forceState)

		this.transformFunction = transformFunction
		
		this.minTickDuration = minTickDuration
		this.maxTickDuration = maxTickDuration

		this.inputs = {}
		this.playersToWait = new Set()

		this.server = io.listen(port)
		console.log('listening on port: ' + port)
		this.start()
	}

	onConnect(player) {
		console.info(`Client connected [id=${player.id}]`)
		player.once('name', (name) => {
			console.info(`Player connected: ${name}`)

			// Manage conflicts names
			if(this.mapPlayers[name]) {
				let cnt = 1
				while(true) {
					cnt++
					const newName = name + ' (' + cnt + ')'
					if(this._getPlayerIndex(newName) < 0) {
						name = newName
						break
					}
				}
			} else {
				this.mapPlayers[name] = player.id
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
				this.playersToWait.delete(name)

				// Call next state if it was the last player we were waiting for
				if(this.playersToWait.size == 0) {
					const diff = Date.now() - this.lastStateTime
					const delay = Math.max(this.minTickDuration - diff, 0)
					clearTimeout(this.timeoutNewState)
					this.timeoutNewState = setTimeout(() => this.generateNewState(), delay)
				}
			})
			
			// When the player disconnects, remove it from state
			player.on('disconnect', () => {
				this.removePlayer(name)
			})
		})
	}

	generateNewState() {
		// Remove all players that does not send input
		for(const name of this.playersToWait) {
			this.removePlayer(name)
		}

		// Compute new state
		this.state = this.transformFunction(this.state, this.inputs)
		this.lastStateTime = Date.now()

		// Reset players inputs
		this.inputs = {}
		this.playersToWait = new Set(_.map(this.state.players, 'name'))

		// Watchdog if a player does not send an input
		this.timeoutNewState = setTimeout(() => this.generateNewState(), this.maxTickDuration)

		// Send the new state to all
		this.server.emit('update', this.state)
	}

	start() {
		this.mapPlayers = {}

		this.generateNewState()
		this.save()
		this.server.on('connection', this.onConnect.bind(this))
		setInterval(() => this.save(), this.saveDuration)
	}

	removePlayer(name) {
		delete this.mapPlayers[name]
		this.playersToWait.delete(name)
		const index = this._getPlayerIndex(name)
		if(index >= 0) {
			this.state.players.splice(index, 1)
		}
	}

	_getPlayerIndex(name) {
		return _.findIndex(this.state.players, { name })
	}

	getSave(defaultSave) {
		try {
			return JSON.parse(fs.readFileSync(this.saveFileName).toString())
		} catch {
			return defaultSave
		}
	}

	save() {
		fs.writeFileSync(this.saveFileName, JSON.stringify(this.state))
	}
}

module.exports = Cerebro
