const express = require('express')
const cors = require("cors");
const { createPool } = require('mysql');
const { ok } = require('assert');
const { response } = require('express');
const { status } = require('express/lib/response');
const multer = require('multer')
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/home/images")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const app = express()
const port = 3300

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "usersdb"
});

app.use(express.json())
app.use(cors());


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
app.get('/', (req, res) => {
  pool.query(`SELECT * FROM users`, (error, data) => {

    let keys = Object.values(data)
    let responseArray = []

    for (i = 0; i < keys.length; i++) {
      let responseObject = {
        username: keys[i].username,
        adminPrivileges: keys[i].adminPrivileges
      }
      responseArray.push(responseObject)

    }
    res.send(responseArray)
  })
})
app.post('/signin', (req, res) => {
  pool.query(`SELECT * FROM users`, (error, data) => {
    console.log(req.body)
    let keys = Object.values(data)
    let username = req.body.username
    let password = req.body.password
    let proceed = {
      loginSuccessful: false,
      username: '',
      adminPrivileges: 0,
      picture: ''
    }

    for (i = 0; i < keys.length; i++)
      if (username == keys[i].username && password == keys[i].password) {
        proceed.loginSuccessful = true
        proceed.username = keys[i].username
        proceed.adminPrivileges = keys[i].adminPrivileges
        proceed.picture = keys[i].picture
        break
      }
    res.send(proceed)
  })
})

app.post('/', (req, res) => {

  pool.query(`SELECT * FROM users`, (error, data) => {
    let keys = Object.values(data)
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    let pushData = false
    let responseObject = {
      username: username,
      success: false,
      usernameFailed: false,
      usernameLengthFailed: false,
      emailFailed: false,
      passwordLengthFailed: false,
      confirmPasswordFailed: false
    }
    let pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    for (i = 0; i < keys.length; i++) {
      if (keys[i].username != username && (username.length >= 6 && username.length < 25) && email.match(pattern) && (password.length > 6 && password.length < 25) && password == confirmPassword) {
        pushData = true
        responseObject.success = true
      }
      else {
        for (y = 0; y < keys.length; y++) {
          if (username == keys[y].username)
            responseObject.usernameFailed = true
        }
        if (username.length < 6 || username.length >= 25) {
          responseObject.usernameLengthFailed = true
        }
        if (!email.match(pattern)) {
          responseObject.emailFailed = true
        }
        if (password.length <= 6 || password.length >= 25) {
          responseObject.passwordLengthFailed = true
        }
        if (password != confirmPassword || password == '' || confirmPassword == "") {
          responseObject.confirmPasswordFailed = true
        }
        console.log('podaci nisu poslati na bazu')
        pushData = false
        break
      }
    }
    if (pushData) {
      pool.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`)
    }
    res.send(responseObject)
  })
})
app.put('/comment', (req, res) => {
  commentPost(req.body.user, req.body.comment, req.body.date)
  res.send('s')
})

app.delete('/comment', (req, res) => {
  pool.query(`DELETE FROM comment WHERE commentid = ${req.body.commentid} `)
  res.send('s')
})
app.get('/comment', (req, res) => {
  pool.query(`SELECT commentid, owner, picture, value, date FROM users, comment WHERE users.username = comment.owner ORDER BY commentid ASC`, (error, data) => {
    res.send(data)
  })
})

app.delete('/', (req, res) => {
  pool.query(`DELETE FROM users WHERE username='${req.body.username}'`)
  res.send('status')
})

app.put('/', (req, res) => {
  pool.query(`UPDATE users SET adminPrivileges=1 WHERE username='${req.body.username}'`)
  res.send('status')
})
app.put('/s', (req, res) => {
  pool.query(`UPDATE users SET adminPrivileges=0 WHERE username='${req.body.username}'`)
  res.send('status')
})

app.post('/uploadPicture', upload.single('image'), (req, res) => {
  res.send(req.file.filename)
})
app.delete('/uploadPicture', (req, res) => {
  console.log('gonna delete this' + req.body.picture)
  let picurePath = 'public/home/images/'+ req.body.picture
  fs.unlink(picurePath, deleteCallBack)
  function deleteCallBack(error){
    if (error){
      console.log('Error in deleting file')
      console.log(error.message)
    } else {
      console.log('Deleted Successfully..')
    }
  }
})
app.put('/uploadPicture', (req, res) => {
  pool.query(`SELECT picture FROM users  WHERE username='${req.body.username}'`, (error, data) =>{
    res.send(data)
  })
  console.log('nova slika ' +req.body.picture)
  pool.query(`UPDATE users SET picture='${req.body.picture}' WHERE username='${req.body.username}'`)
})

function insertData(username, email, password) {
  pool.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`)
  console.log('imported')

}
async function commentPost(username, comment, date) {
  await pool.query(`INSERT INTO comment (value, owner, date) VALUES ('${comment}','${username}','${date}')`)
}
function putNewData(){

}
