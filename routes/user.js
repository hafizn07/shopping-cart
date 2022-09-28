var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.user
  console.log(user);
  productHelper.getAllProducts()
  .then((products) => {
    res.render('user/view-products', { title: 'Shopping Cart', products, user, admin: false })
  })
});

/* LogIn Functionality. */
router.get('/login', (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login', { title: 'Shopping Cart | Login', "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body)
  .then((response) => {
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }else{
      req.session.loginErr = true
      res.redirect('/login')
    }
  });
})


/* SignUp Functionality. */
router.get('/signup', (req, res) => {
  res.render('user/signup', { title: 'Shopping Cart | Sign Up' })
})

router.post('/signup', (req, res) => {
  userHelper.doSignUp(req.body)
  .then((response) => {
    console.log(response);
  })
})


/* LogOut Functionality. */
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
