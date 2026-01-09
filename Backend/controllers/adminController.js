import Product from "../models/productModel.js";


export const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" })
      .populate("shopkeeper", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Get pending products error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status;
    await product.save();

    return res.status(200).json({
      message: `Product ${status} successfully`,
    });
  } catch (error) {
    console.error("Update product status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getPendingProducts,
  updateProductStatus
};
