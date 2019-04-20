
# AI Battle - Snake

## Game Rules

You have a snake. You can control your snake by sending `TOP`, `RIGHT`, `DOWN` or `LEFT`.

The game is infinite: if you die, you respawn automatically.

Origin of coordinates is at top left.

Tick duration currently varies from 100ms to 1000ms. If all players have sent their inputs for the current state,
a game tick automatically occured, with a minimum of 100ms. If the server have been waiting for 1000ms, the player
is killed for inactivity.

## Dev

### The server

The UI is available at http://213.32.64.83:42080/ .

The webscoket server is listening at `213.32.64.83:42000`.

### How to dev

First, you need to install dependencies with `npm install`.

In this folder, you have `minimal.js` from which you can start your bot. Inside, modify `YOUR_NAME` by a string containing your pseudo.
Then just run:

̀```node --inspect minimal.js```

And that's it. You will be able to see your bot and the UI.

#### --inspect
Note: The `--inspect` parameter allow you to debug easier. In Google Chrome, go to `chrome://inspect` to debug your bot.

### How to deploy

TODO
