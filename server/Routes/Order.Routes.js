// routes/orderRoutes.js
import express from 'express';
import {
  placeOrder,
  getOrderHistory,
  getOrderById,
  cancelOrder
} from '../Controllers/Order.Controller.js';

import { isAuthenticated } from '../Middlewares/auth.js';

const router = express.Router();

router.post('/orders', isAuthenticated, placeOrder);
router.get('/orders', isAuthenticated, getOrderHistory);
router.get('/orders/:id', isAuthenticated, getOrderById);
router.delete('/orders/:id', isAuthenticated, cancelOrder);

export default router;
