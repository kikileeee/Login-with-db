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

    let data = {
        username: username,
        email: email,
        password: password,
        confirmPassword: passwordConfirm
    }
    fetch('http://localhost:3300/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        response.json().then(data => {
            ispisi(data)
            if (data.success) {
                window.location.reload()
                alert('Sign up is successful, now log in')
            }
        })
    })

})

// Click on logIn
document.querySelector('.signIn').addEventListener('click', e => {
    let username = document.querySelector('.name').value
    let password = document.querySelector('.password').value
    let count = 0
    let body = {
        username: username,
        password: password
    }
    fetch('http://localhost:3300/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(response => response.json().then(data => {
        console.log(data)
        htmlHome(data)
    }))

    //     else if (username != dataUsers[i].username) {
    //         count++
    //     }
    //     else {
    //         let parentPassword = document.querySelector('.divPassword')
    //         clearChilds('divPassword')
    //         let p = document.createElement('p')
    //         p.textContent = 'Password is wrong'
    //         parentPassword.append(p)
    //     }
    // }

    // if (count == dataUsers.length) {
    //     clearChilds('divName')
    //     let p = document.createElement('p')
    //     p.textContent = 'This username does not exist'
    //     document.querySelector('.divName').append(p)
    // } else {
    //     clearChilds('divName')
    // }
})
// Delete and clear Form
function clearForm() {
    document.querySelectorAll('.pPasswordConfirm, .pUsername, .pEmail, .pPassword, .pDBUsername, .pLoginName, .loginPassword').forEach(e => {
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
// Dom manipultion with fetched data
function ispisi(data) {
    if (data.usernameFailed) {
        document.querySelector('.pDBUsername').classList.remove('d-none')
    }
    else {
        document.querySelector('.pDBUsername').classList.add('d-none')
    }
    if (data.usernameLengthFailed) {
        document.querySelector('.pUsername').classList.remove('d-none')
    }
    else {
        document.querySelector('.pUsername').classList.add('d-none')
    }
    if (data.emailFailed) {
        document.querySelector('.pEmail').classList.remove('d-none')
    }
    else {
        document.querySelector('.pEmail').classList.add('d-none')
    }
    if (data.passwordLengthFailed) {
        document.querySelector('.pPassword').classList.remove('d-none')
    }
    else {
        document.querySelector('.pPassword').classList.add('d-none')
    }
    if (data.confirmPasswordFailed) {
        document.querySelector('.pPasswordConfirm').classList.remove('d-none')
    }
    else {
        document.querySelector('.pPasswordConfirm').classList.add('d-none')
    }

}

// Home html redirect

function htmlHome(data) {
    const parent = document.querySelector('.loginForm')
    if (data.loginSuccessful) {
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
        h1.textContent = 'Login successful, Welcome back ' + data.username + '!'
        parent.append(h1)
        parent.append(input)

        localStorage.clear();
        let dataLocal = {
            username: data.username,
            adminPrivileges: data.adminPrivileges,
            picture: data.picture
        }
        localStorage.setItem('userInfo', JSON.stringify(dataLocal));
        clearForm()
    }
    else{
        console.log('failed')
        document.querySelector('.loginPassword').classList.remove('d-none')
    }
}
