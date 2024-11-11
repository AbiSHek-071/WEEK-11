const category = require("../../Models/category");
const Offer = require("../../Models/offer");
const product = require("../../Models/product");

async function addProductOffer(req, res) {
  try {
    const {
      id,
      productName,
      offerName,
      offerValue,
      offerExpairyDate,
      target_type,
    } = req.body;

    const offer = new Offer({
      name: offerName,
      offer_value: offerValue,
      target_type,
      target_id: id,
      target_name: productName,
      end_date: offerExpairyDate,
    });

    // const product = await product.find({ _id: id });
    // product.offer = offer._id;

    // await product.save();

    await offer.save();
    return res.status(200).json({
      success: true,
      message: `Offer successfuly added to ${productName}`,
    });
  } catch (err) {
    console.log(err);
  }
}

async function addCategoryOffer(req, res) {
  try {
    const {
      id,
      CategoryName,
      offerName,
      offerValue,
      offerExpairyDate,
      target_type,
    } = req.body;

    const offer = new Offer({
      name: offerName,
      offer_value: offerValue,
      target_type,
      target_id: id,
      target_name: CategoryName,
      end_date: offerExpairyDate,
    });

    // const category = await category.find({ _id: id });
    // category.offer = offer._id;

    // await category.save();
    await offer.save();
    return res.status(200).json({
      success: true,
      message: `Offer successfuly added to ${CategoryName}`,
    });
  } catch (err) {
    console.log(err);
  }
}
async function checkofferexist(req, res) {
  try {
    const { id } = req.query;
    const offer = await Offer.find({ target_id: id });

    if (!offer.length == 0) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
}
async function deleteOffer(req, res) {
  try {
    const { _id } = req.query; // Ensure _id is being passed correctly
    const data = await Offer.deleteOne({ target_id: _id });

    if (data.deletedCount === 1) {
      return res.status(200).json({ message: "Deleted successfully" });
    } else if (data.deletedCount === 0) {
      return res.status(404).json({ message: "No offer found to delete" });
    } else {
      return res.status(400).json({ message: "Deletion failed" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
async function fetchCatOffer(req, res) {
  try {
    const categoryOffer = await Offer.find({ target_type: "category" });
    return res.json({ categoryOffer });
  } catch (err) {
    console.log(err);
  }
}
async function fetchPrdOffer(req, res) {
  try {
    const productOffer = await Offer.find({ target_type: "product" });
    console.log(productOffer);

    return res.json({ productOffer });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  addProductOffer,
  addCategoryOffer,
  checkofferexist,
  deleteOffer,
  fetchCatOffer,
  fetchPrdOffer,
};
