const bcrypt = require("bcrypt");
const Admin = require("../../Models/admin");
const generateAccessToken = require("../../utils/genarateAccessToken");
const generateRefreshToken = require("../../utils/genarateRefreshToken");

async function createAdmin(req, res) {
  console.log("esd");
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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const adminData = await Admin.findOne({ email });
    if (!adminData) {
      return res.status(401).json({
        success: false,
        message: "Not a Admin or invalid credentials",
      });
    }
    const matchPass = await bcrypt.compare(password, adminData.password);
    if (!matchPass) {
      return res.status(401).json({
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
    console.log("admin A", accessToken);
    console.log("admin R", refreshToken);

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
    adminData.password = undefined;
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


module.exports = {
  createAdmin,
  login,
};