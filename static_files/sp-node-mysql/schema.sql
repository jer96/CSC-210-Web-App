//Mysql 
//run npm install mysql to be able to use mysql

CREATE TABLE listing (
  id int(11) NOT NULL AUTO_INCREMENT,
  itemName varchar(50),
  itemCondition varchar(50),
  itemDescription varchar(500),
  itemPrice varchar(50),
  username varchar(50),
  fname varchar(50),
  lname varchar(50),
  phone varchar(50),  
  year int(11),
  icon varchar(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO listing (id,itemName,itemCondition,itemDescription,itemPrice,username, fname,lname,phone,year,icon) VALUES
(1, 'iphone' , 'new' , 'great product' , '45.00' , 'jbill3@.u.rochester.edu',  'jeremiah','bill','7167717542','2018','bear.jpg')
; 	