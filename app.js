const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const router = require('./router')


const db = require('./config/dbConnection')
const app = express()

dotenv.config({path:"./config.env"})

global.clientConnection = db.initializeClientDbConnection()

app.set('table', path.join(__dirname, 'table'));
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', router)


app.listen(process.env.PORT, () => {
    console.log(`App listening ot the port ${process.env.PORT} :: ready for incoming requests!`)
})


/*
FormTester 365 is a WordPress plugin that automatically checks and tests your website forms daily. If a problem is detected, FormTester notifies you automatically.
*/