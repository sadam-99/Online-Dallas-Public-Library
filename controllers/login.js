var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
var userModel = require.main.require('./models/userModel');
var validationRules = require.main.require('./validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/', (req, res)=>{
    res.render('login.ejs', {errs: []});
});

router.post('/', (req, res)=>{

    var data = {
        email: req.body.email,
        password: req.body.password
    };

    var rules = validationRules.users.login;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=>{
        if(!errors){
            // userModel.validateUser(req.body.email, req.body.password, function(result){
            userModel.validateUser(req.body.email, function(result){
                console.log("Validate result");
                console.log(result);
                if(!result)
                {
                  res.render('login', {errs: [{message: 'Invalid email or password'}]});
                }

                
                else
                {
                    hashedPassword = result.password;
                    bcrypt.compare(req.body.password, hashedPassword, (err, result1) => {
            if(!err)
                {
                    console.log("Password comparing");
                        console.log(result);
                        if(result.soft_delete == 1)
                        {
                            console.log("soft deleted");
                            res.render('login', {errs: [{message: 'your Account is Deactivated'}]});
                            //   res.redirect('/admin/home');
                        }
                        else if(result.is_admin == 1)
                        {
                            req.session.admin = result.user_id;
                            res.redirect('/admin/home');
                        }
                        else
                        {
                            req.session.customer = result.user_id;
                            res.redirect('/customer/home');
                        }
                }
                });
                }
            });
        }
        else
        {
            console.log(fields);
            res.render('login', {errs: errors});
        }
    });

});

module.exports = router;