function calculateRefundAmount(theOrderData, item_id) {
  const orderData = theOrderData.toObject();
  const couponDiscountAmt = orderData.coupon_discount;
  const price_with_coupon = orderData.total_price_with_discount;
  console.log(couponDiscountAmt);

  const total_without_coupon = price_with_coupon + couponDiscountAmt;
  const orderItems = orderData.order_items;

  // Proportion of coupon applied
  if (couponDiscountAmt > 0) {
    orderItems.forEach((item) => {
      console.log(item.total_price);

      item.couponDiscountProportion =
        (item.total_price / total_without_coupon) * couponDiscountAmt;
    });
  }

  // Corrected `find` condition
  const cancelledProduct = orderItems.find(
    (item) => item._id.toString() === item_id
  );

  // Check if cancelledProduct is found
  if (!cancelledProduct) {
    throw new Error("Cancelled product not found in the order items");
  }

  console.log("cancelledProduct:::::::::>", cancelledProduct);

  const proportion = cancelledProduct.couponDiscountProportion;
  const priceOfCancelledProduct =
    cancelledProduct.total_price * cancelledProduct.qty;
  return priceOfCancelledProduct - proportion;
}

module.exports = calculateRefundAmount;
