const io = require('socket.io-client');
const socket = io.connect('http://localhost:1234');
socket.on('update', data => {
	console.log(data)
	socket.emit('LEFT')
})