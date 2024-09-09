// routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../Controllers/Product.Controller.js';

import { isAuthenticated, isAdmin } from '../Middlewares/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', isAuthenticated, isAdmin, addProduct);
router.put('/products/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/products/:id', isAuthenticated, isAdmin, deleteProduct);

export default router;
