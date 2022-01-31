const express = require('express')
const cors = require("cors");
const { createPool } = require('mysql');
const { ok } = require('assert');
const { response } = require('express');

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
    res.send(data)
  })
})

app.post('/', (req, res) => {
  console.log(req.body)
  insertData(req.body.username, req.body.email, req.body.password)
})

function insertData(username, email, password) {
  pool.query(`INSERT INTO users (username, email, password) VALUES ('${username}', '${email}', '${password}')`)
  console.log('imported')

}