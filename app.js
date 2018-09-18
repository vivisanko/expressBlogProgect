const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const {
  MongoClient
} = require('mongodb')
const bodyParser = require('body-parser')
const assert = require('assert');
const {
  dbUrl,
  dbName
} = require('./config/db')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const undefinedRouter = require('./routes/undefined')

const app = express()



// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
// app.use(
//   express.urlencoded({
//     extended: false
//   })
// )
// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
  extended: true
}));

(async function () {
  try {
    await MongoClient.connect(dbUrl, {
      useNewUrlParser: true
    }, (err, client) => {
      // if (err) {
      //   console.log(err);
      // } else {

      //   console.log('connected to ', db.url);
      //   console.log('database', Object.keys(database));
      //   // console.log('database', database.getCollection('blogs'));
      //   const collect = database.collection('blogs').find({});
      //   console.log('collect', collect);

      //   // database.blogs.find({
      //   //   title: "Рыба-текст"
      //   // })
      //   database.close();
      // }
      assert.equal(null, err);
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      console.log('db', db);
      console.log('db', Object.keys(db));

      const collect = db.collection('blogs').insertOne({
        title: "Тест",
        text: "Как это работает"
      });
      // console.log('collect', collect);
      // const result = db.collection('blogs').find({
      //   title: "Рыба-текст",
      // });
      // console.log('result', result);


      client.close();
    });

  } catch (e) {
    console.error(e)
  }
})();





app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/*', undefinedRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app