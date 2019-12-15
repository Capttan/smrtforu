const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;

// const config = require('./config');

const config = require('./config_prod');

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;
const pool = mysql.createPool(config.mysql);
const mongoclient = new MongoClient(config.mongodb.url, { useUnifiedTopology: true });

mongoclient.connect((err) => {

  if (err) {
      console.error('Cannot get mongodb database: ', err);
      return process.exit(0);
  }
});



app.use(morgan('tiny'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


require('./routes/login')(app, pool);
require('./routes/admin')(app, pool, mongoclient);
require('./routes/user')(app, pool, mongoclient);
require('./routes/gmap')(app, pool, mongoclient);







app.use(express.static(__dirname + '/public'))

app.listen(PORT,
    () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
);