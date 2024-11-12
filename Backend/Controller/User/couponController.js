const Coupon = require("../../Models/coupon");

async function fetchCouponDetails(req, res) {
  try {
    const { couponCode } = req.query;

    const CouponData = await Coupon.findOne({ code: couponCode });

    if (!CouponData) {
      return res
        .status(404)
        .json({ success: false, message: "unable to fetch the couponData" });
    }
    return res
      .status(200)
      .json({ message: "couponData fetched successfully", CouponData });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { fetchCouponDetails };
