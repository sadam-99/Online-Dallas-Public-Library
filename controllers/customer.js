var express = require('express');
var router = express.Router();
// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
router.use(express.json());
var userModel = require.main.require('./models/userModel');
var bookModel = require.main.require('./models/bookModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/home', (req, res)=> {
    userModel.totalBooksBorrowedByCustomer(req.session.customer, (booksBorrowed)=> {
        if(!booksBorrowed){
            res.send("nothing here");
        }
        else {
            res.render('customer/home', {tbbbc: booksBorrowed.length});
            // res.send("Welcome the the Library")
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
      gender: req.body.gender
    };

    validator.validate(data, (errors, fields)=> {
        if(!errors){
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
            console.log(fields);
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

    if(req.body.password == req.body.oldPassword){
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

router.get('/books', (req, res)=> {
    bookModel.getUnborrowedBooks((result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            res.render('customer/books', {res: result, errs: []});
        }
    });
});


router.post('/books', (req, res)=> {

    console.log("request recieved, ", JSON.stringify(req.body));

    // console.log("request recieved: ", JSON.stringify(req.body))
    // if (req.body.booksIds)
        // console.log(req.body.booksIds);
    // rectified the searchBy and word

    if (req.body.booksId) {
        console.log("The  borrowed book are", req.body.booksId);
        res.send("the selected books are borrowed");
        var bookID_borrowed = req.body.booksId
        // Insert Query those Books IDs
    } else {
        var searchBy = req.body.searchBy;
        var word = req.body.word;
        
        bookModel.customerSearch(searchBy, word, (result)=> {
            if(!result){
                res.render('customer/books', {res: [], errs: [{message: "No results found!"}]});
            }
            else {
                // After success
                // console.log(result);
                // console.log($_POST['Book_IDs']);
                // console.log("kshnkns");
                // function mainjsfunction(value)
                //         {
                //             console.log(value);
                //         }
                res.render('customer/books', {res: result, errs: []})
                res.end("Hello Shibam");
                
                // var checked = req.body['check'];
                // var checked = req.body.check;
                
                // console.log(req.body.check);
                // alert(checked);
                // res.json({message: "hello"});
            }
        });
    }
});

// console.log(c);
// router.post('/books', (req, res) => {
//     console.log(req.body.booksIds);
//     // res.send("Hello Shibam");
//     res.send(`The issued boooks IDs are:${req.body.booksIds} `);
//   });

// $_POST['Book_IDs']
// console.log($_POST['Book_IDs']);
// console.log("kshnkns");


// for borrowing Books
router.get('/books/borrowed', (req, res)=> {
    
    bookModel.getUserBorrow(req.session.customer, books, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('customer/borrowed-books', {res: result});
            // res.send("borrowed boooks");
        }
    });
});

router.get('/books/returnbooks', (req, res)=> {
    bookModel.borrower_return(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('customer/borrowed-books', {res: result});
        }
    });
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
    userModel.getUserHistory(req.session.customer, (result)=> {
        if(!result){
            res.send("Invalid");
        }
        else {
            console.log(result);
            res.render('customer/borrow-history', {res: result});
        }
    });
});

// Study room 
router.get('/studyroom', (req, res)=> {
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
