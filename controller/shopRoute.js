const express = require('express');
const router = express.Router();
const user = require('../model/user');
const donate = require('../model/donateP');
const add = require('../model/addP');

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

router.get('/donate', checkAuth, (req, res) => {
  // adding a new parameter for checking verification
  res.render('donate');
});

router.post('/donation', checkAuth, async (req, res) => {
  const donor = req.body.donor;
  const product = req.body.product;
  const desc = req.body.desc;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;
  const Productnew = new donate({
    donor,
    product,
    desc,
    phone,
    email,
    address,
  });
  try {
    const newSave = await Productnew.save();
    res.redirect('/donation');
  } catch (e) {
    console.log(e);
  }
});

router.get('/donatedProd', checkAuth, (req, res) => {
  // adding a new parameter for checking verification
  var products;
  donate.find({ buyer: null }, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      products = data;
    }
    res.render('donatedProd', { data: products });
  });
});

router.get('/shop', checkAuth, (req, res) => {
  // adding a new parameter for checking verification
  var item;
  add.find((err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      item = data;
    }
    res.render('shopSection', { data: item });
  });
});

router.get('/admin/addProduct', checkAuth, (req, res) => {
  // adding a new parameter for checking verification
  res.render('addProd');
});

router.post('/admin/addProduct', checkAuth, async (req, res) => {
  const product = req.body.product;
  const rate = req.body.rate;
  const desc = req.body.desc;
  const NewProd = new add({
    product,
    rate,
    desc,
  });
  try {
    const newSave = await NewProd.save();
    res.redirect('/admin/addProduct');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
