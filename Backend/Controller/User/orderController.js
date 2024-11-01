const Cart = require("../../Models/Cart");
const Order = require("../../Models/order");
const Product = require("../../Models/product");

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
          });
        }
      });
      //creating order collection document
      const order = await Order.create({
        user,
        order_items: products,
        order_status: "Pending",
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
   
    manageProductQty(order.order_items)

      return res
        .status(201)
        .json({ success: true, message: "Order Placed", order });
    } catch (err) {
        console.log(err);
        
    }
} 

async function manageProductQty(order_items) {
 for (const item of order_items) {
   try {
      const product = await Product.findById(item.product);
      const sizeObject = product.sizes.find((size) => size.size === item.size);

        if (sizeObject) {
         sizeObject.stock -= item.qty; 
         await product.save(); 
       } else {
         console.warn(`Size ${item.size} not found for product ${product._id}`);
       }
   } catch (error) {
     console.error(`Error fetching product ${item.product}:`, error);
   }
 }

}

async function fetchOrders(req,res) {
  try {
    const { _id } = req.params;
    const orders = await Order.find({ user: _id })
      .populate("user") 
      .populate("shipping_address") 
      .populate("order_items.product"); 

    if (!orders) {
      return res
        .status(404)
        .json({ success: true, message: "Order Fetch failed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Order Fetched Successfully", orders });
  } catch (err) {
    console.log(err);
    
  }
}

async function fetchOrderDetails(req,res) {
  try {
    const {id} = req.params;
    const order = await Order.findOne({ order_id: id })
      .populate("user")
      .populate("shipping_address")
      .populate("order_items.product"); ;
    if(!order){
      res
        .status(404)
        .json({ success: false, message: "Details fetch failed" });
    }    
    res.status(200).json({success:true,message:"Details fetched succesfully",order})
  } catch (err) {
    console.log(err);
    
  }
}

module.exports = {
  createOrder,
  fetchOrders,
  fetchOrderDetails,
};