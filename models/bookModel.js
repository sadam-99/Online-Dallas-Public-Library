var db = require.main.require('./models/config');
// get all books from Books DB

var getAll = (callback) => {
    
    var sql = "SELECT * FROM books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var getAllIssuedBooks = (callback) => {
    var sql = "SELECT B.book_id,B.image, B.genre, B.title, B.author, B.edition, B.isbn, IB.issue_id, IB.user_id, IB.issue_date, IB.due_date FROM issue_books IB, books B where B.book_id = IB.book_id and is_return=0";
    // var sql = "SELECT * FROM books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var searchBy = (searchBy, word, callback) => {
    var sql = "SELECT * FROM books WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};

//return books
var borrower_return = (id, callback) => {
    var sql = "";
    var sql = "SELECT b.issue_id, a.book_id,a.title,a.genre,a.author,a.edition,b.due_date,b.issue_date, a.image FROM books a , issue_books b WHERE a.book_id in (select book_id from issue_books where issue_books.user_id = ?) and a.book_id = b.book_id and b.is_return = 0";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

// For Creating a new book with no of copies
var createBook = (book, callback) => {
    var date_added = new Date();
    var sql = "INSERT INTO books VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)";
    db.executeQuery(sql, [book.genre, book.title, book.author, book.publisher, book.edition, book.isbn, book.pages, date_added, book.copies, book.image], function(result) {
        callback(result);
    });
};

var getBook = (id, callback) => {
    var sql = "SELECT * FROM books WHERE book_id=?";
    db.executeQuery(sql, [id], function(result) {
        callback(result[0]);
    });
};

var updateBook = (id, book, callback) => {
    var sql = "UPDATE books SET genre = ?, title = ?, author = ?, publisher = ?, edition = ?, isbn = ?, pages = ?, no_copies = ?, image =? WHERE book_id = ?";
    db.executeQuery(sql, [book.genre, book.title, book.author, book.publisher, book.edition, book.isbn, book.pages, book.copies,book.image, id], function(result) {
        console.log("Image updated")
        callback(result);
    });
};

// var deleteBook = (id, callback) => {
//     var sql = "DELETE FROM books WHERE book_id = ?";
//     db.executeQuery(sql, [id], function(result) {
//         callback(result);
//     });
// };

var issueBook = (book_id, customer_id, callback) => {
    var issue_date = new Date();
    var due_date = addDays(now , 7); // Add 7 days
    var sql = "INSERT INTO issue_books VALUES(null, ?, ?, ?, ?, 0)";
    
    db.executeQuery(sql, [book_id, customer_id, issue_date, due_date], function(result) {
        callback(result);
    });
};

var unissueBook = (book_id, callback) => {
    // Delete that row to unissue from the issue_books table
    var sql = "DELETE FROM issue_books WHERE is_return='False' and book_id = ?";
    db.executeQuery(sql, [book_id], function(result) {
        console.log("The Book to be Unissued by Admin is deleted");
        callback(result);
    });
};


var getUnborrowedBooks = (callback) => {
    var sql = "SELECT * FROM books WHERE no_copies>0";
    // var sql = "SELECT * FROM books WHERE no_copies>0";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};


//  for book requests
var bookRequest = (customer_id, book, callback) => {
	//console.log(customer_id);
    var date = new Date();
    var sql = "INSERT INTO books_request VALUES(null, ?, ?, ?, ?, ?, ?, ?)";
    db.executeQuery(sql, [customer_id, book.genre, book.title, book.author, book.edition, book.isbn, date], function(result) {
        callback(result);
    });
};

// get cart--getCart
var getCart = (customer_id, callback) => {
	
    var sql = "Select * from books where book_id in (select book_id from cart where user_id = ?)";
    db.executeQuery(sql, [customer_id ], function(result) {
        console.log(" getCart", result);	 
		callback(result);
    });
};
// delet items from cart-- deleteCart
var deleteCart = (customer_id, book_id, callback) => {
	 if(typeof book_id == "string")
		 book_id = book_id.split();
	 //var arr =[parseInt(book_id[0])];
	 var arr = [];
	 for(var i=0; i< book_id.length;i++){
		 arr.push(parseInt(book_id[i]));
	 }
	 console.log(arr);
    var sql = "delete from cart where book_id in ( ? ) and user_id = ? ";
    db.executeQuery(sql, [arr,customer_id ], function(result) {
        console.log(" data delete from cart ", result);	 
    });
	
	
		getCart(customer_id, (result)=> {
			if(!result){
				res.send("Invalid");
			}
			else {
				callback(result);
			}
		});
	
};


// TODO: Change the Query
//  for book Boorrowing(Issuing) --- to show borrowed books
var getUserBorrow = (customer_id, callback) => {
	
    var sql = "Select a.*,b.due_date from books a , issue_books b where a.book_id in (select book_id from issue_books where issue_books.user_id = ? and is_return = 0) and a.book_id = b.book_id and b.is_return = 0;";
    db.executeQuery(sql, [customer_id ], function(result) {
        console.log(" getUserBorrow", result);	 
		callback(result);
    });
};




//  for book searching (browsing)  includinf the Soft deleted Functionality
var customerSearch = (customer_id, searchBy, word, callback) => {
	//console.log("hey inside if");
    // rectified the searchBy and word
    var sql = "(SELECT * FROM books WHERE "+ searchBy + " = ? and no_copies>0 and soft_delete=0 and book_id not in (select book_id from issue_books where issue_books.user_id = ? and is_return = 0)) ";
    db.executeQuery(sql, [word,customer_id], function(result) {
        callback(result);
    });
};


function addDays(dateObj, numDays) {
   dateObj.setDate(dateObj.getDate() + numDays);
   return dateObj;
}
 


var bookBorrowInsert = (user_id, book_id, callback) => {
	console.log("hey inside else if");
	console.log("book_id", book_id);
	if(typeof book_id == "string")
	book_id = book_id.split();
	// Date thing
	var now = new Date(); //Current date
	var curr_date = new Date();
	console.log("cuur_date" , curr_date); 
	var due_date = addDays(now , 7); // Add 7 days
	console.log("now ", now, " due ", due_date);

	//console.log("newDate", newDate); 
	var arr = [];
	//var arr = [[parseInt(book_id[0]),user_id, curr_date ,due_date]];
	 for(var i=0; i< book_id.length; i++){
		arr.push([parseInt(book_id[i]),user_id , curr_date ,due_date]);
	}
	console.log("array is", arr); 
     // rectified the searchBy and word
   // var sql = "(SELECT * FROM books WHERE "+ searchBy + " = ?)";
   	
      var sql = "INSERT INTO issue_books (book_id, user_id, issue_date, due_date) VALUES ?";
    db.executeQuery(sql, [arr], function(result) {
        //callback(result);
    }); 
		
		deleteCart(user_id,book_id, (result)=> {
			if(!result){
				res.send("Invalid");
			}
			else {
				callback(result);
			}
		});
};

var book_check = (arr, callback) => {
	 
};

// Insert data entries in cart
var bookCartInsert = (user_id, book_id, callback) => 
{
	if(typeof book_id == "string")
		 book_id = book_id.split();
	console.log("typeof book_id", typeof book_id);
	console.log("book_id", book_id);

	//console.log("newDate", newDate); 
	
	 var book_arr = [];
	
	var sql_query = "Select book_id from cart where user_id = ?";
    db.executeQuery(sql_query, [user_id], function(result_data) 
    {
        for (i in result_data) 
        {
            //console.log(" result_data[i]",  result_data[i])
            book_arr.push(result_data[i].book_id );
        }
        
        //callback(result); 
        
        // console.log("books already in cart", book_arr);
        var arr = [];
        //var arr = [[parseInt(book_id[0]),user_id]];
        for(var i=0; i< book_id.length; i++)
            {
                if(! book_arr.includes(parseInt(book_id[i])))
                arr.push([parseInt(book_id[i]),user_id]);
            }
        console.log("final arr",arr);
        console.log("book arr",book_arr);
        var cart_date = new Date();
        console.log("cart arr", arr);
        if(arr.length >0)
            {
                var sql = "INSERT INTO cart (book_id, user_id) VALUES ?";
                db.executeQuery(sql, [arr], function(result) 
                {
                    console.log("cart date added");
                            callback(result);
                });	
                // decrease the number of copies
                var dec_query = "UPDATE books SET no_copies =no_copies-1 where book_id in (?)";
                console.log("REDUCE COPIES FOR BOOK id", book_arr);
                db.executeQuery(dec_query, [book_id], function(result) 
                {
                    console.log("updated Copies");
                }); 			
            }
        else
            callback(result_data); 
            
	});
};

//Fine generation
function fine_calculation(book_id){
	var return_date = new Date();
	return_date.setHours(0,0,0,0);
	var id_date = book_id.split(",");
	
	var due_date = new Date(id_date[2]);
	//console.log("id_date ", id_date[2]);
	var fine ;
	due_date.setHours(0,0,0,0);
	due_date.setDate(due_date.getDate() + 1);
	console.log("due_date ", due_date," return_date ", return_date );
	if(due_date.getTime() < return_date.getTime())
	{
		//fine =10;
		var Difference_In_Time = return_date.getTime() - due_date.getTime(); 
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
		console.log("Difference_In_Days",Difference_In_Days); 
		fine = 0.75 * Difference_In_Days ; 
	}
	else
		fine =0;
	console.log(fine);
	return fine;
}

var generate_fine = (user_id, book_id, callback) => 
{
	console.log("checked Book are:", book_id);
	//var book_id;
	if(typeof book_id == "string")
		 book_id = book_id.split();
	book_id_array = []
    for(var i=0 ; i< book_id.length; i++)
    {
        book = book_id[i].split(",");
        book_id_array.push([parseInt(book[1])]);
    }
	var fine ;
	var return_date ;
	var book;
	var arr = [];
	 var issue_id_arr= [];
	for(var i=0 ; i< book_id.length; i++){
			console.log("why am i cming inside");
		 book = book_id[i].split(",");	
		 fine = fine_calculation(book_id[i]);
		 issue_id_arr.push(parseInt(book[0]));
		arr.push([parseInt(book[0]),user_id, parseInt(book[1]), return_date ,fine]);
	} 
	// console.log(issue_id_arr); 
	var sql_query = "update issue_books set is_return = 1 where issue_id in (?)";
	db.executeQuery(sql_query, [issue_id_arr], function(result) {
        console.log("Check db");
    }); 
    // Increasing the number of copies after returning
    var inc_query = "UPDATE books SET no_copies =no_copies+1 where book_id in (?)";
    console.log("Increase COPIES FOR BOOK id", book_id_array);
    db.executeQuery(inc_query, [book_id_array], function(result) 
    {
        console.log("updated Copies");
    }); 
    var sql = "INSERT INTO fine (issue_id, user_id, book_id, return_date,fine_amt) VALUES ?";
    db.executeQuery(sql, [arr], function(result) {
        //callback(result);
    });
    borrower_return(user_id, (result)=>
        {
            if(!result)
            {
				res.send("Invalid");
			}
			else{
				callback(result);
			    }
		});
};
// For Fine Payment
var fine_payment = (user_id, callback) => {
    var sql = "SELECT B.book_id, B.genre, B.title, B.author, F.fine_amt, B.image FROM books B, fine F WHERE F.user_id = ? and F.book_id=B.book_id and F.fine_amt>0;";
    db.executeQuery(sql, [user_id], function(result) {
        callback(result);
    });
};

// For Fine payment Transaction
var fine_transaction = (user_id, callback) => {
    var sql = "DELETE FROM FINE F WHERE F.user_id = ? and F.fine_amt>0";
    db.executeQuery(sql, [user_id], function(result) {
        callback(result);
    });
};

//  Doing the soft delete for the books
var deleteBook = (id, callback) => {
    var sql = "UPDATE  books SET soft_delete = 1 WHERE book_id = ?";
    db.executeQuery(sql, [id], function(result) {
        callback(result);
    });
};

var getRequestedBooks = (callback) => {
    var sql = "SELECT * FROM books_request";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};

var bookRequestSearch = (searchBy, word, callback) => {
    var sql = "SELECT * FROM books_request WHERE "+searchBy+" = ?";
    db.executeQuery(sql, [word], function(result) {
        callback(result);
    });
};


var setIssueDate = (book_id, customer_id, callback) => {
    var date = new Date();
    // var sql = "INSERT INTO issue_date VALUES(null, ?, ?, ?)";
    var sql = "INSERT INTO issue_books VALUES(null, ?, ?, ?)";
    db.executeQuery(sql, [book_id, customer_id, date], function(result) {
        callback(result);
    });
};

var booksIssuedByCustomer = (customer_id, callback) => {
    var sql = "SELECT * FROM issue_books WHERE user_id = ?";
    // var sql = "SELECT * FROM books WHERE user_id = ?";
    db.executeQuery(sql, [customer_id], function(result) {
        callback(result);
    });
};

//  view all borrowed books
var getAllBorrowedBooks = (callback) => {
    var sql = "SELECT * FROM issue_books";
    db.executeQuery(sql, null, function(result) {
        callback(result);
    });
};



var totalBorrowed30 = (callback) => {
    var sql = "SELECT books.*, issue_books.book_id, COUNT(*) AS magnitude FROM issue_books INNER JOIN books ON issue_books.book_id=books.book_id GROUP BY books.isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

var mostBorrowedBook = (callback) => {
    var sql = "SELECT books.*, issue_books.book_id, COUNT(*) AS magnitude FROM issue_books INNER JOIN books ON issue_books.book_id=books.book_id GROUP BY books.isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};

var mostRequestedBook = (callback) => {
    var sql = "SELECT *, COUNT(*) AS magnitude FROM books_request GROUP BY isbn ORDER BY magnitude DESC LIMIT 1";
    db.executeQuery(sql, null, function(result) {
        callback(result[0]);
    });
};
// For getting the Customer History
var getUserHistory = (cust_id, callback) => {
    var sql = "SELECT  issue_books.book_id,books.image, books.title, books.author, books.publisher, books.edition, books.isbn, issue_books.issue_date FROM issue_books, books WHERE issue_books.book_id=books.book_id and issue_books.user_id= ? ORDER BY issue_books.issue_date DESC";
    // var sql = "SELECT issue_date.user_id, issue_date.book_id, books.title, books.author, books.publisher, books.edition, books.isbn, issue_date.date FROM issue_date INNER JOIN books ON issue_date.book_id=books.book_id WHERE issue_date.user_id=?";
    console.log("fetching result fromn the Query:")
    db.executeQuery(sql, [cust_id], function(result) {
        console.log("result fromn the Query:", result)
        callback(result);
    });
};




module.exports = {
    getAll,
    searchBy,
    createBook,
    getBook,
    updateBook,
    deleteBook,
    issueBook,
    unissueBook,
    // getIssuedBooks,
    getUnborrowedBooks,
    bookRequest,
    getUserBorrow, 
    fine_payment,
    fine_transaction,
    customerSearch,
    getRequestedBooks,
    bookRequestSearch,
    setIssueDate,
    booksIssuedByCustomer,
    getAllBorrowedBooks,
    totalBorrowed30,
	book_check,
    mostRequestedBook,
	bookBorrowInsert,
	borrower_return,
	getCart,
	deleteCart,
	generate_fine,
    bookCartInsert,
    getUserHistory,
    mostBorrowedBook,
    getAllIssuedBooks };