var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
var userHelper = require("../helpers/user-helpers");

/* Created a middleware to check whether a user logged In or not */
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  let cartCount = null;
  if (req.session.user) {
    cartCount = await userHelper.getCartCount(req.session.user._id);
  }

  productHelper.getAllProducts().then((products) => {
    res.render("user/view-products", {
      title: "Shopping Cart",
      products,
      user,
      cartCount,
      admin: false,
    });
  });
});

/* LogIn Functionality. */
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/login", {
      title: "Shopping Cart | Login",
      loginErr: req.session.userLoginErr,
    });
    req.session.userLoginErr = false;
  }
});

router.post("/login", (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      res.redirect("/");
    } else {
      req.session.userLoginErr = true;
      res.redirect("/login");
    }
  });
});

/* SignUp Functionality. */
router.get("/signup", (req, res) => {
  res.render("user/signup", { title: "Shopping Cart | Sign Up" });
});

router.post("/signup", (req, res) => {
  userHelper.doSignUp(req.body).then((response) => {
    console.log(response);
    req.session.user = response;
    req.session.user.loggedIn = true;
    res.redirect("/");
  });
});

/* LogOut Functionality. */
router.get("/logout", (req, res) => {
  req.session.user = null
  req.session.userLoggedIn = false
  res.redirect("/");
});

router.get("/cart", verifyLogin, async (req, res) => {
  let products = await userHelper.getCartProducts(req.session.user._id);
  let totalAmount = 0
  if (products.length>0) {
    totalAmount = await userHelper.getTotalAmount(req.session.user._id);
  }
  console.log(products);
  res.render("user/cart", {
    title: "Your cart",
    products,
    totalAmount,
    user: req.session.user._id,
  });
});

router.get("/add-to-cart/:id", (req, res) => {
  console.log("api call");
  userHelper.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true });
  });
});

router.post("/change-product-quantity", (req, res, next) => {
  userHelper.changeProductCount(req.body).then(async (response) => {
    response.total = await userHelper.getTotalAmount(req.body.user);
    res.json(response);
  });
});

router.get("/place-order", verifyLogin, async (req, res) => {
  let total = await userHelper.getTotalAmount(req.session.user._id);
  res.render("user/place-order", { total, user: req.session.user });
});

router.post("/place-order", async (req, res) => {
  let products = await userHelper.getCartProductList(req.body.userId);
  let totalPrice = await userHelper.getTotalAmount(req.body.userId);
  userHelper.placeOrder(req.body, products, totalPrice).then((orderId) => {
    if (req.body == ['payment-method'] === 'COD'){
      res.json({ codSuccess: true });
    }else {
      userHelper.generateRazorpay(orderId, totalPrice).then((response) => {
        res.json(response)
      })
    }
  });
  console.log(req.body);
});

router.get("/order-success", (req, res) => {
  res.render("user/order-success", { user: req.session.user });
});

router.get("/orders", async (req, res) => {
  let orders = await userHelper.getUserOrders(req.session.user._id);
  res.render("user/orders", { user: req.session.user, orders });
});
router.get("/view-order-products/:id", async (req, res) => {
  let products = await userHelper.getOrderProducts(req.params.id);
  res.render("user/view-order-products", { user: req.session.user, products });
});

router.post("/verify-payment", (req, res) => {
  console.log(req.body);
  userHelper.verifyPayment(req.body).then(() => {
    userHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      console.log('Payment success');
      res.json({status: true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status: false, errMsg:''})
  })
})

module.exports = router;
