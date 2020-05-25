const express = require('express')
const routes = require('./routes')
const path = require('path')
const app = express()

app.use(express.json())
app.use('/', routes)
app.listen(3001, () => console.log(`Service running on http://localhost:3001`))