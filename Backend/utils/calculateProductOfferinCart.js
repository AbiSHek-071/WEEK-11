function calculateProductOfferinCart(item) {
  const productOffer = item.productId.offer?.offer_value || 0;
  const categoryOffer = item.productId.category.offer?.offer_value || 0;

  console.log("Product Offer:", productOffer);
  console.log("Category Offer:", categoryOffer);

  let discountAmount = 0;
  let discountPercentage = 0;

  // Determine the highest discount offer
  if (categoryOffer > productOffer) {
    discountAmount = (item.salePrice * categoryOffer) / 100;
    discountPercentage = categoryOffer; // Category offer percentage
  } else if (productOffer > categoryOffer) {
    discountAmount = (item.salePrice * productOffer) / 100;
    discountPercentage = productOffer; // Product offer percentage
  } else if (productOffer === categoryOffer && productOffer > 0) {
    // If both are equal and greater than 0, apply either
    discountAmount = (item.salePrice * productOffer) / 100;
    discountPercentage = productOffer;
  }

  console.log("Final discountAmount outside:", discountAmount);

  // Calculate the final price after discount
  const discountedAmount = item.salePrice - discountAmount;

  // Assign the discount-related fields to the item
  item.discount = discountPercentage;
  item.discountAmount = discountAmount;
  item.discountedAmount = discountedAmount;
}

module.exports = calculateProductOfferinCart;
