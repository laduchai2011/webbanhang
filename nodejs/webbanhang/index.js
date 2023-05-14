require('dotenv').config();
const express = require('express');
const router = require('./router');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser');
const app = express();

app.use('/api/', function (req, res, next) {
    // specify CORS headers to send
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'POST, PUT, PATCH, GET, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization',
    );
    next();
});

app.use('/api/', fileupload());
app.use('/api/', express.json());
app.use('/api/', express.static(__dirname + '/public'));
app.use('/api/', bodyParser.json());
app.use('/api/', bodyParser.urlencoded({ extended: true }));

app.use('/api/', router);


// test
// const promise1 = new Promise((resolve, reject) => {
//   resolve(1);
//   // reject('loi');
// })

// const promise2 = new Promise((resolve, reject) => {
//   // resolve(2);
//   reject('loi 2');
// })

// // promise1
// // .then(data => console.log('promise1', 'data', data))
// // .catch(err =>console.log('promise1', 'err', err))

// // promise2
// // .then(data => console.log('promise2', 'data', data))
// // .catch(err =>console.log('promise2', 'err', err))

// Promise.all([promise1, promise2]).then((values) => {
//   console.log(values);
// }).catch(err => console.error(err))


app.listen(process.env.NODE_SERVER_PORT_KEY||4000, () => console.log('Example app is listening on port 4000.'));