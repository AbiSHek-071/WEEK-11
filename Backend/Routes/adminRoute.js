const express = require("express");
``;
const Admin =require("../Models/admin");
const adminRoute = express.Router();


//Controllers Here
const adminController = require("../Controller/Admin/adminController");
const productController = require("../Controller/Admin/productController")
const categoryController = require("../Controller/Admin/categoryController");
const userController = require("../Controller/Admin/userController")
const adminAuth = require("../Middleware/adminAuth")

//admin controller routes
adminRoute.get("/createadmin/:email", adminController.createAdmin);
adminRoute.post("/login",adminController.login);

//category Controller routes 
adminRoute.post("/addcategory",adminAuth.jwtVerification,categoryController.addCategory);
adminRoute.get("/category",adminAuth.jwtVerification,categoryController.fetchCategory);
adminRoute.get("/editcategory/:id",adminAuth.jwtVerification,categoryController.getCategory);
adminRoute.post("/editCategory",adminAuth.jwtVerification,categoryController.editcategory);
adminRoute.get("/getcategory",adminAuth.jwtVerification,categoryController.sendCatgories);
adminRoute.post("/togglecategory",adminAuth.jwtVerification,categoryController.toggleCategory);

//user Controller routes
adminRoute.get("/userdata",adminAuth.jwtVerification,userController.getUsers);
adminRoute.post("/blockuser",adminAuth.jwtVerification,userController.blockUser);


//products Controller routes
adminRoute.post("/addproduct",adminAuth.jwtVerification,productController.addProduct);
adminRoute.get("/fetchproducts",adminAuth.jwtVerification,productController.fetchProducts);
adminRoute.put("/editproduct",adminAuth.jwtVerification,productController.editProduct);
adminRoute.put("/toggleproduct",adminAuth.jwtVerification,productController.toggleProduct);


module.exports = adminRoute;
