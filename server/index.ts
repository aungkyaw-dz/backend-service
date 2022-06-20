import express, { Express, Request, Response } from 'express';
import  CONFIG  from './config/env'
import dbConnection from './config/db_connection'
import routers from './routers'
import fileUpload from 'express-fileupload';
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const app: Express = express();
const port = CONFIG.RUNNING_PORT;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routers);
dbConnection

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});