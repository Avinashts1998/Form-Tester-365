const dotenv = require('dotenv')

dotenv.config({path: './config.env'});
const db = require('./config/dbConnection')

global.clientConnection = db.initializeClientDbConnection()