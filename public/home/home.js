// get data of logged user
let userDatabase = []
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || []
document.querySelector('.helloUser').textContent = 'Hello ' + userInfo.username
if (userInfo.adminPrivileges != 1) {
    document.querySelector('.userPanel').classList.add('d-none')
}

document.querySelector('.allUsers').addEventListener('click', e => {
    clearChilds('secondPanel')
    fetchData()
        for (i = 0; i < userDatabase.length; i++) {
            if (userDatabase[i].adminPrivileges == 0) {
                createData(userDatabase)
            }
        }
        deleteUser()
    
});

document.querySelector('.allAdmins').addEventListener('click', e => {
    clearChilds('secondPanel')
    fetchData()
    for (i = 0; i < userDatabase.length; i++) {
        if (userDatabase[i].adminPrivileges != 0) {
            createData(userDatabase)
        }
    }
    deleteUser()
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
function createData(data) {
    let parent = document.querySelector('.secondPanel')
    let div = document.createElement('div')
    let p3 = document.createElement('p')
    let p2 = document.createElement('p')
    let p = document.createElement('p')
    p.textContent = 'Delete ' + data[i].username
    p.classList.add(data[i].username, 'user')
    p2.classList.add('p2')
    p2.textContent = 'User :  ' + data[i].username
    p3.textContent = 'Add Admin'
    p3.classList.add('p3')
    div.append(p2)
    div.append(p)
    div.append(p3)
    parent.append(div)
}

function fetchData() {
    fetch('http://localhost:3300/', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(response => response.json().then(data => {
        userDatabase = data
    }))
}
fetchData()

function deleteUser() {
document.querySelectorAll('.user').forEach( e =>{
    e.addEventListener('click', function() {

        let data = {username: e.classList[0]}
        console.log(data)

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
function resetUsers() {
    clearChilds('secondPanel')
    fetchData()
    for (i = 0; i < userDatabase.length; i++) {
        if (userDatabase[i].adminPrivileges == 0) {
            createData(userDatabase)
        }
    }
    deleteUser()
}