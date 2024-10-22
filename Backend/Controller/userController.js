const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt");
const User = require("../Models/UserModel");
const otpSchema = require("../Models/otpStore");
const {mailSender} = require("../utils/nodeMailer");
const category = require("../Models/category");
const { find } = require("../Models/admin");
const product = require("../Models/product");
const generateAccessToken = require("../utils/genarateAccessToken");
const generateRefreshToken = require("../utils/genarateRefreshToken");
const reviews = require("../Models/reviews");
const sendOtp = async(req,res)=>{

    try{
        const {email} = req.body;
        const checkExist = await User.findOne({email});
        if(checkExist){
            return res.status(409)
            .json({success:false,message:"E-mail already Exist"});
        }
        let otp = otpGenerator.generate(5,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
       await otpSchema.create({email,otp})

        const mailRes = await mailSender(
          email,
         " <h1>OTP HERE IS</h1>",
          `<h2>${otp}</h2>`,
        );
       
        return res.status(200).json({success:true,message:"OTP Send Successfully",otp})

    }catch(err){message;
        console.log(err);
        
    }
}

const register = async(req,res)=>{
    
    try{
        const {name,email,phone,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10) 
        await User.create({name,email,phone,password:hashedPassword});
        return res.status(200).json({success:false,message:"Your are Registereed to Stitchers,Welcome"})

    }catch(err){
        console.log(err);
        
    }
}
const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered, Please Signup",
      });
    }

    const matchPass = await bcrypt.compare(password, userData.password);
    if (matchPass) {
      if (userData.isActive == false) {
        const message = `Your account is currently inactive, and access to the website is restricted...!`;
        return res.status(403).json({ success: false, message });
      }

      userData.password = undefined;

      const accessToken = generateAccessToken(userData._id);
      const refreshToken = generateRefreshToken(userData._id);

     
      
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes expiration for access token
      });

    
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, 
        secure: false, 
        sameSite: "Strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration for refresh token
      });
      return res.status(200).json({
        success: true,
        message: "Login Successful, Welcome Back",
        userData,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
   
    console.error("Unexpected error during login:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const googleAuth = async (req, res) => {
  try {
   
    const { sub, name, email } = req.body;
    const userData = await User.findOne({ email });

    if (userData) {
      
      if (userData.googleId && userData.googleId == sub) {
        return res
          .status(200)
          .json({ success: true, message: "Login Successful",userData });
      }
      
      else if (userData.googleId && userData.googleId != sub) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized User" });
      }
      
      else if (!userData.googleId || userData.googleId === "") {
        userData.googleId = sub;
        await userData.save(); 
        
        return res
          .status(200)
          .json({ success: true, message: "Login Successful,Welcome Back",userData });
      }
    } else {
      
      const newUser = new User({
        name: name,
        email: email,
        googleId: sub,
      });
      const userData = await newUser.save();
      return res
        .status(201)
        .json({ success: true, message: "You are Registered, Welcome to Stitchers",userData });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


async function fetchnewarraivals (req,res){
  try {
    
      const productData = await product.find({ isActive: true }).populate({
        path: "category",
        match: { isActive: true }, 
        select: "name", 
      });
      const filteredProductData = productData.filter(
        (prod) => prod.category !== null
      );


      console.log("filtered product:", productData);
    if(!productData){
      return res.status(404).json({message:"Unable to fetch Image",success:false});
    }
    return res
      .status(200)
      .json({
        message: "products fetched successfully",
        success: true,
        productData: filteredProductData,
      });
  } catch (err) {
    console.log(err);
    
  }
}
async function fetchproduct(req,res) {
  try {
    const {id} = req.body;
    const productData = await product.findById({ _id:id });
        

    if(!productData){
      return res.status(404).json({success:true,message:"Unable to Find the Product,"});
    }
    return res.status(200).json({success:true,message:"Product Fetched",product:productData})
  } catch (err) {
    console.log(err);
    
  }
}

async function addReviews(req, res) {
  try {

    const { userId, productId, rating, review } = req.body;
    

    
    const reviewData = new reviews({
      user: userId,
      product: productId,
      description: review,
      rating,
    });

    const done = await reviewData.save();
    if (!done) {
      return res
        .status(404)
        .json({ success: false, message: "unable to add update your Review" });
    }
    return res
      .status(200)
      .json({ success: true, message: `Your review is added` });
    
  } catch (err) {
    console.log("error",err);
    res.status(500).json({ message: "Failed to add review" });
  }
}

async function fetchReviews(req, res) {
  try {
    const productId = req.params.id;

    const reviewsData = await reviews
      .find({ product: productId })
      .populate("user", "_id name email"); 

     
      
    if (!reviewsData || reviewsData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews Yet",
      });
    }

    return res.status(200).json({
      success: true,
      reviews: reviewsData,
    });
  } catch (err) {
    console.log("failed to fetch",err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
}
async function fetchAverageRating(req, res) {
  try {
    const productId = req.params.id;
    const reviewsData = await reviews.find({ product: productId });
    let sum = 0;
    reviewsData.forEach((review) => {
      sum += review.rating; 
    });

  
    let avg = sum / reviewsData.length;
  
  let roundedAvg = Math.round(avg); 
    return res.status(200).json({
      success: true,
      averageRating: roundedAvg,
    });
  } catch (err) {
    console.error("Error fetching average rating:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


async function fetchRelatedProducts(req,res) {
  try {

    
    const {categoryId} =req.body;    
    const productData = await product.find({category:categoryId, isActive: true }).populate({
      path: "category",
      match: { isActive: true },
      select: "name",
    });
    const filteredProductData = productData.filter(
      (prod) => prod.category !== null
    );

    console.log("filtered product:", productData);
    if (!productData) {
      return res
        .status(404)
        .json({ message: "Unable to fetch Image", success: false });
    }
    return res.status(200).json({
      message: "products fetched successfully",
      success: true,
      productData: filteredProductData,
    });
  } catch (err) {
    console.log(err);
  }
}





module.exports = {
  sendOtp,
  register,
  login,
  googleAuth,
  fetchnewarraivals,
  fetchproduct,
  addReviews,
  fetchReviews,
  fetchAverageRating,
  fetchRelatedProducts,
};
