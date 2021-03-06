import { Black, CanvasDriver, StageScaleMode, Input, Renderer } from 'black-engine'
import io from 'socket.io-client'
import Mustache from 'mustache'
import _ from 'lodash'

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

Renderer.skipUnchangedFrames = true

// Generate template
const template = document.getElementById('templateScores').innerHTML
Mustache.parse(template)

// Manage color
const playersColor = {}

const socket = io.connect('http://' + window.location.hostname + ':42000')
socket.on('update', data => {
    // Update snake view
    Black.instance.mGameObject.callbackGameState(data)

    // Update scores view
    const playersUnsorted = []
    for(const player of data.players) {
        const { best, current, history } = data.scores[player.name]
        const { name } = player
        playersUnsorted.push({
            best,
            current,
            name,
            color: '#' + _.padStart(player.color.toString(16), 6, '0'),
            avgLength: history.length,
            avg: history.length > 0 ? _.mean(history) : '-',
            last: history.length > 0 ? history[history.length - 1] : '-'
        })
    }
    const players = _.sortBy(playersUnsorted, player => -player.best)
    players.forEach((obj, i) => obj.place = i + 1)

    document.getElementById('scores').innerHTML = Mustache.render(template, { players })
})
