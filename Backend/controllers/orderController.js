import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    let totalAmount = 0;
    const orderItems = [];
    let shopkeeperId = null;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || product.status !== "approved") {
        return res.status(400).json({ message: "Invalid product" });
      }

      if (product.quantityAvailable < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      if (!shopkeeperId) {
        shopkeeperId = product.shopkeeper;
      } else if (shopkeeperId.toString() !== product.shopkeeper.toString()) {
        return res
          .status(400)
          .json({ message: "Products must be from same shopkeeper" });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 2. Create Order
    const order = await Order.create({
      orderedBy: req.user.id,
      shopkeeper: shopkeeperId,
      totalAmount,
      deliveryAddress,
    });

    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        order: order._id,
      });

      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantityAvailable: -item.quantity },
      });
    }

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderedBy: req.user.id })
      .populate("shopkeeper", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getShopkeeperOrders = async (req, res) => {
  try {
    const orders = await Order.find({ shopkeeper: req.user.id })
      .populate("orderedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["accepted", "shipped", "delivered", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.shopkeeper.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderedBy", "name email")
      .populate("shopkeeper", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createOrder,
  getMyOrders,
  getShopkeeperOrders,
  updateOrderStatus,
  getAllOrders
};
