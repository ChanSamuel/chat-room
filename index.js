const express = require('express');
const SERVER_PORT = process.env.PORT || 3000; // Use the configured port if it exists, otherwise use port 3000.
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Configure the home route to the home.html page.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/home.html');
})

// Need this otherwise filepaths on the client-side will not work as intended.
app.use(express.static(__dirname));

// Begin listening for socket connections.
io.on('connection', socket => {
    console.log('A user has connected.');

    // Acknowledge connection success by sending a 'connected' event via this socket connection.
    socket.send('connected');

    // Configure a listener to this socket which listens for chat messages. 
    socket.on('message', (msg) => {
        console.log(msg);
    });

    // Configure a listener to this socket which listens for client disconnect.
    socket.on('disconnect', () => {
        console.log('A user has disconnected');
    });
});

// Set the HTTP server to begin listening for requests.
server.listen(SERVER_PORT);
console.log('Listening on port ' + SERVER_PORT);
