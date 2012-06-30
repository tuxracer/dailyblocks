var express = require('express')
  // , passport = require('passport')
  , util = require('util')
  , mongo = require('mongodb')
  , ObjectID = require('mongodb').ObjectID;

db = new mongo.Db('dailyblocks', new mongo.Server("ds033767.mongolab.com", 33767, {auto_reconnect: true}), {});

db.addListener("error", function(error) {
  console.log("Error connecting to mongo - perhaps it isn't running?");
});

db.open(function(p_db) {
  db.authenticate("dailyblocks", "d41lybl0ck5", function(p_db) {

  	var app = express.createServer();

      // configure Express
      app.configure(function() {
        // app.set('views', __dirname + '/views');
        // app.set('view engine', 'ejs');
        app.use(express.logger());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        // app.use(express.session({ secret: 'keyboard cat' }));

        app.use(app.router);
        app.use(express.static(__dirname + '/assets'));
      });

  	  app.get('/', function (req, res) {
        res.json("hi");
      });

      app.get('/feeds/all', function(req, res){
        db.collection('feeds', function(error, feed_collection) {
          feed_collection.find().toArray(function (error, results) {
              res.json(results);
            });
        });
      });

      

      app.get('/all/:id', function (req, res) {
      	db.collection('feeds', function(error, feed_collection) {
          feed_collection.find({user_id:ObjectID(req.params.user_id)}).toArray(function (error, results) {
              res.json(results);
            });
        });
      });

      app.get('/item/:id', function (req, res) {
      	db.collection('feeds', function(error, feed_collection) {
          feed_collection.find({_id:ObjectID(req.params.id)}).toArray(function (error, results) {
              res.json(results);
            });
        });
      });

      app.listen(3000);
  });
});