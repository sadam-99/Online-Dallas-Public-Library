var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/userModel');
var bookModel = require.main.require('./models/bookModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/home', (req, res)=> {
    userModel.totalBooksBorrowedByCustomer(req.session.customer, (booksBorrowed)=> {
        if(!booksBorrowed){
            res.send("nothing here");
        }
        else {
            userModel.GetUserName(req.session.customer, (Username)=> {
           
            console.log("The Books borrowed response is:", booksBorrowed)
            console.log("The Username Rowdata", Username);
            console.log("The Username NAME", Username[0].name);
            res.render('customer/home', {res: booksBorrowed, res_name: Username});
        });
        }
    });
});

router.get('/profile', (req, res)=> {
    var customer = userModel.getUser(req.session.customer, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('customer/profile', {res: result});
        }
    });
});
router.post('/profile', (req, res) => {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
 
    var file = req.files.uploaded_image;
 
    var id = req.body.user_id;
    
    var img_name= id + "_" + file.name;


    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){                  
        file.mv('images/uploads/customer/'+img_name, function(err) {
        })
    }
        console.log("Going into pic");
        if (req.body.uploadButton == "picname")
        {
             userModel.profilePicture(id, img_name, (result)=> {
                console.log("Inside pic");
                console.log(result);
                 if(!result){
                   res.send("Invalid");
                 }
                else {
                    console.log(img_name);
                    res.render('customer/profile', {res: result });
              }
                });
        } 
});



router.get('/profile/edit', (req, res)=> {
    var customer = userModel.getUser(req.session.customer, (result)=> {
        if(!result){
            res.send("invalid");
        }
        else {
            console.log(result);
            res.render('customer/profile-edit', {res: result, errs: []});
        }
    });
});

router.post('/profile/edit', (req, res)=> {
    var rules = validationRules.users.update;
    var validator = new asyncValidator(rules);
    var data = {
      user_id: req.body.user_id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
	  box:req.body.box
    };
	console.log("data",data);
    validator.validate(data, (errors, fields)=> {
        if(!errors){
			console.log("hi");
			
            userModel.updateUser(data, (result)=> {
                if(!result){
                    res.send('invalid');
                }
                else {
                    res.redirect('/customer/profile');
                }
            });
        }
        else {
            //console.log(fields);
            res.render('customer/profile-edit', {errs: errors, res: []});
        }
    });
});

router.get('/changepass', (req, res)=> {
    var customer = userModel.getUser(req.session.customer, (result)=> {
        if(!result){
            res.send("invalid!");
        }
        else {
            console.log(result);
            res.render('customer/change-password', {res: result, errs: [], success: []});
        }
    });
});

router.post('/changepass', (req, res)=> {
    var rules = validationRules.users.changePassword;
    var validator = new asyncValidator(rules);
    var data = {
      oldPassword: req.body.oldPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword
    };
	bcrypt.compare(req.body.oldPassword, req.body.password, (err, result1) => { 
		if(!err){
			validator.validate(data, (errors, fields)=> {
				if(!errors){
					if(req.body.newPassword == req.body.confirmPassword){
						userModel.updatePassword(req.body.newPassword, req.body.user_id, (result)=> {
							if(!result){
								res.send('invalid');
							}
							else {
								res.render('customer/change-password', {errs:[], res: [], success: [{message: "Password changed successfully"}]});
							}
						});
					}
					else {
						res.render('customer/change-password', {errs:[{message: "Your new passwords don't match!"}], res: [], success: []});
					}
				}
				else {
					console.log(fields);
					res.render('customer/change-password', {errs: errors, res: [], success: []});
				}
			});
		}
		else {
			res.render('customer/change-password', {errs: [{message: "Your old passsword does not match!"}], res: [], success: []});
		}
	});
});
// Getting all the books from the DB with Pagination
router.get('/books', (req, res)=>
{
    bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
            console.log(result);
            console.log("total no of books displyaed", result.length);
            var totalbooks = result.length
            var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                    // books.push({name: result[i]});
                }
            console.log("=========type of response  are==============:", typeof books)
            
            res.redirect('/customer/bookspage1');
        }
          console.log("Rendering");
    });
});

