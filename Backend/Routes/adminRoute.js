const express = require("express");
``;
const Admin =require("../Models/admin");
const adminRoute = express.Router();

const adminController = require("../Controller/adminController");
const adminAuth = require("../Middleware/adminAuth")

adminRoute.get("/createadmin/:email", adminController.createAdmin);
adminRoute.post("/login",adminController.login);
adminRoute.post("/addcategory",adminAuth.jwtVerification,adminController.addCategory);
adminRoute.get("/category",adminAuth.jwtVerification,adminController.fetchCategory);
adminRoute.get("/editcategory/:id",adminAuth.jwtVerification,adminController.getCategory);
adminRoute.post("/editCategory",adminAuth.jwtVerification,adminController.editcategory);
adminRoute.post("/togglecategory",adminAuth.jwtVerification,adminController.toggleCategory);
adminRoute.get("/userdata",adminAuth.jwtVerification,adminController.getUsers);
adminRoute.post("/blockuser",adminAuth.jwtVerification,adminController.blockUser);
adminRoute.get("/getcategory",adminAuth.jwtVerification,adminController.sendCatgories);
adminRoute.post("/addproduct",adminAuth.jwtVerification,adminController.addProduct);
adminRoute.get("/fetchproducts",adminAuth.jwtVerification,adminController.fetchProducts);
adminRoute.put("/editproduct",adminAuth.jwtVerification,adminController.editProduct);
adminRoute.put("/toggleproduct",adminAuth.jwtVerification,adminController.toggleProduct);
module.exports = adminRoute;
