
const jwt = require("jsonwebtoken");
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, "RefreshtokenKeyShouldReplaceLater", {
    expiresIn: "7d",
  });
};

module.exports = generateRefreshToken;