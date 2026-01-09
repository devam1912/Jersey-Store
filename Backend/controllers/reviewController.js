import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";


export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const order = await Order.findOne({
      _id: orderId,
      orderedBy: req.user.id,
      orderStatus: "delivered",
    });

    if (!order) {
      return res
        .status(403)
        .json({ message: "Order not delivered or not authorized" });
    }

    const orderItem = await OrderItem.findOne({
      order: orderId,
      product: productId,
    });

    if (!orderItem) {
      return res
        .status(400)
        .json({ message: "Product not part of this order" });
    }

    const existingReview = await Review.findOne({
      order: orderId,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      order: orderId,
      rating,
      comment,
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default{
    getProductReviews,
    createReview
}
