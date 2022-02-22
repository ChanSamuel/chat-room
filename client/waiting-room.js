
let form = document.getElementById('login-form');
let textbox = document.getElementById('username');

// On form submission (i.e., when the login button is pressed or the 'enter' key is pressed on the input) store the username globally.
form.addEventListener('submit', (e) => {

    // If the text box is not empty, store the username value globally.
    if (textbox.value) {
        window.name = (' ' + textbox.value).slice(1); // Deep copy the string.
    }
});


