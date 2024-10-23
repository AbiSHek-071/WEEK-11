
const express = require("express");``
const User = require("../Models/UserModel");
const userRoute = express.Router();  


const userController = require("../Controller/User/userController");
const productController = require("../Controller/User/productController");
const reviewController = require("../Controller/User/reviewController");

//authentications
const userAuth = require("../Middleware/userAuth");


// user controller routes
userRoute.post("/sendotp", userController.sendOtp);
userRoute.post("/register", userAuth.verifyOtp, userController.register);
userRoute.post("/login", userController.login);
userRoute.post("/googleAuth", userController.googleAuth);

//product controller routes
userRoute.get("/fetchnewarraivals",userAuth.jwtVerification,productController.fetchnewarraivals);
userRoute.post("/fetchproduct",productController.fetchproduct);
userRoute.post("/fetchrelatedproducts",productController.fetchRelatedProducts);

//review controller routes
userRoute.post("/addreviews",reviewController.addReviews)
userRoute.get("/fetchreviews:id",reviewController.fetchReviews);
userRoute.get("/fetchproductreviewcount:id", reviewController.fetchAverageRating);

module.exports = userRoute;  
