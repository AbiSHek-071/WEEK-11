const Order = require("../../Models/order")

async function createOrder(req,res) {
    try {
        const { user, cartItems, subtotal, shipping_address, payment_method } =
          req.body;
        const products = [];    

        cartItems.forEach((item) => {
          products.push({
            product: item.productId._id,
            qty: item.qty,
            price: item.salePrice,
            discount: 0,
            total_price: item.salePrice,
            order_status: "Pending",
            
          });
        });


      
        
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
         console.log("done");
         
         return res
           .status(201)
           .json({ success: true, message: "Order Placed" });

    } catch (err) {
        console.log(err);
        
    }
} 


module.exports = {
    createOrder,
}