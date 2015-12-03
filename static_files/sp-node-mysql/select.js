var mysql = require('mysql');

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: 'localhost',
  port:'3306',
  user: 'root',
  password: '9696',
  database: 'users'
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});
con.query('select * from user' , function(err, result){
  console.log(result);
})