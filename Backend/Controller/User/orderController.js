const Cart = require("../../Models/Cart");
const Order = require("../../Models/order")

async function createOrder(req,res) {
    try {
      const {
        user,
        cartItems,
        subtotal,
        shipping_address,
        payment_method,
        cart_id,
      } = req.body;
      const products = [];

      //creating product array
      cartItems.forEach((item) => {
        if (item.qty >= 1) {
          products.push({
            product: item.productId._id,
            qty: item.qty,
            size:item.size,
            price: item.salePrice,
            discount: 0,
            total_price: item.salePrice,
            order_status: "Pending",
          });
        }
      });
      //creating order collection document
      const order = await Order.create({
        user,
        order_items: products,
        total_amount: subtotal,
        shipping_address,
        payment_method,
        total_price_with_discount: subtotal,
        shipping_fee: 0,
      });
      await order.save();

  
    const cart = await Cart.findById(cart_id);

    //filtering and removing the ordered item in the specific size from the cart
    const updatedCartItems = cart.items.filter((cartItem) => {
     return !order.order_items.some(
       (orderItem) =>
         orderItem.product.equals(cartItem.productId) &&
         orderItem.size === cartItem.size
     );
   });
    cart.items = updatedCartItems;
    await cart.save();


      return res
        .status(201)
        .json({ success: true, message: "Order Placed", order });
    } catch (err) {
        console.log(err);
        
    }
} 


module.exports = {
    createOrder,
}