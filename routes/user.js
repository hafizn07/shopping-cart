var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')

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
router.post('/signup', (req, res) => {
  userHelper.doSignUp(req.body)
  .then((response) => {
    console.log(response);
  })
})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body)
  .then((response) => {
    if(response.status){
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  });
})

module.exports = router;
