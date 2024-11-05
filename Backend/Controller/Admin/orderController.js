const Order = require("../../Models/order");

async function fetchOrders(req,res) {
    try {
        const orders = await Order.find().populate("user")
      .populate("shipping_address")
      .populate("order_items.product"); ;;
        res.status(200).json({sucess:true,orders})
    } catch (err) {
        console.log(err);
        
    }
}

async function switchStatus(req,res) {
    try {
        const {orderId} = req.params;
        console.log(orderId);
        
        const {newStatus} = req.params;
        const updateData = await Order.findByIdAndUpdate(
          { _id: orderId },
          { order_status :newStatus},
          {new:true}
        );
        if(!updateData){
            return res
              .status(404)
              .json({ sucess: false, message: "Order Status Update failed" });
        }
        return res.status(200).json({sucess:true,message:"Order Status Updated"});

        
    } catch (err) {
        console.log("errr:",err);
        
    }
}


module.exports={
fetchOrders,
switchStatus,
}