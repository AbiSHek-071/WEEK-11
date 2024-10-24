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

//...........ROUTES................

//admin controller routes
adminRoute.get("/createadmin/:email", adminController.createAdmin);
adminRoute.post("/login",adminController.login);

//category Controller routes 
adminRoute.post("/categories",adminAuth.jwtVerification,categoryController.addCategory);
adminRoute.get("/categories",adminAuth.jwtVerification,categoryController.fetchCategory);
adminRoute.get("/category/:id",adminAuth.jwtVerification,categoryController.getCategory);
adminRoute.put("/category",adminAuth.jwtVerification,categoryController.editcategory);
adminRoute.get("/categories/active",adminAuth.jwtVerification,categoryController.sendCatgories); 
adminRoute.put("/categories/toggle-status",adminAuth.jwtVerification,categoryController.toggleCategory);

//user Controller routes
adminRoute.get("/users", adminAuth.jwtVerification, userController.getUsers);
adminRoute.put("/users/block",adminAuth.jwtVerification,userController.blockUser);


//products Controller routes
adminRoute.post("/product",adminAuth.jwtVerification,productController.addProduct);
adminRoute.get("/products",adminAuth.jwtVerification,productController.fetchProducts);
adminRoute.put("/product",adminAuth.jwtVerification,productController.editProduct);
adminRoute.put("/products/status",adminAuth.jwtVerification,productController.toggleProduct);


module.exports = adminRoute;
