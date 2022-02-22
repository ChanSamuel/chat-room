if (window.name === undefined) {
    throw new Error("Username not found, connection to chatroom not made.");
}

// Open a socket to the host server. The full url we are passing in is something like: ws://localhost:3000 or ws://example.com:3000
const socket = io('ws://' + window.location.host, {query: "username=" + window.name});

let textbox = document.getElementById('text-box');
let button = document.getElementById('send-button');

// On enter press, send the message.
textbox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // If the text box is not empty, send the message to the server via the socket.
        if (textbox.value) {
            let msg = (' ' + textbox.value).slice(1); // Deep copy the string.
            socket.emit('message', msg);
            textbox.value = '';
        }
    }
    return false;
});

// On send button press, send the message.
button.onclick = () => {
    // If the text box is not empty, send the message to the server via the socket.
    if (textbox.value) {
        let msg = (' ' + textbox.value).slice(1); // Deep copy the string.
        socket.emit('message', msg);
        textbox.value = '';
    }
    return false;
};
