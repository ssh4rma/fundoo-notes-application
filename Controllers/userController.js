import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: hash,
  });

  res.status(201).json({
    _id: user._id,
    firstname,
    email,
    token: genToken(user._id),
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user._id);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      firstname: user.firstname,
      email,
      token: genToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No user with that email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.token = resetToken;
  await user.save();

  res.json({ message: "Reset token generated", resetToken });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  user.password = await bcrypt.hash(password, 10);
  user.token = null;
  await user.save();

  res.json({ message: "Password updated. You can log in now." });
});

export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
