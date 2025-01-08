import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import {
  generateTokenCookie,
  generateVerificationCode,
} from "../libs/utils.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../libs/mailtrap/emails.js";
import cloudinary from "../libs/cloudinary.js";

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
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }

    // send verification email
    await sendVerificationEmail(
      newUser.email,
      newUser.fullName,
      verificationToken
    );
    return res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      verificationToken: newUser.verificationToken,
    });
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // find user and check if valid token and hasn't expired
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        message: "Invalid or expired verification code.",
      });

    // update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // send welcome email
    await sendWelcomeEmail(user.email, user.fullName);
    return res.status(200).json({
      message: "Email verified successfully",
      email: user.email,
      fullName: user.fullName,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.log("Error in verifyEmail", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // check if user is in the database
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token and cookie for login
    generateTokenCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // checking if profile picture provided
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic)
      return res.status(400).json({ message: "Profile Picture Required" });

    // upload image into cloudinary and update user with the uploaded picture
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile", error.message);
    res.status(500).json({ message: "Invalid Server Error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
