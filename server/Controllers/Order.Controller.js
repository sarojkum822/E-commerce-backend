// controllers/orderController.js
import OrderModel from '../Models/Order.Model.js';
import OrderItemModel from '../Models/OrderItem.Model.js';
import ProductModel from '../Models/Product.Model.js';

// Place Order
export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    let totalAmount = 0;
    let orderItems = [];

    for (const item of items) {
      const product = await ProductModel.findById(item.product);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      const orderItem = await OrderItemModel.create({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      orderItems.push(orderItem._id);
      totalAmount += product.price * item.quantity;
    }

    const order = await OrderModel.create({
      user: req.user._id,
      items: orderItems,
      totalAmount
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Order History
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await OrderModel.find({ user: req.user._id }).populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Single Order
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product'
      }
    });

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled" });
    }

    order.status = 'cancelled';
    await order.save();

    // Restock products
    for (const itemId of order.items) {
      const orderItem = await OrderItemModel.findById(itemId);
      const product = await ProductModel.findById(orderItem.product);

      product.stock += orderItem.quantity;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
