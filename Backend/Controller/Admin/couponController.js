const { default: Coupon } = require("../../Models/coupon");

async function addCoupon(req, res) {
  console.log("asdkjashdhasg");

  try {
    const { coupon } = req.body;
    const {
      code,
      description,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      expiration_date,
      usage_limit,
    } = coupon;

    const data = new Coupon({
      code,
      description,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      expiration_date,
      usage_limit,
    });

    await data.save();

    if (data) {
      return res
        .status(200)
        .json({ success: true, message: "Coupon added successfully" });
    }
    return res
      .status(400)
      .json({ success: false, message: "Unable to add Coupon" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  addCoupon,
};
