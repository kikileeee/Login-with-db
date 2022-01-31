let dataUsers = []
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
    let doesUsernameExistsInDB = false

    for (i = 0; i < dataUsers.length; i++) {
        if (username == dataUsers[i].username) {
            doesUsernameExistsInDB = true
        }
    }

    if (username.length >= 6 && username.length < 50 && email.match(pattern) && password.length > 6 && password == passwordConfirm && username.length > 4 && doesUsernameExistsInDB == false) {
        let data = {
            username: username,
            email: email,
            password: password
        }

        fetch('http://localhost:3300/', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            console.log(response)
        })
        window.location.reload();
    }
    else {
        if (doesUsernameExistsInDB) {
            document.querySelector('.pDBUsername').classList.remove('d-none')
        }
        else if (username.length < 6 || !username.length > 50) {
            document.querySelector('.pUsername').classList.remove('d-none')
            document.querySelector('.pDBUsername,').classList.add('d-none')
        }
        else if (!email.match(pattern)) {
            document.querySelector('.pEmail').classList.remove('d-none')
            document.querySelector('.pDBUsername, .pUsername').classList.add('d-none')
        }
        else if (password.length <= 6) {
            document.querySelector('.pPassword').classList.remove('d-none')
            document.querySelectorAll('.pDBUsername, .pUsername, .pEmail').forEach(e => {
                e.classList.add('d-none')
            })
        }
        else if (password != '' && password != passwordConfirm) {
            document.querySelector('.pPasswordConfirm').classList.remove('d-none')
            document.querySelectorAll('.pDBUsername, .pUsername, .pEmail, .pPassword').forEach(e => {
                e.classList.add('d-none')
            })
        }
    }
})

// Click on logIn
document.querySelector('.signIn').addEventListener('click', e => {
    let username = document.querySelector('.name').value
    let password = document.querySelector('.password').value
    const parent = document.querySelector('.loginForm')
    let count = 0
    for (i = 0; i < dataUsers.length; i++) {
        if (username == dataUsers[i].username && password == dataUsers[i].password) {
            while (parent.firstChild) {
                parent.firstChild.remove()
            }
            let input = document.createElement('input')
            let h1 = document.createElement('h1')
            input.type = 'button'
            input.value = 'Continue'
            input.onclick = function () {
                location.href = 'home/home.html'
            }
            h1.textContent = 'Login successful, Welcome back ' + dataUsers[i].username + ' !!!'
            parent.append(h1)
            parent.append(input)

            localStorage.clear();

            let dataLocal = {
                username: dataUsers[i].username,
                adminPrivileges: dataUsers[i].adminPrivileges
            }
            localStorage.setItem('userInfo', JSON.stringify(dataLocal));
            clearForm()
        }
        else if (username != dataUsers[i].username) {
            count++
        }
        else {
            let parentPassword = document.querySelector('.divPassword')
            clearChilds('divPassword')
            let p = document.createElement('p')
            p.textContent = 'Password is wrong'
            parentPassword.append(p)
        }
    }
    // if username doesnt match
    if (count == dataUsers.length) {
        clearChilds('divName')
        let p = document.createElement('p')
        p.textContent = 'This username does not exist'
        document.querySelector('.divName').append(p)
    } else {
        clearChilds('divName')
    }
})
// Delete and clear Form
function clearForm() {
    document.querySelectorAll('.pPasswordConfirm, .pUsername, .pEmail, .pPassword, .pDBUsername, .pLoginName').forEach(e => {
        e.classList.add('d-none')
    })
    document.querySelectorAll('.divName, .divPassword').forEach(e => {
        while (e.hasChildNodes()) {
            e.removeChild(e.lastChild);
        }
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
        dataUsers = data
    }))
});

// Remove all child from parent
function clearChilds(x) {
    let parent = document.querySelector(`.${x}`)
    if (parent != null) {
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}

