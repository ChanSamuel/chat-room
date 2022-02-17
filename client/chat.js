// Open a socket to the host server.
const socket = io('ws://localhost:3000');


var form = document.getElementById('chatbox-form');
var textbox = document.getElementById('text-box');

form.addEventListener('submit', (e) => {

    // Cancel the form submission operation so that the page doesn't reload upon submitting the message.
    e.preventDefault();

    // If the text box is not empty, send the message to the server via the socket.
    if (textbox.value) {
        socket.emit('message', textbox.value);
        textbox.value = '';
    }

});
