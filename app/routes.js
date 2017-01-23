// app/routes.js

var User = require('../app/models/user.js');
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================

	app.get('/', function(req, res) {

        if(req.isAuthenticated()){
        	res.redirect('/home');
		}else {
            res.render('login.ejs', { message: req.flash('loginMessage') });
		}

	});

	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else {
            res.render('login.ejs', { message: req.flash('loginMessage') });
		}
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
        if(req.isAuthenticated()){
            res.redirect('/home');
        }else {
            res.render('signup.ejs', {message: req.flash('signupMessage')});
        }
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('index.ejs', {
			user : req.user
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/profile/:id_member',isLoggedIn, function (req, res) {
			var user_member =  req.params.id_member;
			var user = User.findOne({"_id":user_member},function (err,users) {
                if (!err) {
                    res.render('profile.ejs', {
                        user: users
                    });
                } else {
                    res.send(JSON.stringify(err), {
                        'Content-Type': 'application/json'
                    }, 404);
                }
            });
    });

    app.post('/update-profile/:id_member',function (req, res) {
        var user_member =  req.params.id_member;
        User.findOne({"_id":user_member},function (err,users) {
            if (!err) {
                users.local.name = req.body.name;
                users.local.email = req.body.email;
                users.local.image = req.body.image;
                users.save(function (err) {
                    res.render('profile.ejs', {
                        user: users
                    });
                });
            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    });

    app.get("/search_friend", isLoggedIn, function (req, res) {
        var regex = new RegExp(req.query["keyword"], 'i');
        var query = User.find({$or: [{'user.local.name': regex}, {'user.local.email': regex}]}).limit(100);
        query.exec(function (err, users) {
            if (!err) {
                res.render('search.ejs', {
                    key: req.query.keyword,
                    result: users,
                    user: req.user
                });

            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });

    });


    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
