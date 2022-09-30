var express = require('express');
var router = express.Router();
const fs = require('fs')
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelpers.getAllProducts()
    .then((products) => {
      res.render('admin/view-products', { title: 'Shopping Cart | Admin', admin: true, products })
    })

});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {

  productHelpers.addProduct(req.body, (id) => {
    image = req.files.Image
    image.mv('./public/images/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-product')
      } else {
        console.log(err);
      }
    })
  })
})

router.get('/delete-product/:id', (req, res) => {
  let productId = req.params.id
  productHelpers.deleteProduct(productId).then((response) => {
    res.redirect('/admin')
  })

  const path = './public/images/product-images/' + productId + '.jpg'

  try {
    fs.unlinkSync(path)
    console.log("Deleted")
  } catch (err) {
    console.error(err)
  }
})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product', { product })
})

router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body)
    .then(() => {
      res.redirect('/admin')
      if (req.files.Image) {
        let image = req.files.Image
        image.mv('./public/images/product-images/' + id + '.jpg')
      }
    })
})

module.exports = router;
