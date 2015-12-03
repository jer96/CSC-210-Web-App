var mysql = require('mysql');

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: 'localhost',
  port:'3306',
  user: 'root',
  password: '9696',
  database: 'marketListings'
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var user1 = {
	username: 'jbill3@u.rochester.edu', password: 'jspassword', fname: 'Jeremiah', lname: 'Bill', phone: '6213569874', year: '2018', icon:'bear.jpg'
};


var query = con.query('insert into user set ?', user1 , function(err ,result){
	if(err){
		console.log(err);
		return;
	}
	console.log(result);
});
