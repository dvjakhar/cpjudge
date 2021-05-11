const User = require('../models/User');
module.exports = function(app, passport) {

    app.post('/register', function(req, res, next) {
        var Email = req.body.email;
        var Username = req.body.username;
        var Password = req.body.password;
        User.findOne({ email: Email }, function(err, foundUser){
            if(err){
                console.log(err);
                res.json({error: err})
            }else if(foundUser){
                res.json({error: "Sorry, this username is already taken"})
            }else{
                User.register({ email: Email, username: Username }, Password, function(err, user) {
                    if(!user){
                        res.json({error: "Sorry, this username is already taken"})
                    }else{
                        res.json(user)
                    }
                });
            }
        });
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) {
            console.log(err)
            res.json({error: err})
        }
          if (!user) { 
            res.json({error: "Username and password did not match !  Please try again !!!"})
        }
          req.logIn(user, function(err) {
            if (err) { 
                console.log(err)
                res.json({error: err})
            }
            res.json({user})
          });
        })(req, res, next);
      });

    // logout
    app.post('/logout', function(req, res) {
        if (req.isAuthenticated()) {
            req.logout();
            // req.session.destroy();
            // res.redirect('/login');
            res.json({successMsg: "Successfully Logout"})
        } else {
            // res.redirect('/login');
            res.json({error: "error msg"})
        }
    });

    // redirect to home
    app.get('/isUserLoggedIn', function(req, res) {
        if(req.user){
            res.json({user: req.user})
        } else {
            res.json({user: null})
        }
    });
}