const express = require("express");
const { protect } = require("../middleware/authMidleware")
const { admin } = require("../middleware/adminMiddleware");
const { getProduct, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const multer = require('multer');
const upload = multer({ dest: 'upload/' })

const router = express.Router();
//all product
router.route('/').get(getProduct).post(protect, admin, upload.single('image'), createProduct);
// specific product 
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;

// C - POST
// R - GET
// U - UPDATE
// D - DELETE