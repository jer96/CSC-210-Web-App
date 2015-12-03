// Lectures 11 and 12 - CSC 210 Fall 2015
// Philip Guo

// This is the backend for the Fakebook web app, which demonstrates CRUD
// with Ajax using a REST API. (static_files/fakebook.html is the frontend)

// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//   npm install mysql
//
// then run:
//   node server.js
//
// and the frontend can be viewed at http://localhost:3000/fakebook.html

var express = require('express');
var app = express();

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
//
// http://localhost:3000/fakebook.html
// http://localhost:3000/cat.jpg
//
// will send the file static_files/cat.jpg to the user's Web browser
app.use(express.static('static_files'));

var mysql = require('mysql');

// First you need to create a connection to the db
var pool = mysql.createPool({
  host: 'localhost',
  port:'3306',
  user: 'root',
  password: '9696',
  database: 'users'
});







// CREATE a new user
//
// To test with curl, run:
//   curl -X POST --data "name=Carol&job=scientist&pet=dog.jpg" http://localhost:3000/users
app.post('/users', function (req, res) {
  var postBody = req.body;
  var myName = postBody.username;

  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }
pool.getConnection(function(err,con){
 con.query('insert into user set ?', postBody , function(err ,result){
  if(err){
    console.log(err);
    return;
  }
  for (var i = 0; i < result.length; i++) {
    
    if (result[i].username == myName) {
      res.send('Error user already in the database.');
      console.log('user already in  db');
      return; // return early!
    }
  }
  console.log(result);
    res.send('OK');
});

con.release();
});

});

app.post('/listing', function (req, res) {
  var postBody = req.body;
  var myName = postBody.itemName;
  console.log('hey server ');
  console.log(postBody);

  // must have a name!
  if (!myName) {
    res.send('ERROR');
    return; // return early!
  }
  pool.getConnection(function(err,con){
 con.query('insert into listing set ?', postBody , function(err ,result){
  if(err){
    console.log(err);
    return;
  }
 
  console.log(result);
   res.send('OK');
});
 con.release();
});

 
});







// READ profile data for a user
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users/Philip
//   curl -X GET http://localhost:3000/users/Jane

app.get('/users/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup) // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  pool.getConnection(function(err, con){
  con.query('SELECT * FROM user',function(err,rows){
  if(err){
  console.log(err);
  return;
}
  for (var i = 0; i < rows.length; i++) {
   
    if (rows[i].username == nameToLookup) {
      res.send(rows[i]);
      console.log('read info success');
      return; // return early!
    }
    else{
      console.log('no user in db');
    }  
  }
});
con.release(); 
});
});

app.get('/listings/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup+ " server communication"); // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing  where username = ? ',nameToLookup , function(err,rows){
  if(err){
    console.log(err);
    return;
  }
  
   
  for(var i = 0; i < rows.length ; i++){
 res.send(rows[i]);
 console.log(rows[i]);
console.log('read info success');
}
    
  
});
con.release(); 
});
});




// READ a list of all usernames (note that there's no '*' at the end)
//
// To test with curl, run:
//   curl -X GET http://localhost:3000/users
app.get('/users', function (req, res) {
  var allUsernames = [];

  for (var i = 0; i < fakeDatabase.length; i++) {
 var e = fakeDatabase[i];
  allUsernames.push(e.username); // just record names
 }

 res.send(allUsernames);
});


// UPDATE a user's profile with the data given in POST
//
// To test with curl, run:
//   curl -X PUT --data "job=bear_wrangler&pet=bear.jpg" http://localhost:3000/users/Philip
app.put('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; 
  var postBody = req.body;// this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  console.log(nameToLookup);
  pool.getConnection(function(err,con){
 con.query('UPDATE user SET username = ? , fname = ? , lname = ? , phone = ? , year = ? , icon = ? WHERE username=  ?' ,[postBody.username , postBody.fname , postBody.lname , postBody.phone , postBody.year , postBody.icon , nameToLookup] , function(err,result){
if(err){
  console.log(err);
  res.send('ERROR');
  return;
}
res.send('OK');
console.log('Changed ' + result.changedRows + 'rows');

 } );
 con.release();
});

});


// DELETE a user
//
// To test with curl, run:
//   curl -X DELETE http://localhost:3000/users/Philip
//   curl -X DELETE http://localhost:3000/users/Jane
app.delete('/users/*', function (req, res) {
  var nameToLookup = req.params[0];
  // this matches the '*' part of '/users/*' above
  // try to look up in fakeDatabase
  pool.getConnection(function(err,con){
  con.query('DELETE FROM user WHERE username = ?' , nameToLookup , function(err, result){
    if(err){
      console.log(err);
      res.send('ERROR');
      return;
    }
    res.send('OK');
    console.log('acccount deleted');
    
  });
});
  // nobody in the database matches nameToLookup
});


// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});