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
    clearChilds('adminPanelwButton')
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
    hideComments()

});

document.querySelector('.allAdmins').addEventListener('click', e => {
    clearChilds('adminPanelwButton')
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
    hideComments()
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
    let parent = document.querySelector('.adminPanelwButton')
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
    clearChilds('adminPanelwButton')
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
    clearChilds('adminPanelwButton')
    hideComments()
})
function hideComments() {
    document.querySelector('.addComment').classList.add('d-none')
    document.querySelector('.showComments').classList.add('d-none')
}
document.querySelector('.adminPanelShowComments').addEventListener('click', e => {
    getComments()
    showComments()
    clearChilds('adminPanelwButton')
})
function showComments() {
    document.querySelector('.addComment').classList.remove('d-none')
    document.querySelector('.showComments').classList.remove('d-none')
}

// Second panel code

//add comment
document.querySelector('.btnComment').addEventListener('click', e => {
    let comment = document.querySelector('.inputComment').value

    let today = new Date()
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' at ' + today.getHours() + ":" + today.getMinutes()

    let userComment = {
        comment: comment,
        user: userInfo.username,
        date: date
    }
    fetch('http://localhost:3300/comment', {
        method: 'PUT',
        body: JSON.stringify(userComment),
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        getComments()
        document.querySelector('.inputComment').value = ''
    })
})

document.querySelector(".inputComment").addEventListener("keyup", function (i) {
    if (i.key === 'Enter') {
        i.preventDefault();
        document.querySelector(".btnComment").click();
    }
});

async function writeAllComments(data) {
    clearChilds('showComments')
    for (i = 0; i < data.length; i++) {
        let parent = document.querySelector('.showComments')
        let div = document.createElement('div')
        div.classList.add(data[i].commentid, data[i].owner, 'commentFromUser')
        let a = document.createElement('a')
        let b = document.createElement('b')
        let p2 = document.createElement('p')
        let br = document.createElement('br')
        a.textContent = 'says:'
        b.textContent = data[i].owner
        p2.textContent = data[i].value
        let a2 = document.createElement('a')
        let img = document.createElement('img')
        if (data[i].picture != '') {
            if (!img.width) {
                img.src = 'images/default.jpg'
            }
            img.src = 'images/' + data[i].picture
        }
        else {
            img.src = 'images/default.jpg'
        }

        a2.textContent = data[i].date
        div.append(img, b, a, br, a2, p2)
        parent.append(div)
    }
    mouserOverComment()
    mouserOutComment()

}

async function getComments() {
    await fetch('http://localhost:3300/comment', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        response.json().then(data => {
            writeAllComments(data)
        })
    })
}
getComments()

function mouserOverComment() {
    document.querySelectorAll('.commentFromUser').forEach(e => {
        e.addEventListener('mouseenter', function () {
            if (document.querySelector('.hoverElement') != null) {
                document.querySelectorAll('.hoverElement').forEach(e => {
                    e.remove()
                })

            }
            let commentid = Number(this.classList[0])
            let bodyOfUsername = this
            let username = this.classList[1]
            let body = {
                commentid: commentid
            }
            let p = document.createElement('a')
            p.classList.add('hoverElement')
            p.textContent = 'Delete comment'


            // if user is owner of the comment
            if (userInfo.username == 'admin' || userInfo.adminPrivileges == 1 || username == userInfo.username) {
                bodyOfUsername.append(p)
                document.querySelector('.hoverElement').addEventListener('click', e => {

                    fetch('http://localhost:3300/comment', {
                        method: 'DELETE',
                        body: JSON.stringify(body),
                        headers: { 'Content-Type': 'application/json' }
                    }).then(response => {
                        getComments()
                    })
                })
            }
        })
    })
}
function mouserOutComment() {
    document.querySelectorAll('.commentFromUser').forEach(e => {
        e.addEventListener('mouseleave', function () {
            if (document.querySelector('.hoverElement') != null) {
                document.querySelectorAll('.hoverElement').forEach(e => {
                    e.remove()
                })

            }
        })
    })
}

let danas = new Date()
let minutes = danas.getMinutes();
minutes = minutes > 9 ? minutes : '0' + minutes;
let date = danas.getFullYear() + '-' + (danas.getMonth() + 1) + '-' + danas.getDate() + ' at ' + danas.getHours() + ":" + minutes

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.logoutButton').addEventListener('click', e => {
        localStorage.clear();
    })
})