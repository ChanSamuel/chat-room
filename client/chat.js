if (window.name === undefined) {
    throw new Error("Username not found, connection to chatroom not made.");
}

// Open a socket to the host server. The full url we are passing in is something like: ws://localhost:3000 or ws://example.com:3000
const socket = io('ws://' + window.location.host, {query: "username=" + window.name});

let messages = document.getElementById("messages");

function appendMessage(username, msg, isUser) {
    let item = document.createElement("li");
    let usernameDiv = document.createElement("div");
    let msgDiv = document.createElement("div");

    usernameDiv.textContent = username + ":";
    msgDiv.textContent = msg;

    if (isUser) {
        usernameDiv.setAttribute("id", "user-name");
        msgDiv.setAttribute("id", "user-msg");
    }

    item.appendChild(usernameDiv);
    item.appendChild(msgDiv);
    messages.appendChild(item);
}

// Configuring the socket.
socket.on("chat msg", (username, msg) => {
    appendMessage(username, msg, false);
});

let textbox = document.getElementById('text-box');
let button = document.getElementById('send-button');

// On enter press, send the message.
textbox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // If the text box is not empty, send the message to the server via the socket.
        if (textbox.value) {
            let msg = (' ' + textbox.value).slice(1); // Deep copy the string.
            appendMessage(window.name, msg, true); // Append the message to the client's own page.
            socket.emit('message', msg); // Send the message to other clients.
            textbox.value = '';
        }
    }
});

// On send button press, send the message.
button.onclick = () => {
    // If the text box is not empty, send the message to the server via the socket.
    if (textbox.value) {
        let msg = (' ' + textbox.value).slice(1); // Deep copy the string.
        appendMessage(window.name, msg, true); // Append the message to the client's own page.
        socket.emit('message', msg); // Send the message to other clients.
        textbox.value = '';
    }
    return false;
};
