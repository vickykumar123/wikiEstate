import User from "../model/userModel.js";
import { appError } from "../utils/appError.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    // console.log(req.body);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    res.status(201).json({
      status: "success",
      user: newUser,
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "failed",
    //   error: err.message,
    // });
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(appError(400, "Please provide email and password"));

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return next(appError(400, "Please provide valid email and password"));

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch)
      return next(appError(400, "Please provide valid email and password"));
    user.password = undefined;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // hour*min*sec*milliSec
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      err: err.message,
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return next(
        appError(403, "🙅🏻🙅🏻 You are not logged in, Please login to access")
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //if user exist signIn directly
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;
      res.cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // hour*min*sec*milliSec
        httpOnly: true,
      });
      res.status(200).json({
        status: "success",
        user,
      });
    } else {
      //if user donot exist generate the password and create the user in database
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatedPassword, 12);
      const generatedUsername =
        req.body.name.split(" ").join("-") +
        Math.random().toString(36).slice(-5);
      const newUser = new User({
        username: generatedUsername,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.avatar,
      });
      await newUser.save({ validateBeforeSave: false });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      newUser.password = undefined;
      res.cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // hour*min*sec*milliSec
        httpOnly: true,
      });
      res.status(200).json({
        status: "success",
        user: newUser,
      });
    }
  } catch (err) {
    next(err);
  }
};
