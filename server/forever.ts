import forever = require('forever-monitor');

/**
 * Start a forever process.
 * It restarts the server if it crashes or is closed unexpectedly
 */

var child = new (forever.Monitor)('bin/index.js', {
    max: Number.POSITIVE_INFINITY,
    silent: false
});

child.on('exit', function () {
    console.log('Server has been closed');
});

child.start();