// This is the backend for URMarket
// with Ajax 

// Prerequisites - first run:
//   npm install express
//   npm install body-parser
//   npm install mysql
//   npm install nodemailer
//
// then run:
//   node server.js
//
// and the frontend can be viewed at http://localhost:3000/login.html

var express = require('express');
var app = express();

// required to support parsing of POST request bodies
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// put all of  static files (e.g., HTML, CSS, JS, JPG) in the static_files/
// sub-directory, and the server will serve them from there. e.g.,:
app.use(express.static('static_files'));

var mysql = require('mysql');

// Creating connection to database
var pool = mysql.createPool({
  host: 'localhost',
  port:'3306',
  user: 'root',
  password: '9696',
  database: 'users'
});
//Node mailer function which is used to send the seller an email from the potential buyer
var emailer = require('nodemailer');
var transporter = emailer.createTransport({
  service: 'Gmail',
  auth:{
    user: '******',
    pass: '******'
  }
});


//Get request for the send email function
app.get('/send', function(req , res){

  var mail = {
  to: req.query.to,
  subject: 'UR Market Buyer Request ',
  text: req.query.text,


  }
  transporter.sendMail(mail,function(error, response){
    if(error){
      console.log(error);
      res.send("error");

    }
    else{
      console.log("Message was sent!");
      res.end("sent");
    }
    

  });
  

});

// CREATE a new user
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

//Create new listing
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

app.get('/users/*', function (req, res) {
  var nameToLookup = req.params[0];
  pool.getConnection(function(err, con){
  con.query('SELECT * FROM user',function(err,rows){
  if(err){
    res.send(err);
  console.log(err);
  console.log("error herr");
}


  for (var i = 0; i < rows.length; i++) {
   
    if (rows[i].username == nameToLookup) {
      console.log("inside  loop");
      res.send(rows[i]);
      console.log(rows[i]);
      return; // return early!
    }
  }
  res.send("error");
});
con.release(); 
});
});

//Method to find the user who is the seller of a given item
app.get('/seller/*', function (req, res) {
  var nameToLookup = req.params[0];
  pool.getConnection(function(err, con){
  con.query('SELECT * FROM user where username =?', nameToLookup , function(err,rows){
  if(err){
  console.log(err);
  return;
}
  for (var i = 0; i < rows.length; i++) {
   
    
      res.send(rows[i]);
    
     
  }
});
con.release(); 
});
});


//Find listings specific to a user
app.get('/listings/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup+ " server communication");
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing  where username = ? ',nameToLookup , function(err,rows){
  if(err){
    console.log(err);
    return;
  }
  
   
  for(var i = 0; i < rows.length ; i++){

 console.log(rows[i]);

console.log('read info success');
}
 res.send(rows);   
  
});
con.release(); 
});
});

//Used to pull a certain users listings from the database
app.get('/edit/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup+ " server communication"); 
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing  where itemName = ? ',nameToLookup , function(err,rows){
  if(err){
    console.log(err);
    return;
  }
 for (var i = 0; i < rows.length; i++) {
   
    
      res.send(rows[i]);
      console.log(rows[i]);
  }  
  
});
con.release(); 
});
});

//Retrieve listings with a specific id which is the primmary key
app.get('/view/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup+ " server communication"); 
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing  where id = ? ',nameToLookup , function(err,rows){
  if(err){
    console.log(err);
    return;
  }
 for (var i = 0; i < rows.length; i++) {
   
    
      res.send(rows[i]);
      console.log(rows[i]);
  }  
  
});
con.release(); 
});
});

//Read all the listings from the database
app.get('/show', function (req, res) {
  
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing ', function(err,rows){
  if(err){
    console.log(err);
    return;
  }
      res.send(rows);
});
con.release(); 
});
});

//Retrieve listings of a certain category
app.get('/show/*', function (req, res) {
  var cat = req.params[0];
  
  pool.getConnection(function(err, con){

  con.query('SELECT * FROM listing where category =  ?',cat , function(err,rows){
  if(err){
    console.log(err);
    return;
  }

   
    
      res.send(rows);
     
   
    

    
  
});
con.release(); 
});
});

// UPDATE a user's profile with the data given in POST
app.put('/users/*', function (req, res) {
  var nameToLookup = req.params[0]; 
  var postBody = req.body;
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

//Update listings
app.put('/edit/*', function (req, res) {
  var nameToLookup = req.params[0]; 
  var postBody = req.body;
  console.log(nameToLookup);
  pool.getConnection(function(err,con){
 con.query('UPDATE listing SET itemName = ? , itemCondition = ? , itemDescription = ? , itemPrice = ? ,category = ?, icon = ? WHERE username = ? AND itemName = ?' ,[postBody.itemName, postBody.itemCondition, postBody.itemDescription, postBody.itemPrice ,postBody.category, postBody.icon ,nameToLookup,postBody.itemName] , function(err,result){
if(err){
  console.log(err);
  res.send('ERROR');
  
}

res.send('OK');
console.log('Changed ' + result.changedRows + 'rows');


 } );
 con.release();
});

});

// DELETE a user
app.delete('/users/*', function (req, res) {
  var nameToLookup = req.params[0];
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

});

//Delete a listing
app.delete('/listings/*', function (req, res) {
  var nameToLookup = req.params[0];
  console.log(nameToLookup);
  pool.getConnection(function(err,con){
  con.query('DELETE FROM listing WHERE itemName = ?' , nameToLookup , function(err, result){
    if(err){
      console.log(err);
      res.send('ERROR');
      return;
    }
    res.send('OK');
    console.log('acccount deleted');
    
  });
});

});

// start the server on http://localhost:3000/
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started at http://localhost:%s', port);
});
