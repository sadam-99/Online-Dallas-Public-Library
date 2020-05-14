var db = require.main.require('./models/config');
var bcrypt = require('bcrypt');
const saltRounds = 10; 


//  For Hashing
var validateUser = (email, callback) => {
    //var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
	var sql = "SELECT * FROM users WHERE email = ? ";
   // db.executeQuery(sql, [email, password], function(result) {
	  db.executeQuery(sql, [email], function(result) {
        callback(result[0]);
    });
};

// Setting the soft delete as 0
var createUser = (user, callback) => {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
    var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, null)";
    // db.executeQuery(sql, [user.name, user.phone, user.email, 0, user.password, user.address, user.gender, 0], function(result) {
        db.executeQuery(sql, [user.name, user.phone, user.email, 0, hash,user.address, user.gender, 0], function(result) {
        callback(result);
    });
});
};

var getUser = (id, callback) => {
    var sql = "SELECT * FROM users WHERE user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updateUser = (user, callback) => {
    var sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [user.name, user.email, user.phone, user.address, user.gender, user.user_id], function(result) {
        callback(result);
    });
};

var updatePassword = (password, id, callback) => {
	bcrypt.hash(password, saltRounds, function(err, hash) {
		var sql = "UPDATE users SET password = ? WHERE user_id = ?";
		db.executeQuery(sql, [hash, id], function(result) {
			callback(result);
		});
	});
};


var getAll = (callback) => {
    var sql = "SELECT * FROM users";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM users WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

var updateCustomer = (id, customer, callback) => {
    var sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?";
    db.executeQuery(sql, [customer.name, customer.email, customer.phone, customer.address, customer.gender, id], function(result) {
        callback(result);
    });
};

//  Doing the soft delete for the User
var deleteUser = (id, callback) => {
    var sql = "UPDATE users SET soft_delete = 1 WHERE user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};
// var getUserBorrow = (id, callback) => {
//     var sql = "SELECT * FROM books WHERE user_id = ?";
//     db.executeQuery(sql, [id], function(result) {
//         callback(result);
//     });
// };
var getUserHistory = (id, callback) => {
    
    var sql = "SELECT issue_books.user_id, issue_books.book_id, books.title, books.author, books.publisher, books.edition, books.isbn, issue_books.issue_date FROM issue_books INNER JOIN books ON issue_books.book_id=books.book_id WHERE issue_books.user_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var totalBooksBorrowedByCustomer = (id, callback) => {
    var sql = "SELECT IB.issue_id, IB.book_id, IB.user_id, U.name FROM issue_books IB, users U where IB.user_id = U.user_id and U.user_id=?";
    // var sql = "SELECT books.*, issue_date.book_id FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

// Function for storing the picture in the DB
var profilePicture = (id,pic,callback) => {
    var sql= "UPDATE users SET image = ? where user_id = ?" ;
    //SELECT imgage FROM users WHERE id= ?"; 
    db.executeQuery(sql,[pic, id], function(result){
      callback(result);
   });
};
// Get User Namer
var GetUserName = (cust_id,callback) => {
    var sql= "SELECT name FROM Users where user_id = ?" ;
    db.executeQuery(sql,[cust_id], function(result){
      callback(result);
   });
};

module.exports = {
    validateUser,
    createUser,
    getUser,
    updateUser,
    updatePassword,
    getAll,
    searchBy,
    updateCustomer,
    deleteUser,
    getUserHistory,
    totalBooksBorrowedByCustomer,
    profilePicture, 
    GetUserName
};
