const Cart = require("../../Models/Cart");
const Order = require("../../Models/order");
const Product = require("../../Models/product");
const Wallet = require("../../Models/wallet");

async function createOrder(req, res) {
  console.log("call readched----------------------");

  try {
    const {
      user,
      cartItems,
      total_amount,
      total_discount,
      coupon_Discount,
      total_price_with_discount,
      shipping_address,
      payment_method,
      cart_id,
    } = req.body;

    console.log(
      "user==============>",
      user,
      "cartItems==============>",
      cartItems,
      "total_amount==============>",
      total_amount,
      "total_discount==============>",
      total_discount,
      "coupon_Discount==============>",
      coupon_Discount,
      "total_price_with_discount==============>",
      total_price_with_discount,
      "shipping_address==============>",
      shipping_address,
      "payment_method==============>",
      payment_method,
      "cart_id==============>",
      cart_id
    );

    const products = [];

    console.log("TOTAL AMOUNT:", total_amount);

    //creating product array
    cartItems.forEach((item) => {
      if (item.qty >= 1) {
        products.push({
          product: item.productId._id,
          qty: item.qty,
          size: item.size,
          price: item.discountedAmount || item.salePrice,
          discount: item.discount || 0,
          total_price: item.discountedAmount || item.salePrice,
        });
      }
    });
    //creating order collection document
    const order = await Order.create({
      user,
      order_items: products,
      order_status: "Pending",
      total_amount: total_amount,
      total_discount,
      coupon_discount: coupon_Discount,
      shipping_address,
      payment_method,
      total_price_with_discount: total_price_with_discount,
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
    manageProductQty(order.order_items);

    console.log("user--------->", user);

    let myWallet = await Wallet.findOne({ user: user });
    if (!myWallet) {
      return res.status(404).json({ message: "unable to find your wallet" });
    }
    myWallet.balance -= total_price_with_discount;
    const transactions = {
      order_id: order._id,
      transaction_date: new Date(),
      transaction_type: "debit",
      transaction_status: "completed",
      amount: total_price_with_discount,
    };
    myWallet.transactions.push(transactions);

    myWallet.save();

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
        product.totalStock -= item.qty;
        await product.save();
      } else {
        console.warn(`Size ${item.size} not found for product ${product._id}`);
      }
    } catch (error) {
      console.error(`Error fetching product ${item.product}:`, error);
    }
  }
}

async function manageProductQtyAfterCancel(order_items) {
  for (const item of order_items) {
    try {
      const product = await Product.findById(item.product);
      const sizeObject = product.sizes.find((size) => size.size === item.size);

      if (sizeObject) {
        sizeObject.stock += item.qty;
        product.totalStock += item.qty;
        await product.save();
      } else {
        console.warn(`Size ${item.size} not found for product ${product._id}`);
      }
    } catch (error) {
      console.error(`Error fetching product ${item.product}:`, error);
    }
  }
}

async function fetchOrders(req, res) {
  try {
    const { _id } = req.params;
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("shipping_address")
      .populate("order_items.product")
      .sort({ placed_at: -1 });

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

async function fetchOrderDetails(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ order_id: id })
      .populate("user")
      .populate("shipping_address")
      .populate("order_items.product");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Details fetch failed" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Details fetched succesfully", order });
  } catch (err) {
    console.log(err);
  }
}

async function returnOrder(req, res) {
  try {
    const { order_id } = req.params;
    console.log(order_id);

    const updatedData = await Order.findByIdAndUpdate(
      { _id: order_id },
      { order_status: "Returned" },
      { new: true }
    );
    if (!updatedData) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to return your order" });
    }
    return res.status(200).json({
      success: true,
      message: "Your order has been successfully returned",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function cancelOrder(req, res) {
  try {
    const { order_id } = req.params;
    const { order_items } = req.body;
    console.log(order_items);

    console.log(order_id);

    const updatedData = await Order.findByIdAndUpdate(
      { _id: order_id },
      { order_status: "Cancelled" },
      { new: true }
    );
    manageProductQtyAfterCancel(order_items);
    if (!updatedData) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to cancel your order" });
    }
    return res.status(200).json({
      success: true,
      message: "Your order has been successfully cancelled",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  createOrder,
  fetchOrders,
  fetchOrderDetails,
  cancelOrder,
  returnOrder,
};
