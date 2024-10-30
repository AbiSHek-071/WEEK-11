
const express = require("express");``
const User = require("../Models/UserModel");
const userRoute = express.Router();  


const userController = require("../Controller/User/userController");
const productController = require("../Controller/User/productController");
const reviewController = require("../Controller/User/reviewController");
const addressController = require("../Controller/User/addressController");
const cartController = require("../Controller/User/cartController")
const orderController = require("../Controller/User/orderController");
//authentications
const userAuth = require("../Middleware/userAuth");


// user controller routes
userRoute.post("/sendotp", userController.sendOtp);
userRoute.post("/register", userAuth.verifyOtp, userController.register);
userRoute.post("/login", userController.login);
userRoute.post("/googleAuth", userController.googleAuth);
userRoute.post("/edit",userController.editUser);

//product controller routes
userRoute.get("/products/new-arrivals",userAuth.jwtVerification,productController.fetchnewarraivals);
userRoute.post("/fetchproduct",productController.fetchproduct);
userRoute.post("/products/related", productController.fetchRelatedProducts);

//review controller routes
userRoute.post("/product/review",userAuth.checkUserBlocked, reviewController.addReviews);
userRoute.get("/products/:id/reviews", reviewController.fetchReviews);
userRoute.get("/products/:id/reviews/average-rating", reviewController.fetchAverageRating);

//address Controller rouutes
userRoute.post("/address",userAuth.checkUserBlocked,addressController.addAddress);
userRoute.get("/address/:id",addressController.fetchAddress);
userRoute.post("/address/edit",addressController.editAddress);
userRoute.delete("/address/:id",addressController.deleteAddress);

//cart controller routes
userRoute.post("/cart", cartController.addToCart);
userRoute.get("/cart/:id",cartController.fetchCart);
userRoute.patch("/cart/add/:cart_id/:user_id",cartController.plusCartItem);
userRoute.patch("/cart/min/:cart_id/:user_id", cartController.minusCartItem);
userRoute.delete("/cart/:cart_id/:user_id", cartController.removeCartItem);
userRoute.get("/size/:product_id/:user_id/:selected", cartController.fetchSize);

//order controller routes
userRoute.post("/order",orderController.createOrder);

module.exports = userRoute;  
