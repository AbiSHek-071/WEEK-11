
//models
const User = require("../../Models/UserModel");
const otpSchema = require("../../Models/otpStore");
//utils
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const { mailSender } = require("../../utils/nodeMailer");
const otpEmailTemplate = require("../../utils/emailTemplate");
//functions
const generateAccessToken = require("../../utils/genarateAccessToken");
const generateRefreshToken = require("../../utils/genarateRefreshToken");


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkExist = await User.findOne({ email });
    if (checkExist) {
      return res
        .status(409)
        .json({ success: false, message: "E-mail already Exist" });
    }
    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    await otpSchema.create({ email, otp });
    const { subject, htmlContent } = otpEmailTemplate(otp);
    const mailRes = await mailSender(email, subject, htmlContent);

    return res
      .status(200)
      .json({ success: true, message: "OTP Send Successfully", otp });
  } catch (err) {
    console.log(err);
  }
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, phone, password: hashedPassword });
    return res
      .status(200)
      .json({
        success: false,
        message: "Your are Registereed to Stitchers,Welcome",
      });
  } catch (err) {
    console.log(err);
  }
};
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
          .json({ success: true, message: "Login Successful", userData });
      } else if (userData.googleId && userData.googleId != sub) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized User" });
      } else if (!userData.googleId || userData.googleId === "") {
        userData.googleId = sub;
        await userData.save();

        return res
          .status(200)
          .json({
            success: true,
            message: "Login Successful,Welcome Back",
            userData,
          });
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
        .json({
          success: true,
          message: "You are Registered, Welcome to Stitchers",
          userData,
        });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = {
    sendOtp,
    register,
    login,
    googleAuth,
};
