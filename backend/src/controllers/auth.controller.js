import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import {
  generateTokenCookie,
  generateVerificationCode,
} from "../libs/utils.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    // check input fields
    if (!email || !fullName || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email });

    if (user)
      return res.status(400).json({ message: "Email is already taken." });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });

    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = generateVerificationCode();

    // create new user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // save user data to db and generate token + cookie for auth
    if (newUser) {
      await newUser.save();
      generateTokenCookie(newUser._id, res);
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        verificationToken: newUser.verificationToken,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const verifyEmail = async (req, res) => {};

export const updateProfile = async (req, res) => {};
