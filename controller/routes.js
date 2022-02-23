const express = require('express');
const router = express.Router();
const user = require('../model/user');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
require('./passportLocal')(passport);
require('./googleAuth')(passport);
const useRoutes = require('./userRoutes');

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    res.set(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0'
    );
    next();
  } else {
    req.flash('error_messages', 'Please Login to continue !');
    res.redirect('/login');
  }
}

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('index', { logged: true });
  } else {
    res.render('index', { logged: false });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  // get all the values
  const { email, username, password, confirmpassword } = req.body;
  // check if the are empty
  if (!email || !username || !password || !confirmpassword) {
    res.render('signup', { err: 'All Fields Required !' });
  } else if (password != confirmpassword) {
    res.render('signup', { err: "Password Don't Match !" });
  } else {
    // validate email and username and password
    // skipping validation
    // check if a user exists
    user.findOne(
      { $or: [{ email: email }, { username: username }] },
      function (err, data) {
        if (err) throw err;
        if (data) {
          res.render('signup', { err: 'User Exists, Try Logging In !' });
        } else {
          // generate a salt
          bcryptjs.genSalt(12, (err, salt) => {
            if (err) throw err;
            // hash the password
            bcryptjs.hash(password, salt, (err, hash) => {
              if (err) throw err;
              // save user in db
              user({
                username: username,
                email: email,
                password: hash,
                googleId: null,
                provide: 'email',
              }).save((err, data) => {
                if (err) throw err;
                // login the user
                // use req.login
                // redirect , if you don't want to login
                res.redirect('/login');
              });
            });
          });
        }
      }
    );
  }
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  (req, res, next) => {
    if (req.user.isAdmin === true) {
      return res.redirect('/admin');
    } else if (req.user.isAdmin === false) {
      return res.redirect('/');
    }
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

router.use(useRoutes);

router.get('/profile', checkAuth, (req, res) => {
  // adding a new parameter for checking verification
  res.render('profile', {
    username: req.user.username,
    verified: req.user.isVerified,
  });
});

router.get('/admin', checkAuth, (req, res) => {
  var mydata;
  user.find({ isAdmin: false }, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      mydata = data;
    }
    res.render('admin', { data: mydata });
  });
});

router.post('/admin/delete', (req, res) => {
  const id = req.body.id;

  user.findByIdAndRemove({ _id: id }, (err, doc) => {
    res.redirect('/admin');
  });
});

module.exports = router;
