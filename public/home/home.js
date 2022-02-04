// get data of logged user
let userDatabase = []
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || []
let tab = 'users'

fetchData()

document.querySelector('.helloUser').textContent = 'Hello ' + userInfo.username
if (userInfo.adminPrivileges != 1) {
    document.querySelector('.userPanel').classList.add('d-none')
}

document.querySelector('.allUsers').addEventListener('click', e => {
    clearChilds('secondPanel')
    fetchData()
    for (i = 0; i < userDatabase.length; i++) {
        if (userDatabase[i].adminPrivileges == 0) {
            createData(userDatabase, true)
        }
    }
    document.querySelectorAll('.p4').forEach(e => {
        e.classList.add('d-none')
    })
    document.querySelectorAll('.p3').forEach(e => {
        e.classList.remove('d-none')
    })
    tab = 'users'
    deleteUser()
    addAdminPrivilegesToUser()
    removeAdminPrivilegesToUser()

});

document.querySelector('.allAdmins').addEventListener('click', e => {
    clearChilds('secondPanel')
    fetchData()
    for (i = 0; i < userDatabase.length; i++) {
        if (userDatabase[i].adminPrivileges == 1 && userInfo.username == 'admin') {
            if (userDatabase[i].username != 'admin') {
                createData(userDatabase, true)
            }
        }
        else if (userDatabase[i].adminPrivileges == 1) {
            if (userDatabase[i].username != 'admin') {
                createData(userDatabase, false)
            }
        }
    }

    tab = 'admins'
    deleteUser()
    addAdminPrivilegesToUser()
    removeAdminPrivilegesToUser()
})
// Clear parents childs
function clearChilds(x) {
    let parent = document.querySelector(`.${x}`)
    if (parent != null) {
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
}
function createData(data, x) {
    let parent = document.querySelector('.secondPanel')
    let div = document.createElement('div')
    let p3 = document.createElement('p')
    let p2 = document.createElement('p')
    let p = document.createElement('p')
    let p4 = document.createElement('p')
    p.textContent = 'Delete ' + data[i].username
    p.classList.add(data[i].username, 'user')
    p2.classList.add('p2')
    p2.textContent = 'User :  ' + data[i].username
    p3.textContent = 'Add Admin to user ' + data[i].username
    p3.classList.add(data[i].username, 'p3', 'd-none')
    p4.textContent = 'Remove Admin from user ' + data[i].username
    p4.classList.add(data[i].username, 'p4')
    div.append(p2)

    if (x) {
        div.append(p)
        div.append(p3)
        div.append(p4)
    }
    parent.append(div)
}

async function fetchData() {
    await fetch('http://localhost:3300/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json().then(data => {
        userDatabase = data
    }))
}

function deleteUser() {
    document.querySelectorAll('.user').forEach(e => {
        e.addEventListener('click', function () {

            let data = { username: e.classList[0] }
            fetch('http://localhost:3300/', {
                method: 'DELETE',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }).then((response) => {
                resetUsers()
            })
        })
    })
}
async function resetUsers() {
    clearChilds('secondPanel')
    await fetchData()
    for (i = 0; i < userDatabase.length; i++) {
        if (tab == 'users') {
            if (userDatabase[i].adminPrivileges == 0) {
                createData(userDatabase, true)
            }
        }
        else if (tab == 'admins') {
            if (userDatabase[i].adminPrivileges != 0) {
                if (userDatabase[i].username != 'admin' && userInfo.username == 'admin') {
                    createData(userDatabase, true)
                }
                else if (userDatabase[i].username != 'admin') {
                    createData(userDatabase, false)
                }
            }
        }
    }
    if (tab == 'users') {
        document.querySelectorAll('.p4').forEach(e => {
            e.classList.add('d-none')
        })
        document.querySelectorAll('.p3').forEach(e => {
            e.classList.remove('d-none')
        })
    }
    deleteUser()
    addAdminPrivilegesToUser()
    removeAdminPrivilegesToUser()

}

function addAdminPrivilegesToUser() {
    document.querySelectorAll('.p3').forEach(e => {
        e.addEventListener('click', function () {
            let data = { username: e.classList[0] }
            fetch('http://localhost:3300/', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }).then((response) => {
                resetUsers()
            })
        })
    })
}
function removeAdminPrivilegesToUser() {
    document.querySelectorAll('.p4').forEach(e => {
        e.addEventListener('click', function () {
            let data = { username: e.classList[0] }
            fetch('http://localhost:3300/s', {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }).then((response) => {
                resetUsers()
            })
        })
    })
}

document.querySelector('.hide').addEventListener('click', e => {
    clearChilds('secondPanel')
})

// Second panel code

//add comment
document.querySelector('.btnComment').addEventListener('click', e => {
    let comment = document.querySelector('.inputComment').value
    let userComment = {
        comment: comment,
        user: userInfo.username
    }
    console.log(userComment)
    fetch('http://localhost:3300/comment', {
        method: 'POST',
        body: JSON.stringify(userComment),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        response.json().then(data => { 
            console.log(data)
            writeAllComments(data)
        })
    })
})
function writeAllComments(data) {
    for (i=0;i < data.length;i++){
        let parent = document.querySelector('.showComments')
        let div = document.createElement('div')
        let p = document.createElement('a')
        let p2 = document.createElement('p')
        let br = document.createElement('br')
        console.log(data[i].owner)
        p.textContent = data[i].owner
        p2.textContent = data[i].value
        div.append(p, br,p2)
        parent.append(div)
    }

}