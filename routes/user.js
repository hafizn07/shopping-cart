var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userHelper = require('../helpers/user-helpers')

/* Created a middleware to check whether a user logged In or not */
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount = null
  if (req.session.user) {
    cartCount = await userHelper.getCartCount(req.session.user._id)
  }

  productHelper.getAllProducts()
    .then((products) => {
      res.render('user/view-products', { title: 'Shopping Cart', products, user, cartCount, admin: false })
    })
});

/* LogIn Functionality. */
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { title: 'Shopping Cart | Login', "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body)
    .then((response) => {
      if (response.status) {
        req.session.loggedIn = true
        req.session.user = response.user
        res.redirect('/')
      } else {
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
      req.session.loggedIn = true
      req.session.user = response
      res.redirect('/')
    })
})


/* LogOut Functionality. */
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


router.get('/cart', verifyLogin, async (req, res) => {
  let products = await userHelper.getCartProducts(req.session.user._id)
  let totalAmount = await userHelper.getTotalAmount(req.session.user._id)
  console.log(products);
  res.render('user/cart', { title: 'Your cart', products, totalAmount, user: req.session.user })
})

router.get('/add-to-cart/:id', (req, res) => {
  console.log('api call');
  userHelper.addToCart(req.params.id, req.session.user._id)
    .then(() => {
      res.json({status: true})
    });
})

router.post('/change-product-quantity', (req, res, next) => {
  userHelper.changeProductCount(req.body).then((response)=> {
    res.json(response)
  })
})

router.get('/place-order', verifyLogin, async(req, res) => {
  let total = await userHelper.getTotalAmount(req.session.user._id)
  res.render('user/place-order', {total, user: req.session.user})
})



module.exports = router;
