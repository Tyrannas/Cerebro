const io = require('socket.io-client')

const socket = io.connect('http://localhost:1234')

let myName

socket.on('connect', data => {
	socket.emit('name', 'defaultBot')
})

socket.on('name', data => {
	console.log('My name is', data)
	myName = data
})

socket.on('update', data => {
	// Not in the game
	if(!myName) {
		return
	}

	socket.emit('input', 'UP')
})