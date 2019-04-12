const io = require('socket.io');

class Core {
	constructor(initialState, transformFunction, defaultAction = undefined, tickDuration = 500, port = 1234) {
		this.transformFunction = transformFunction;
		this.defaultAction = defaultAction;
		this.state = initialState;
		this.players = new Set();
		this.inputs = {};
		this.server = io.listen(port);
		console.log('listening on port: ' + port);
	}

	onConnect(player) {
		console.info(`Client connected [id=${player.id}]`);
		this.players.add(player.id);

		player.on('input', (data) => {
			this.inputs[player.id] = data;
		});
	}

	generateNewState() {
		// wait for all players input during tick duration
		//TODO : gérer les ticks

		const newState = this.transformFunction(this.state, this.inputs);
		this.server.broadCast('update', newState);
		this.state = newState;
	}

	start() {
		this.server.on('connection', this.onConnect.bind(this));
		while (true) {
			generateNewState();
		}
	}
}

module.exports = Core;
