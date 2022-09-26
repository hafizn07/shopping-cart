var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {

  let products = [
    {
      name: "iPhone 14",
      category: "Mobile",
      description: "Apple iPhone 14 128 GB (Blue, 4 GB RAM)",
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSytIqV8jlwe2AZ2yv7PiII2tpoE0kMglMPMROgOcOdd0ZiFWIr1bbMShAVOpm3ZCx5fng42B28k9yHVO-d_0OkLHlR8xV_Zz02rQdwQg4&usqp=CAE"
    },
    {
      name: "iPhone 14 Plus",
      category: "Mobile",
      description: "Apple iPhone 14 Plus 256 GB (Black, 6 GB RAM)",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSmKmknHKaf2LBLq-Z1qCEyEzo_f4Cd9emu0xlTImvWRptK0dVqZLUYQXuIBuRja0cA4bfNoK1HlFwBMttMHOqBiKelxoMgTiO9lPJHT-h6sb2DIySFl8wtuw&usqp=CAE"
    },
    {
      name: "iPhone 14 Pro",
      category: "Mobile",
      description: "Apple iPhone 14 Pro 128 GB (violet, 6 GB RAM)",
      image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ1Y3G_UFZpVkUwMQP4pOMvpvkkQEqcpjCfWXZqsiwqqghgP7D2SMLtRJvC43JPRJoZhmTp7KR5E0HfDvw_FoH7dp3ZkU3pyL8SN2E4iNAJGy5xcFNhxv0W&usqp=CAE"
    },
    {
      name: "iPhone 14 Pro Max",
      category: "Mobile",
      description: "Apple iPhone 14 Pro Max 512 GB (Blue, 8 GB RAM)",
      image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQD_kmVDoYT-fl_nnn_jl2Okd6cWsxmKfFkHUJW0nLcecuCPpTYMpjwXxc1kD2McS4fJx-DM4UQzJQoJ6pgnfFt6DEnGALuSvNIb5WEONmpcE32T71PpUsrmw&usqp=CAE"
    }
  ]

  res.render('admin/view-products', {admin:true, products})
});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {
  console.log(req.body);
  console.log(req.files.Image);

  productHelper.addProduct(req.body, (id) => {
    image = req.files.Image
    image.mv('./public/product-images/'+id+'.jpg', (err, done) => {
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
  })
})

module.exports = router;
