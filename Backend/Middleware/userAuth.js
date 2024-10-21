const otpSchema = require("../Models/otpStore");
const User = require("../Models/UserModel")
const jwt = require("jsonwebtoken");
const generateAccessToken = require("../utils/genarateAccessToken");


const verifyOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    // Find the OTP data based on email
    const otpData = await otpSchema.findOne({ email });
    if (!otpData) {
      return res
        .status(404)
        .json({ success: false, message: "OTP not found." });
    }

    // Compare the provided OTP with the stored OTP
    if (otp === otpData.otp) {
      console.log("OTP verified, proceeding to next step.");
      next(); // Proceed to the next middleware (register function)
    } else {
      console.log("Invalid OTP.");
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};



const jwtVerification = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

  
    if (accessToken) {
      const Accessverified = jwt.verify(
        accessToken,
        "AccesstokenKeyShouldReplaceLater"
      );
      console.log("AccessTOKEN verified");

   
      const user = await User.findById(Accessverified.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      req.user = user;
      return next();
    }


    else if (refreshToken) {
      const RefreshVerified = jwt.verify(
        refreshToken,
        "RefreshtokenKeyShouldReplaceLater"
      );
      console.log("Refresh token verified");

 
      const user = await User.findById(RefreshVerified.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

   
      const newAccessToken = generateAccessToken(user._id);

      
      console.log("new access created")
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, 
      });

   
      req.user = user;
      return next();
    }

    
    return res
      .status(401)
      .json({ message: "Unauthorized: No valid tokens found" });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: "Unauthorized: Token verification failed" });
  }
};




module.exports = {
  verifyOtp,
  jwtVerification,
};
