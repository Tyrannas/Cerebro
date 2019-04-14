const io = require('socket.io');

class Cerebro {
	constructor(initialState, transformFunction, tickDuration = 500, port = 1234) {
		this.transformFunction = transformFunction;
		this.state = initialState;
		this.players = new Set();
		this.inputs = {};
		this.server = io.listen(port);
		console.log('listening on port: ' + port);
		this.start();
	}

	onConnect(player) {
		console.info(`Client connected [id=${player.id}]`);
		this.players.add(player.id);
		this.state[players] = []
		player.on('input', (data) => {
			this.inputs[player.id] = data;
		});
	}

	generateNewState() {
		this.inputs = {};
		console.log('on genere un new state' + this.tickDuration)
		const newState = this.transformFunction(this.state, this.inputs);
		this.server.emit('update', newState);
		this.state = newState;
	}

	start() {
		this.server.on('connection', this.onConnect.bind(this));
		setInterval(() => this.generateNewState(), this.tickDuration);
	}
}

module.exports = Cerebro;
