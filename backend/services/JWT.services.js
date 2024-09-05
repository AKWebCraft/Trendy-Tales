const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/token.model");

const ACCESS_TOKEN_SECRET =
  "ad6349fee295b70c6edc9cb5e9500a078cb803af3c080586287b0832d64407f513435530e4b15deac951fff0989f9a877ea1d19f547668bd7d0e3785be355e75";

const REFRESH_TOKEN_SECRET =
  "e9f866751758cac15c7922a7a283071071efdcbadfe7c098bc5de7d0ecd3aaac44967af90d75c617c95ac14e2fa227e06f3b9a1974f114f47510da051f1db9b";

class jwtServices {
  // SIGN ACESS TOKEN
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // SIGN REFRESH TOKEN
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // VERIFY ACCESS TOKEN
  static verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  // VERIFY REFRESH TOKEN
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  // STORE REFRESH TOKEN IN DATABASE
  static async storeRefreshToken(token, userId) {
    try {
      const newToken = new RefreshToken({
        token: token,
        userId: userId,
      });

      // STORE IN DB
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = jwtServices;
