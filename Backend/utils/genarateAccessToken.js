const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    
  return jwt.sign({ id: userId }, "AccesstokenKeyShouldReplaceLater", {
    expiresIn: "15m",
  });
 
  
};

module.exports = generateAccessToken;
