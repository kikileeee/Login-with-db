
// Toggle between signUp and signIn
document.querySelectorAll(".init").forEach(box => box.addEventListener("click", () => {
    document.querySelectorAll('.toggleDisplay').forEach(x => x.classList.toggle('d-none'))
    let text = document.querySelector('.temp')
    if (text.textContent == 'Login into your account') {
        text.textContent = 'Sign Up'
    }
    else {
        text.textContent = 'Login into your account'
    }
    clearForm()
}))
// Validating form and POST request
document.querySelector('.signUp').addEventListener('click', e => {
    let username = document.querySelector('.name').value
    let email = document.querySelector('.email').value
    let password = document.querySelector('.password').value
    let passwordConfirm = document.querySelector('.confirmPassword').value
    let pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (username.length >= 6 && username.length < 50 && email.match(pattern) && password.length > 6 && password == passwordConfirm && username.length > 4) {
        let data = {
            username: username,
            email: email,
            password: password
        }
        console.log(data)

        fetch('http://localhost:3300/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log(response)
        })

        clearForm()
    }
    else {
        if (username.length < 6 || !username.length > 50) {
            document.querySelector('.pUsername').classList.remove('d-none')
        }
        else if (!email.match(pattern)) {
            document.querySelector('.pEmail').classList.remove('d-none')
            document.querySelector('.pUsername').classList.add('d-none')
            console.log()
        }
        else if (password.length <= 6) {
            document.querySelector('.pPassword').classList.remove('d-none')
            document.querySelectorAll('.pUsername, .pEmail').forEach(e => {
                e.classList.add('d-none')
            })
        }
        else if (password != '' && password != passwordConfirm) {
            document.querySelector('.pPasswordConfirm').classList.remove('d-none')
            document.querySelectorAll('.pUsername, .pEmail, .pPassword').forEach(e => {
                e.classList.add('d-none')
            })
        }
    }
})

// Click on logIn
document.querySelector('.signIn').addEventListener('click', e => {
    console.log('ss')
})
// Delete and clear Form
function clearForm() {
    document.querySelectorAll('.pPasswordConfirm, .pUsername, .pEmail, .pPassword').forEach(e => {
        e.classList.add('d-none')
    })
    document.querySelectorAll("input:not(input[type='button'])").forEach(e => {
        e.value = ''
    })
}
// Click on forget password button
document.querySelector('.passwordForgot').addEventListener('click', e => {
    // forget password function here
})
// fetching and loading data from database
document.addEventListener("DOMContentLoaded", e => {
    fetch('http://localhost:3300/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json().then(data => {
        console.log(data)
        for (i = 0; i < data.length; i++) {
            console.log('User ' + data[i].username + ' has logged in')
        }
    }))
});

