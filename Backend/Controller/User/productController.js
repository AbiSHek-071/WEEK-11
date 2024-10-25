const bcrypt = require("bcrypt");
const product = require("../../Models/product");



async function fetchnewarraivals(req, res) {
  try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 5;
     const skip = (page - 1) * limit;
     const totalProduct = await product.countDocuments();


    const productData = await product
      .find({ isActive: true })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name",
      })
      .skip(skip)
      .limit(limit);;
    const filteredProductData = productData.filter(
      (prod) => prod.category !== null
    );

    if (!productData) {
      return res
        .status(404)
        .json({ message: "Unable to fetch Image", success: false });
    }
    return res.status(200).json({
      message: "products fetched successfully",
      success: true,
      productData: filteredProductData,
      currentPage: page,
      totalPages: Math.ceil(totalProduct / limit),
      totalProduct,
    });
  } catch (err) {
    console.log(err);
  }
}
async function fetchproduct(req, res) {
  try {
    const { id } = req.body;
    const productData = await product.findById({ _id: id });

    if (!productData) {
      return res
        .status(404)
        .json({ success: true, message: "Unable to Find the Product," });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Product Fetched",
        product: productData,
      });
  } catch (err) {
    console.log(err);
  }
}


async function fetchRelatedProducts(req, res) {
  try {
    const { categoryId } = req.body;
    const productData = await product
      .find({ category: categoryId, isActive: true })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name",
      });
    const filteredProductData = productData.filter(
      (prod) => prod.category !== null
    );

    if (!productData) {
      return res
        .status(404)
        .json({ message: "Unable to fetch Image", success: false });
    }
    return res.status(200).json({
      message: "products fetched successfully",
      success: true,
      productData: filteredProductData,
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  fetchproduct,
  fetchnewarraivals,
  fetchRelatedProducts
};
