
const express = require("express");``
const User = require("../Models/UserModel");
const userRoute = express.Router();  

const userController = require("../Controller/userController");
const userAuth = require("../Middleware/userAuth");



userRoute.post("/sendotp", userController.sendOtp);
userRoute.post("/register", userAuth.verifyOtp, userController.register);
userRoute.post("/login", userController.login);
userRoute.post("/googleAuth", userController.googleAuth);
userRoute.get("/fetchnewarraivals",userAuth.jwtVerification,userController.fetchnewarraivals);
userRoute.post("/fetchproduct",userController.fetchproduct);
userRoute.post("/addreviews",userController.addReviews)
userRoute.get("/fetchreviews:id",userController.fetchReviews);
userRoute.get("/fetchproductreviewcount:id", userController.fetchAverageRating);
userRoute.post("/fetchrelatedproducts",userController.fetchRelatedProducts);
module.exports = userRoute;  
