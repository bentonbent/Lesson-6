/**
 * Created by karthik on 7/14/17.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();

var url='mongodb://carl:carl1carl@ds113873.mlab.com:13873/apl_webdemo'; //step1: complete
    //''mongodb://foo:foo@ds147668.mlab.com:47668/web_demo';
//1.Modify this url with the credentials of your db name and password.
var ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/create', function (req, res) {
    MongoClient.connect(url, function(err, db) {
  //      var db = mongoose.connection;
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});

app.get('/get', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }

        db.collection('books').find().toArray(function(err, result){
            if(err)
            {
                res.write("get Failed");
                res.end();
            }else
            {

                res.send(JSON.stringify(result));
            }
            console.log("Got All Documents");

        });
    });

});

app.get('/delete/:toBeDeleted_id', function (req, res) {
    // 2.Connect to MongoDB . Handle the error and write the logic for deleting the desired book  Step 2:
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }

        deleteDocument(db, req.params.toBeDeleted_id, function() {
            res.write("Successfully deleted");
            res.end();
        });
    });




});


app.get('/update/:toBeUpdated_id', function (req, res) {
    //3.connect to MongoDB. Handle the error and write the logic for updating the selected field  Step 3:
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
     //  console.log(req);
    var my = {"_id" : ObjectID(req.params.toBeUpdated_id)};
        var myBook={"ISBN":req.query.ISBN,"bookName":req.query.bookName,"authorName":req.query.authorName};
        db.collection('books').updateOne(my, myBook, function(err,res){
            if(err) throw(err);
            console.log("1 document updated");

        });
        res.end();
        /* */
    });


});


var insertDocument = function(db, data, callback) {
    db.collection('books').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the books collection.");
        callback();
    });
};

var deleteDocument = function(db, data, callback) {
    db.collection('books').deleteOne({"_id" : ObjectID(data)},function(err, result) {
        console.log(data);
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Deleted document");
        callback();
    });
};

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});