router.get('/bookspage1', (req, res)=>
{ bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage1', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});

router.get('/bookspage2', (req, res)=>
{ bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage2', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});
router.get('/bookspage3', (req, res)=>
{ bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage3', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});
router.get('/bookspage4', (req, res)=>
{ bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage4', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});
router.get('/bookspage5', (req, res)=>
{ bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage5', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});
router.get('/bookspage6', (req, res)=>
{ 
    console.log("Page 6");
    bookModel.getUnborrowedBooks((result)=> 
    {
            if(!result)
            {
                res.send("Invalid");
            }
        else 
        {
        var totalbooks = result.length
        var books = []
            for(var i = 0; i < totalbooks; i++) 
                {
                    books.push(result[i]);
                }
            res.render('customer/bookspage6', 
            {
                res: books,
                errs: [], success: []
            });
        }
        console.log("Rendering");
    });
});

router.post('/books', (req, res)=> {
	var data = req.body.box;
    
	
    // rectified the searchBy and word
    var searchBy = req.body.searchBy;
	console.log("searchby", searchBy);
    var word = req.body.word;
	console.log("word", word);
	if(typeof data === 'undefined'){
		console.log(" if");
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				console.log("result",result);
				res.render('customer/books', {res: result, errs: [], success: []})
				
			}
		});
    }
    // The box have been checked and are ready to be inserted into CART
	else{
		console.log("hey inside else if");
		console.log("box", data);
		//res.render('customer/books', {res: result, errs: []})
		//bookCartInsert
		//bookModel.bookBorrowInsert(req.session.customer, data, (result)=> {
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
				console.log("no result in borrow books");
				//res.render('customer/books', {res: [], errs: [{message: "No results found!"}]});
			}
			else {
				console.log("borrow books ",result);
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books are borrowed"}]});
				//res.render('customer/books', {success:[{message: "Books are borrowed"}], res: [], success: []});
			}
		});
		
		
	}
});
router.post('/bookspage1', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
    
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});
router.post('/bookspage2', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});
router.post('/bookspage3', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});
router.post('/bookspage4', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});
router.post('/bookspage5', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});
router.post('/bookspage6', (req, res)=> {
	var data = req.body.box;
    var searchBy = req.body.searchBy;
    var word = req.body.word;
	if(typeof data === 'undefined'){
		bookModel.customerSearch(req.session.customer,searchBy, word, (result)=> {
			if(!result){
				res.render('customer/books', {res: [], errs: [{message: "No results found!"}], success: []});
			}
			else {
				res.render('customer/books', {res: result, errs: [], success: []})
			}
		});
    }
	else{
		bookModel.bookCartInsert(req.session.customer, data, (result)=> {
			if(!result){
			}
			else {
				res.render('customer/books', { res: [], errs:[], success: [{message: "Books Added to Cart, Please Check CART"}]});
			}
		});	
	}
});

router.get('/cart', (req, res)=> {
    console.log("hi i m inside cart get");
    bookModel.getCart(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            res.render('customer/cart', {res: result, errs: [], success: []})
        }
    });
});

router.post('/cart', (req, res)=> {
	var data = req.body.box;
    var remove_item = req.body.remove_item;
    console.log("data ", data);
    if(typeof data === 'undefined')
    {
        res.redirect('/customer/cart');
    }
    
    else{

   
	console.log("remove_item ", remove_item);
    console.log("hi i m inside cart post");
	console.log(req.body.borrow);
	if(req.body.remove_item == "remove_item"){
		bookModel.deleteCart(req.session.customer,data, (result)=> {
			if(!result){
				res.send("Invalid");
			}
			else {
				res.render('customer/cart', {res: result, errs: [], success: []})
			}
		});
	}
	else {
		console.log("data ", data);
		bookModel.bookBorrowInsert(req.session.customer, data, (result)=> {
			if(!result){
				res.send("Invalid");
			}
			else {
				res.render('customer/cart', { res: result, errs:[], success: [{message: "Check Borrowed history"}]});
				//res.render('customer/cart', {res: result});
			}
		});
    }
    
    }
	
});

// for borrowed Books
router.get('/books/borrowed', (req, res)=> {
    console.log("hi i m inside borrow");
    bookModel.getUserBorrow(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            res.render('customer/borrowed-books', {res: result});
        }
    });
});

// For books Return
router.get('/returnbooks', (req, res)=> {
	console.log("hi i m inside return");
    bookModel.borrower_return(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log("return books ", result);
            res.render('customer/returnbooks', {res: result, errs: [], success: []});
        }
    });
});

// Returning the books increase the no. of copies
router.post('/returnbooks', (req, res)=> {
	var data = req.body.box;
    console.log("data is:", data);
    if(typeof data === 'undefined')
    {
        res.redirect('/customer/returnbooks');
    }
    else
    {
    
    bookModel.generate_fine(req.session.customer, data, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log("return books ", result);
            //res.render('customer/returnbooks', {res: result});
			res.render('customer/returnbooks', { res: result, errs:[], success: [{message: "Books are returned"}]});
        }
    });
}
});


// For Fine Payment
router.get('/fines', (req, res)=> {
	console.log("hi i m inside fine get");
    bookModel.fine_payment(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log("return books ", result);
            res.render('customer/fines', {res: result, errs: [], success: [{message:"Payment History"}]});
        }
    });
});
// bookModel.fine_transaction
router.post('/fines', (req, res)=> {
    console.log("hi i m inside fine post");
    if(req.body.fine_txn == "total_fine") {
        console.log("I m inside fine transaction");
        bookModel.fine_transaction(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log("return books ", result);
            res.render('customer/fines', {res: result, errs: [], success: ["Payment Tramsaction Is Successful"]});
        }
    });
    }
});


router.get('/books/request', (req, res)=> {
    res.render('customer/books-request', {errs: [], success: []});
});

router.post('/books/request', (req, res)=> {
    var data = {
        genre: req.body.genre,
        title: req.body.title,
        author: req.body.author,
        edition: req.body.edition,
        isbn: req.body.isbn
    };

    var rules = validationRules.books.request;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=> {
        if(!errors){
            bookModel.bookRequest(req.session.customer, data, (result)=> {
                if(result.length == 0){
                    res.send("Invalid");
                }
                else {
                    res.render('customer/books-request', {errs: [], success: [{message: "Your request has been noted, thank you!"}]});
                }
            });
        }
        else {
            console.log(fields);
            res.render('customer/books-request', {errs: errors, success: []});
        }
    });
});
router.get('/books/history', (req, res)=> {
    bookModel.getUserHistory(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid"); 
        }
        else {
            console.log(" The current user is:", req.session.customer);
            console.log("History for the user", result);
            res.render('customer/borrow-history', {res: result});
        }
    });
});

// Study room 
router.get('/studyroom', (req, res)=> {
    console.log("inside room")
    bookModel.getUserRooms(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('customer/studyroom', {res: result});
        }
    });
});

module.exports = router;
