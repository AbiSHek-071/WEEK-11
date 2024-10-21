const bcrypt = require("bcrypt");
const Admin = require("../Models/admin");
const Category = require("../Models/category");
const User = require("../Models/UserModel");
const Product = require("../Models/product"); 
const generateAccessToken = require("../utils/genarateAccessToken");
const generateRefreshToken = require("../utils/genarateRefreshToken");


async function createAdmin(req,res) {
  try {

    
    const adminPassword = "admin";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = new Admin({
      email: req.params.email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}



async function login(req,res) {
    try {
           
        const {email,password} = req.body;

        const adminData = await Admin.findOne({email});
        if(!adminData){
            return res.status(401).json({success:false,message:"Not a Admin or invalid credentials"})
        }
        const matchPass = await bcrypt.compare(password,adminData.password);
        if(!matchPass){
             return res
               .status(401)
               .json({
                 success: false,
                 message: "Not a Admin or invalid credentials",
               });
        }
        if (adminData.role != "admin") {
             return res.status(401).json({
               success: false,
               message: "Not a Admin or invalid credentials",
             });
        }
          const accessToken = generateAccessToken(adminData._id);
          const refreshToken = generateRefreshToken(adminData._id);

          res.cookie("adminAccessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000, 
          });

          res.cookie("adminRefreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          return res.status(200).json({
            success: true,
            message: "Login Successful, Welcome Back",
            adminData,
          });
      
        


    } catch (err) {
       
    console.error("Unexpected error during login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
    }
}
async function addCategory(req,res){
  try {
    console.log("recived");
    
    const {name,description} = req.body;
    const category = new Category({
      name,
      description,
    });
    const done = await category.save();
    if(!done){
      return res.status(404).json({success:false,message:"unable to add category"})
    }
    return res
      .status(200)
      .json({ success: true, message: `${name} is added to categories` });
    
  } catch (err) {
    console.log(err);
    
  }
}
async function fetchCategory(req,res) {
  try {
    const categories = await Category.find();
    if(!categories){
       return res.status(404)
     .json({ success: false, message: "Category fetch failed"});
    }
   return res
     .status(200)
     .json({ success: true, message: "Category fetched successfully",categories});
     
  } catch (err) {
    console.log(err);
    
  }
}
async function getCategory(req,res) {
  try {
    const {id} = req.params;
    
    const categoryData = await Category.findOne({ _id: id });
   
    

    if(!categoryData){
      return res.status(404).json({success:false,message:"Unable to fetch data from Category"});
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Category Fetched Succesfully",
        categoryData,
      });

    
    
  } catch (err) {
    console.log(err);
    
  }
}

async function editcategory(req, res) {
  try {
    const { id, name, description } = req.body;
    const updatedData = await Category.findByIdAndUpdate(
      id, 
      { name, description, updatedAt: Date.now() },
      { new: true } 
    );

    if (!updatedData) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to update" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully", updatedData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
async function toggleCategory(req,res) { 
  try {
    const {_id,isActive} = req.body;

    
    const updateData = await Category.findByIdAndUpdate(
      { _id },
      {
        isActive:isActive?false:true,
      },{
        new:true
      }
    );
    if (!updateData) {
      return res.status(400).json({ message: "unable to update, please try again" });
    }
    if (updateData.isActive) {
      return res.status(200).json({ message: "Category enabled" });
    } else {
      return res.status(200).json({ message: "Category disabled" });
    }
  } catch (err) {
    console.log(err);
    
  }
}

async function getUsers(req, res) {
 try {
   const userData = await User.find();
   if (!userData) {
     return res
       .status(404)
       .json({ success: false, message: "user fetch failed" });
   }
   return res
     .status(200)
     .json({
       success: true,
       message: "Users fetched successfully",
       users:userData,
     });
 } catch (err) {
   console.log(err);
 }
}
async function blockUser(req, res) {
  try {
    const { _id, isActive } = req.body;

 
    const updateData = await User.findByIdAndUpdate(
      _id, 
      {
        isActive: !isActive, 
      },
      {
        new: true, 
      }
    );

    if (!updateData) {
      return res
        .status(400)
        .json({ message: "Unable to update, please try again" });
    }


    if (updateData.isActive) {
      return res.status(200).json({ message: `${updateData.name} is Unblocked` });
    } else {
      return res.status(200).json({ message: `${updateData.name} is Blocked` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function sendCatgories(req, res) {
  try {
    
    
    const categories = await Category.find(); 

    
    if(categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }

    return res.status(200).json({
      success: true,
      message: "categories fetched successfully",
      categories,
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ success: false, message: "Server error" }); 
  }
}


async function addProduct(req,res) {
  try {
    const {
      name,
      price,
      description,
      sizes,
      addInfo,
      catId,
      sleeve,
      uploadedImageUrls,
    } = req.body;
    let totalStock = 0;

    sizes.forEach((size) => {
      for (let key in size) {
        if (key === "stock") {
          totalStock += size[key];
        }
      }
    });
    
 

    const product = new Product({
      name,
      description,
      information:addInfo,
      price,
      category: catId,
      sleeve,
      sizes,
      totalStock,
      images:uploadedImageUrls,
    });
    const done = await product.save();
    
    if(!done){
      return res.status(404).json({success:false,message:"Unable to add the product"});
    }
    return res.status(201).json({success:true,message:"Product added Successfully"});


  } catch (err) {
    console.log(err);
    
  }
}

async function fetchProducts(req,res) {
  try {
   const products = await Product.find({}).populate("category", "name");


    if(products.length == 0){
      return res.status(404).json({ success:false,message:"unable to fetch products"})
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Products list fetched Successfully",
        products,
      });
  } catch (err) {
    console.log(err);
    
  }
}

async function editProduct(req,res) {
  try {    
    const {_id,
          name,
          description,
          price,
          category,
          sleeve,
          sizes,
          images} = req.body;

          let totalStock = 0;

          sizes.forEach((size) => {
            for (let key in size) {
              if (key === "stock") {
                totalStock += size[key];
              }
            }
          });

          const updateData = await Product.findByIdAndUpdate(
            { _id },
            { name, description, price, category, sleeve,totalStock, sizes, images },
            {new:true}
          );

          if(!updateData){
            return res.status(400).json({success:false,message:"Unable to update the product"});
          }
          return res
            .status(200)
            .json({ success: false, message: "Product Updated" });
  } catch (err) {
    console.log(err);
    
  }
}
async function toggleProduct(req,res) {
  try {
    const { _id, isActive } = req.body;
   

    const updateData = await Product.findByIdAndUpdate(
      { _id },
      {
        isActive: isActive ? false : true,
      },
      {
        new: true,
      }
    );
    if (!updateData) {
      return res
        .status(400)
        .json({ message: "unable to update, please try again" });
    }
    if (updateData.isActive) {
      return res.status(200).json({ message: "Product Listed" });
    } else {
      return res.status(200).json({ message: "Product Unlisted" });
    }
  } catch (err) {
    console.log(err);
    
  }
}


module.exports = {
  createAdmin,
  login,
  addCategory,
  fetchCategory,
  getCategory,
  editcategory,
  toggleCategory,
  getUsers,
  blockUser,
  sendCatgories,
  addProduct,
  fetchProducts,
  editProduct,
  toggleProduct,
};
