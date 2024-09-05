const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const userDTO = require("../dto/user.dto");
const JWTservices = require("../services/JWT.services");
const RefreshToken = require("../models/token.model");
const { JSONCookie } = require("cookie-parser");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, name, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username not available, choose another username!",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // GENERATING TOKEN
      accessToken = JWTservices.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTservices.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // STORE REFRESH TOKEN IN DB
    await JWTservices.storeRefreshToken(refreshToken, user._id);

    // SEND TOKEN IN COOKIES
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true, // xss attacks, what are they,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // SENDING RESPONSE
    const userDto = new userDTO(user);
    return res.status(201).json({ user: userDto, auth: true });
  },

  // USER LOGIN CONTROLLER
  async login(req, res, next) {
    // VALIDAING USER INPUT
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    let user;

    try {
      // MATCH USERNAME
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };

        return next(error);
      }

      // MATCH PASSWORD

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTservices.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTservices.signRefreshToken({ _id: user._id }, "60m");

    // UPDATE REFRESH TOKEN IN DATABASE

    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new userDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },

  // LOG OUT CONTROLLER

  async logout(req, res, next) {
    // DELETE REFRESH TOKEN FROM DATABASE
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // DELETE COOKIES
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // RESPONSE
    res.status(200).json({ user: null, auth: false });
  },

  // REFRESH CONTROLLER

  async refresh(req, res, next) {
    // GET REFRESH TOKEN FROM COOKIES
    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    // VERIFY REFRESH TOKEN
    try {
      id = JWTservices.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    // GENERATE NEW TOKENS
    try {
      const accessToken = JWTservices.signAccessToken({ _id: id }, "30m");

      const refreshToken = JWTservices.signRefreshToken({ _id: id }, "60m");

      // UPDATING DATABASE AND SENDING RESPONSE

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new userDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController;
