var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  
  productHelper.getAllProducts()
  .then((products) => {
    res.render('user/view-products', { title: 'Shopping Cart', products, admin: false })
  })
});

router.get('/login', (req, res) => {
  res.render('user/login', { title: 'Shopping Cart | Login' })
})
router.get('/signup', (req, res) => {
  res.render('user/signup', { title: 'Shopping Cart | Sign Up' })
})

module.exports = router;
