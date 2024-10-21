const jwt = require("jsonwebtoken");
const generateAccessToken = require("../utils/genarateAccessToken");
const Admin = require("../Models/admin");

const jwtVerification = async (req, res, next) => {
  try {
    const accessToken = req.cookies.adminAccessToken;
    const refreshToken = req.cookies.adminRefreshToken;

    if (accessToken) {
      const Accessverified = jwt.verify(
        accessToken,
        "AccesstokenKeyShouldReplaceLater"
      );
      console.log("AccessTOKEN verified");

      const adminData = await Admin.findById(Accessverified.id).select("-password");
      if (!adminData) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Admin not found" });
      }

      req.Admin = adminData;
      return next();
    } else if (refreshToken) {
      const RefreshVerified = jwt.verify(
        refreshToken,
        "RefreshtokenKeyShouldReplaceLater"
      );
      console.log("Refresh token verified");

      const adminData = await Admin.findById(RefreshVerified.id).select("-password");
      if (!adminData) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Admin not found" });
      }
      console.log(adminData)
      const newAccessToken = generateAccessToken(adminData._id);

      console.log("new access created");
      res.cookie("adminAccessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000,
      });

      req.Admin = adminData;
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
  jwtVerification,
};
