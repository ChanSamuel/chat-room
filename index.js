const express = require('express');
const SERVER_PORT = process.env.PORT || 3000; // Use the configured port if it exists, otherwise use port 3000.
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs')
const path = require('path')

// ========================= CONFIGURING MIDDLEWARE FUNCTIONS ========================= 
// These are functions which mutate the request/response objects in some way according to their purpose.
// One of the main purposes of this is to allow us to access parsed versions of the request data (e.g. req.body.username). 

// Form data parsing middleware.
app.use(express.urlencoded({extended: false}));

// Static file serving middleware. Need this otherwise filepaths on the client-side will not work as intended.
app.use(express.static(__dirname));


// ========================= CONFIGURING ROUTES =========================

let usernames = new Set([]); // Store all the taken usernames.

// Configure the home route to the home.html page.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/login.html');
})

app.post('/', (req, res) => {
    let userName = req.body.username;

    // Reject empty usernames.
    if (userName === "") {
        let reason = "Username cannot be empty.";
        console.log(reason);

        let data = fs.readFileSync(path.resolve(__dirname, "client/login-invalid.html"), "utf-8");
        data = data.replace("{REASON}", reason);

        res.send(data);
        return;
    }

    // Reject duplicate usernames.
    if (usernames.has(userName)) {
        let reason = "Username is already taken.";
        console.log(reason);

        let data = fs.readFileSync(path.resolve(__dirname, "client/login-invalid.html"), "utf-8");
        data = data.replace("{REASON}", reason);

        res.send(data);
        return;
    }

    res.redirect("/home");
})

app.get("/home", (req, res) => {
    res.sendFile(__dirname + '/client/home.html');
});

// ========================= CONFIGURING SOCKETS =========================

// Begin listening for socket connections.
io.on('connection', socket => {
    console.log('User has connected on socket ' + socket.id);

    // Acknowledge connection success by sending a 'connected' event via this socket connection.
    socket.send('connected');

    let username = socket.handshake.query["username"];
    usernames.add(username); // Add this username to the set of taken usernames.

    // Configure a listener to this socket which listens for chat messages. 
    socket.on('message', msg => {
        console.log(username + ":\n" + msg);
    });

    // Configure a listener to this socket which listens for client disconnect.
    socket.on('disconnect', () => {
        console.log(username + ' has disconnected.');
    });
});

// Set the HTTP server to begin listening for requests.
server.listen(SERVER_PORT);
console.log('Listening on port ' + SERVER_PORT);
