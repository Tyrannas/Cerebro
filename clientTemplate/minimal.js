const clientWrapper = require('./wrapper')

clientWrapper(YOUR_NAME, (state, myName) => {
    console.log('state', state);
    console.log('myName', myName);
    
    return 'UP'; // or 'RIGHT' or 'DOWN' or 'LEFT'
});
