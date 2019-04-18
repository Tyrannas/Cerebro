import { Black, CanvasDriver, StageScaleMode, Input } from 'black-engine'
import io from 'socket.io-client'
import Game from './game'

// Game will be our starting class and rendering will be done on Canvas
const black = new Black('container', Game, CanvasDriver, [Input])

// Pause simulation when container loses focus
black.pauseOnBlur = false

// Pause simulation when page is getting hidden
black.pauseOnHide = false

// Wroom, wroom!
black.start()

// Makes stage always centered
black.stage.scaleMode = StageScaleMode.LETTERBOX

const socket = io.connect('http://' + window.location.hostname + ':1234')
socket.on('update', data => {
    console.log(data)
    Black.instance.mGameObject.callbackGameState(data)
})
