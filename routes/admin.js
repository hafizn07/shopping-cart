var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelper.getAllProducts()
  .then((products) => {
    res.render('admin/view-products', {title: 'Shopping Cart | Admin', admin: true, products })
  })

});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {

  productHelper.addProduct(req.body, (id) => {
    image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  })
})

module.exports = router;
