const express = require('express');
const router = express.Router(); 
const product = require('../controllers/products');

router.route('/').get(product.getAllProducts).post(product.createProduct);
router.route('/:id').get(product.getProduct).patch(product.updateProduct).delete(product.deleteProduct);
router.route('/company/:company').get(product.getCompanyProducts).delete(product.deleteCompanyProducts).patch(product.updateCompanyProducts);
router.route('/price/:price').get(product.getProductsByPrice);
router.route('/name/:name').get(product.getProductByName);
router.route('/search').get(product.findProducts);
module.exports = router;

